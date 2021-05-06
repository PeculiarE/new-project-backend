import dotenv from "dotenv";
import { differenceInDays, differenceInMinutes } from 'date-fns';
import sgMail from '@sendgrid/mail';

import { hashInput, verifyInput, generateTokenForLogin } from '../utils';
import { getSingleUserByUsername, addNewUser, updateOtpHash, updateUserVerificationStatus, getSingleUserByEmail,
    updatePasswordResetToken, updatePassword, getUserProfile,
} from '../services';

dotenv.config();

export const checkIfUsernameIsUnique = async (req, res) => {
    try {
        const { username } = req.body;
        const realUsername = String(username).toLowerCase();
        const user = await getSingleUserByUsername(realUsername);
        console.log(username, realUsername, user);
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

export const sendOtpWithSignup = async (req, res, next) => {
    try {
        const { email, firstName } = req.body;
        console.log(email);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: `Jupyter Wallet Admin <${process.env.EMAIL_SENDER_TWO}>`,
            subject: 'Email Verification',
            text: `Dear ${firstName},
            Thank you for signing up to our Wallet App.
            Kindly use the One-Time-Password (OTP) below to verify your email address.
            ${req.OTP}`,
            html: `<h2> Dear ${firstName}, </h2>
            <p> Thank you for signing up to our Wallet App. </p>
            <p> Kindly use the One-Time-Password (OTP) below to verify your email address. </p>
            <h1>${req.OTP}</h1>`,
        }
        sgMail
            .send(msg)
            .then((response) => {
                console.log(response[0].statusCode)
                console.log(response[0].headers)
                return next();
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

export const registerUser = async (req, res) => {
    try {
        const { password } = req.body;
        const passwordHash = hashInput(password);
        const user = {
            ...req.body,
            password: passwordHash,
            otp: req.hashedOTP
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

export const sendOtpOnly = async (req, res) => {
    try {
        const { email, first_name: firstName } = req.user;
        console.log(email, firstName);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: `Jupyter Wallet Admin <${process.env.EMAIL_SENDER_TWO}>`,
            subject: 'Email Verification',
            text: `Dear ${firstName},
            Thank you for signing up to our Wallet App.
            Kindly use the One-Time-Password (OTP) below to verify your email address.
            ${req.OTP}`,
            html: `<h2> Dear ${firstName}, </h2>
            <p> Thank you for signing up to our Wallet App. <p>
            <p> Kindly use the One-Time-Password (OTP) below to verify your email address. </p>
            <h1>${req.OTP}</h1>`,
        }
        sgMail
            .send(msg)
            .then( async (response) => {
                console.log(response[0].statusCode)
                console.log(response[0].headers)
                const updatedUser = await updateOtpHash(req.hashedOTP, email);
                return res.status(201).json({
                    status: 'Success',
                    message: 'An OTP has been sent to your email for verification',
                    data: updatedUser
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

export const confirmOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const { hashedOTP, email, otpHashSent } = req.userToBeVerified;
        const endDate = new Date();
        const startDate = new Date(otpHashSent);
        const daysBetween = differenceInDays(endDate, startDate);
        const minutesBetween = differenceInMinutes(endDate, startDate);
        console.log(startDate, endDate, daysBetween, minutesBetween);
        if (daysBetween < 1) {
            if (minutesBetween <= 5 && verifyInput(otp, hashedOTP)) {
                const updatedUser = await updateUserVerificationStatus(email);
                return res.status(201).json({
                    status: 'Success',
                    message: 'Email successfully verified',
                    data: updatedUser
                });
            }
            return res.status(401).json({
                status: 'Fail',
                message: 'Invalid OTP entered'
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
                const updatedUser = await updatePasswordResetToken(req.passwordToken, email);
                return res.status(201).json({
                    status: 'Success',
                    message: 'A link has been sent to your email for password reset',
                    data: updatedUser
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
        const { userId } = req.loggedInUser;
        const retrievedUser = await getUserProfile(userId);
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
