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

export const sendVerificationEmail = async (email, name, OTP) => {
    sgMail.setApiKey(emailApiKey);
    const msg = {
        to: email,
        from: `Jupyter Wallet Admin <${emailSender}>`,
        subject: 'Email Verification',
        text: `Dear ${name},
        Thank you for signing up to our Wallet App.
        Kindly use the One-Time-Password (OTP) below to verify your email address.
        ${OTP}`,
        html: `<h2> Dear ${name}, </h2>
        <p> Thank you for signing up to our Wallet App. </p>
        <p> Kindly use the One-Time-Password (OTP) below to verify your email address. </p>
        <h1>${OTP}</h1>`,
    };
    sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        }).catch((error) => {
            console.log(error);
            console.error(error);
        });
};