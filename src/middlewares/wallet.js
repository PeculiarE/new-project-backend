import { generate } from 'generate-password';

import { pinSchema } from '../validations';
import { hashInput, generateTokenForOtp } from '../utils';

export const validatePin = async (req, res, next) => {
    try {
        const { error } = pinSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 'Fail',
                message: error.message
            });
        }
        return next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong'
        });
    }
};

export const generatePinOTP = async (req, res, next) => {
    try {
        const { email } = req.loggedInUser;
        const OTP = generate({
            length: 4,
            numbers: true,
            lowercase: false,
            uppercase: false,
        });
        req.OTP = OTP;
        const hashedOTP = hashInput(OTP);
        req.hashedOTP = generateTokenForOtp(hashedOTP);
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