import { createTransport } from 'nodemailer';
import dotenv from "dotenv";

import { hashInput, verifyInput, generateTokenForLogin } from '../utils';
import { getSingleUserByUsername, addNewUser, updateOtpHash, updateUserVerificationStatus, getSingleUserByEmail,
    updateOtpPassword, updatePasswordResetStatus, updatePassword
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
}

export const sendOtpWithSignup = async (req, res, next) => {
    try {
        const { email, firstName } = req.body;
        console.log(email);
        const transporter = createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_SENDER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: process.env.ACCESS_TOKEN,
                expires: 3599
        }});
        const mailOptions = {
            from: `"Jupyter Wallet Admin" <${process.env.EMAIL_SENDER}>`,
            to: email,
            subject: 'Email Verification',
            text: `Dear ${firstName},
            Thank you for signing up to our Wallet App.
            Kindly use the One-Time-Password (OTP) below to verify your email address.
            ${req.OTP}`,
            html: `<h2> Dear ${firstName}, </h2>
            <p> Thank you for signing up to our Wallet App. <p>
            <p> Kindly use the One-Time-Password (OTP) below to verify your email address.
            <h1>${req.OTP}</h1>`,
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              return res.status(400).json({
                status: 'Fail',
                message: error.message,
              });
            } else {
              console.log(info.response, 'OTP sent successfully.');
              return next();
            }
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
        const transporter = createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_SENDER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: process.env.ACCESS_TOKEN,
                expires: 3599
        }});
        const mailOptions = {
            from: `"Jupyter Wallet Admin" <${process.env.EMAIL_SENDER}>`,
            to: email,
            subject: 'Email Verification',
            text: `Dear ${firstName},
            Thank you for signing up to our Wallet App.
            Kindly use the One-Time-Password (OTP) below to verify your email address.
            ${req.OTP}`,
            html: `<h2> Dear ${firstName}, </h2>
            <p> Thank you for signing up to our Wallet App. <p>
            <p> Kindly use the One-Time-Password (OTP) below to verify your email address. <p>
            <h1>${req.OTP}</h1>`,
        };
        
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
              console.log(error);
              return res.status(400).json({
                status: 'Fail',
                message: error.message,
              });
            } else {
              console.log(info.response, 'OTP sent successfully.');
              const updatedUser = await updateOtpHash(req.hashedOTP, email);
              return res.status(201).json({
                status: 'Success',
                message: 'OTP sent successfully.',
                data: updatedUser
              });
            }
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
        const otpHashSentString = JSON.stringify(otpHashSent);
        const yearDiff = new Date().toISOString().split('T')[0].split('-')[0] - otpHashSentString.split('T')[0].split('-')[0].split('"')[1];
        const monthDiff = new Date().toISOString().split('T')[0].split('-')[1] - otpHashSentString.split('T')[0].split('-')[1];
        const dayDiff = new Date().toISOString().split('T')[0].split('-')[2] - otpHashSentString.split('T')[0].split('-')[2];
        const hourDiff = JSON.stringify(new Date()).split('T')[1].split(':')[0] - otpHashSentString.split('T')[1].split(':')[0];
        const minutesDiff = JSON.stringify(new Date()).split('T')[1].split(':')[1] - otpHashSentString.split('T')[1].split(':')[1];
        console.log(otpHashSentString, JSON.stringify(new Date()), yearDiff, monthDiff, dayDiff, hourDiff, minutesDiff);
        if (yearDiff < 1 && monthDiff < 1 && dayDiff < 1 && hourDiff < 1) {
            if (minutesDiff < 5 && verifyInput(otp, hashedOTP)) {
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

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await getSingleUserByEmail(email);
        // const { is_confirmed: isConfirmed, password_hash: passwordHash } = user;
        if (user && user.is_confirmed === 'true' && verifyInput(password, user.password_hash)) {
            const token = generateTokenForLogin({ email, id: user.id });
            return res.status(201).json({
                status: 'Success',
                message: 'Login successful',
                data: { ...user, token }
            })  
        } else if (user && user.is_confirmed === 'false') {
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

export const sendOtpPassword = async (req, res) => {
    try {
        const { email, first_name: firstName } = req.user;
        console.log(email, firstName);
        const transporter = createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_SENDER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: process.env.ACCESS_TOKEN,
                expires: 3599
        }});
        const mailOptions = {
            from: `"Jupyter Wallet Admin" <${process.env.EMAIL_SENDER}>`,
            to: email,
            subject: 'Password Reset',
            text: `Dear ${firstName},
            Kindly use the One-Time-Password (OTP) below to reset your password.
            ${req.OTP}`,
            html: `<h2> Dear ${firstName}, </h2>
            <p> Kindly use the One-Time-Password (OTP) below to reset your password. <p>
            <h1>${req.OTP}</h1>`,
        };
        
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
              console.log(error);
              return res.status(400).json({
                status: 'Fail',
                message: error.message,
              });
            } else {
              console.log(info.response, 'OTP sent successfully.');
              const updatedUser = await updateOtpPassword(req.hashedOTP, email);
              return res.status(201).json({
                status: 'Success',
                message: 'OTP sent successfully.',
                data: updatedUser
              });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })
    }
};

export const confirmOtpPassword = async (req, res) => {
    try {
        const { otp } = req.body;
        const { hashedOTP, email, passwordResetTokenSent, isPasswordResetConfirmed } = req.userToChangePassword;
        const passwordResetTokenSentString = JSON.stringify(passwordResetTokenSent);
        const yearDiff = new Date().toISOString().split('T')[0].split('-')[0] - passwordResetTokenSentString.split('T')[0].split('-')[0].split('"')[1];
        const monthDiff = new Date().toISOString().split('T')[0].split('-')[1] - passwordResetTokenSentString.split('T')[0].split('-')[1];
        const dayDiff = new Date().toISOString().split('T')[0].split('-')[2] - passwordResetTokenSentString.split('T')[0].split('-')[2];
        const hourDiff = JSON.stringify(new Date()).split('T')[1].split(':')[0] - passwordResetTokenSentString.split('T')[1].split(':')[0];
        const minutesDiff = JSON.stringify(new Date()).split('T')[1].split(':')[1] - passwordResetTokenSentString.split('T')[1].split(':')[1];
        console.log(passwordResetTokenSentString, JSON.stringify(new Date()), yearDiff, monthDiff, dayDiff, hourDiff, minutesDiff);
        if (yearDiff < 1 && monthDiff < 1 && dayDiff < 1 && hourDiff < 1) {
            if (minutesDiff < 5 && verifyInput(otp, hashedOTP)) {
                const updatedUser = await updatePasswordResetStatus(email, !isPasswordResetConfirmed);
                return res.status(201).json({
                    status: 'Success',
                    message: 'Reset password OTP code is valid',
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

export const changePassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        const { email, isPasswordResetConfirmed } = req.userToChangePassword;
        if (isPasswordResetConfirmed === true) {
            const newPassword = hashInput(password);
            await updatePassword(email, newPassword);
            const updatedUser = await updatePasswordResetStatus(email, !isPasswordResetConfirmed);
            return res.status(201).json({
                status: 'Success',
                message: 'Password reset successfully',
                data: updatedUser
            })  
        } else {
            return res.status(401).json({
                status: 'Fail',
                message: 'Password reset OTP not yet verified'
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