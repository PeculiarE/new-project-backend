import { generate } from 'generate-password';

import signupSchema from '../validations';
import { getSingleUserByEmail } from '../services';
import { hashInput } from '../utils';

export const validateSignUp = (req, res, next) => {
    try {
        const { error } = signupSchema.validate(req.body);
        if (!error) {
            return next();
        } else {
            return res.status(400).json({
                status: 'Fail',
                message: error.message,
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong',
        });
    }
}

export const checkIfUserAlreadyExists = async (req, res, next) => {
    try {
       const { email } = req.body;
       const user = await getSingleUserByEmail(email);
       console.log(email, user);
       if (!user) {
           return next();
       } else {
            return res.status(409).json({
                status: 'Fail',
                message: 'Email already exists!',
            });
       }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong',
        });
    }
}

export const generateOTP = async (req, res, next) => {
    try {
        const OTP = generate({
            length: 4,
            numbers: true,
            lowercase: false,
            uppercase: false,
        });
        req.OTP = OTP;
        const hashedOTP = hashInput(OTP);
        req.hashedOTP = hashedOTP;
        console.log(req.OTP, req.hashedOTP);
        return next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong',
        });
    }
}
