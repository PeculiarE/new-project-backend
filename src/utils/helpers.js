import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { generate } from 'generate-password';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();

const salt = genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;
const emailApiKey = process.env.SENDGRID_API_KEY;
const emailSender = process.env.EMAIL_SENDER_TWO;

export const hashInput = (data) => hashSync(data, salt);

export const generateUUID = () => uuidv4();

export const generateOTP = () => generate({
    length: 4,
    numbers: true,
    lowercase: false,
    uppercase: false,
});

export const generateTokenForOtp = (data) => jwt.sign(data, jwtSecret, { expiresIn: '5m' });

export const decodeToken = (token) => jwt.verify(token, jwtSecret, (err, data) => ({err, data}));

export const verifyInput = (data, hashedData) => compareSync(data, hashedData);

export const generateTokenForPassword = (data) => jwt.sign(data, jwtSecret, { expiresIn: '10m' });

export const generateTokenForLogin = (data) => jwt.sign(data, jwtSecret, { expiresIn: '30m' });

const emailMessageForOTP = (email, name, OTP, check) => {
    const action = check ? 'verify your email address' : 'reset your PIN';
    const msg = {
        to: email,
        from: `Jupyter Wallet Admin <${emailSender}>`,
        subject: check ? 'Email Verification' : 'PIN Reset',
        text: `Dear ${name},
            Thank you for ${ check ? 'signing up to': 'using'} our Wallet App.
            Kindly use the One-Time-Password (OTP) below to ${action}.
            ${OTP}
        `,
        html: `<h2> Dear ${name}, </h2>
            <p> Thank you for ${ check ? 'signing up to': 'using'} our Wallet App. </p>
            <p> Kindly use the One-Time-Password (OTP) below to ${action}. </p>
            <h1>${OTP}</h1>
        `,
    }
    return msg;
}

const emailMessageForLink = (email, name, token) => {
    const msg = {
        to: email,
        from: `Jupyter Wallet Admin <${emailSender}>`,
        subject: 'Password Reset',
        text: `Dear ${name},
            Kindly click on the button below to reset your password.
            http://localhost:8080/resetForm?token=${token}`,
        html: `<h2> Dear ${name}, </h2>
            <p> Kindly click on the button below to reset your password. </p>
            <br>
            <a href="http://localhost:8080/resetForm?token=${token}"
            target="_blank"
            style="background-color:#1F6AEC; color:white; cursor:pointer;
            padding:10px; border:1pxsolid; text-decoration:none; border-radius:4px">
            Reset My Password
            </a>
        `,
    }
    return msg;
}

export const sendOtpEmail = async (email, name, OTP, check) => {
    sgMail.setApiKey(emailApiKey);
    const msg = emailMessageForOTP(email, name, OTP, check);
    await sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        }).catch((error) => {
            console.log(error);
            console.error(error);
        });
};

export const sendLinkEmail = async (email, name, token) => {
    sgMail.setApiKey(emailApiKey);
    const msg = emailMessageForLink(email, name, token);
    await sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        }).catch((error) => {
            console.log(error);
            console.error(error);
        });
};
