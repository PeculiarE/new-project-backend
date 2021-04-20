import { createTransport } from 'nodemailer';
import dotenv from "dotenv";

import { hashInput } from '../utils';
import { getSingleUserByUsername, addNewUser } from '../services';

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
              return res.status(201).json({
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
