import helperFunctions from '../utils';
import { userServices } from '../services';

const { hashInput, verifyInput, generateTokenForLogin } = helperFunctions;
const { getSingleUserByUsername, addNewUser, updateOtpHash,
    updateUserVerificationStatus, getSingleUserByEmail,
    updatePasswordResetToken, updatePassword, getUserProfile
} = userServices;

export const checkIfUsernameIsUnique = async (req, res) => {
    try {
        const realUsername = req.body.username.toLowerCase();
        const user = await getSingleUserByUsername(realUsername);
        if (!user) {
            return res.status(201).json({
                status: 'Success',
                message: 'Username available'
            })
        } else {
            return res.status(409).json({
                status: 'Fail',
                message: 'Username already taken'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })
    }
};

export const registerUser = async (req, res) => {
    try {
        const passwordHash = hashInput(req.body.password);
        const hashedOTP = hashInput(req.OTP);
        const user = {
            ...req.body,
            password: passwordHash,
            otp: hashedOTP,
            confirmationToken: req.confirmationToken,
        };
        const addedUser = await addNewUser(user);
        return res.status(201).json({
            status: 'Success',
            message: 'User has been signed up and OTP sent to their email',
            data: addedUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })
    }
};

export const updateConfirmationToken = async (req, res) => {
    try {
        const hashedOTP = hashInput(req.OTP);
        const data = { hashedOTP, confirmationToken: req.confirmationToken }
        const updatedUser = await updateOtpHash(data, req.body.email);
        return res.status(201).json({
            status: 'Success',
            message: 'An OTP has been sent to your email for verification',
            data: updatedUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })  
    }
}

export const confirmUser = async (req, res) => {
    try {
        const { otp_hash: hashedOTP, email } = req.userToBeVerified;
        if (verifyInput(req.body.otp, hashedOTP)) {
            const updatedUser = await updateUserVerificationStatus(email);
            return res.status(201).json({
                status: 'Success',
                message: 'Email successfully verified',
                data: updatedUser
            })
        }
        return res.status(401).json({
            status: 'Fail',
            message: 'Invalid OTP entered'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await getSingleUserByEmail(email);
        if (user && user.is_confirmed === true && verifyInput(password, user.password_hash)) {
            const loginToken = generateTokenForLogin({ email, userId: user.id, firstName: user.first_name });
            return res.status(201).json({
                status: 'Success',
                message: 'Login successful',
                data: { ...user, loginToken }
            })  
        } else if (user && user.is_confirmed === false) {
            return res.status(401).json({
                status: 'Fail',
                message: 'Email not yet verified',
            }) 
        } else {
            return res.status(401).json({
                status: 'Fail',
                message: 'Invalid login details'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })
    }
};

export const sendPasswordResetLink = async (req, res) => {
    try {
        const { email, first_name: firstName } = req.user;
        console.log(email, firstName);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: `Jupyter Wallet Admin <${process.env.EMAIL_SENDER_TWO}>`,
            subject: 'Password Reset',
            text: `Dear ${firstName},
            Kindly click on the button below to reset your password.
            http://localhost:8080/resetForm/${req.passwordToken}`,
            html: `<h2> Dear ${firstName}, </h2>
            <p> Kindly click on the button below to reset your password. </p>
            <br>
            <a href="http://localhost:8080/resetForm/${req.passwordToken}"
            target="_blank"
            style="background-color:#1F6AEC; color:white; cursor:pointer;
            padding:10px; border:1pxsolid; text-decoration:none; border-radius:4px">
            Reset My Password
            </a>`,
        }
        sgMail
            .send(msg)
            .then( async (response) => {
                console.log(response[0].statusCode)
                console.log(response[0].headers)
                await updatePasswordResetToken(req.passwordToken, email);
                return res.status(201).json({
                    status: 'Success',
                    message: 'A link has been sent to your email for password reset',
                });
            }).catch((error) => {
                console.log(error);
                console.error(error);
                return res.status(400).json({
                    status: 'Fail',
                    message: error.message,
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })
    }
};

export const changePassword = async (req, res) => {
    try {
        const newPassword = hashInput(req.body.password);
        console.log(req.user.email, newPassword);
        await updatePassword(req.user.email, newPassword);
        return res.status(201).json({
            status: 'Success',
            message: 'Password reset successfully',
        })  
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })
    }
};

export const retrieveUserProfile = async (req, res) => {
    try {
        const retrievedUser = await getUserProfile(req.loggedInUser.userId);
        const newBalance = Number(retrievedUser.balance)/100;
        const updatedPhoneNumber = `0${retrievedUser.phone_number}`
        return res.status(200).json({
            status: 'Success',
            message: 'User profile fetched successfully',
            data: { ...retrievedUser, balance: newBalance, phone_number: updatedPhoneNumber }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        }) 
    }
};
