import dotenv from 'dotenv';
import helperFunctions from '../utils';
import { userServices } from '../services';
import { testUsername } from '../../tests/fixtures/user';

dotenv.config();

const { hashInput, verifyInput, generateTokenForLogin,
    sendLinkEmail } = helperFunctions;
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
        const testUser = { otp: req.OTP, token: req.confirmationToken };
        return res.status(201).json({
            status: 'Success',
            message: 'User has been signed up and OTP sent to their email',
            data: process.env.NODE_ENV === 'test' ? testUser : addedUser
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
        const testUser = { otp: req.OTP, token: req.confirmationToken }
        return res.status(201).json({
            status: 'Success',
            message: 'An OTP has been sent to user\'s email for verification',
            data: process.env.NODE_ENV === 'test' ? testUser : updatedUser
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
        const { otp_hash: hashedOTP, email } = req.user;
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
        if (user && user.is_confirmed && verifyInput(password, user.password_hash)) {
            const loginToken = generateTokenForLogin({ email, userId: user.userid, firstName: user.firstname });
            return res.status(201).json({
                status: 'Success',
                message: 'Login successful',
                data: { email, loginToken, hasWallet: user.walletid ? true : false }
            })  
        } else if (user && !user.is_confirmed) {
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
        const { email, firstname: firstName } = req.user;
        await sendLinkEmail(email, firstName, req.passwordToken);
        await updatePasswordResetToken(req.passwordToken, email);
        return res.status(201).json({
            status: 'Success',
            message: 'A link has been sent to your email for password reset',
            ...(process.env.NODE_ENV === 'test') && {data: req.passwordToken}
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
        await updatePassword(newPassword, req.user.email);
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
        const retrievedUser = await getUserProfile(req.user.userId);
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
