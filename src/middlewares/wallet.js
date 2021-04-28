import { generate } from 'generate-password';

import { pinSchema, amountSchema, transferSchema } from '../validations';
import { hashInput, generateTokenForOtp, verifyInput } from '../utils';
// import { roundingUpCurrency } from '../services';
import { retrieveWalletByUserId } from '../services';

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
        // const { email } = req.loggedInUser;
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
};

export const validateAmount = async (req, res, next) => {
    try {
        const { error } = amountSchema.validate(req.body, {convert:false});
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

export const convertCurrency = (req, res, next) => {
    try {
        const { amount } = req.body;
        // const check = roundingUpCurrency(amount, 3);
        // console.log(check);
        // let startConversion = String(check).split('.');
        // let decimalDigits = 0;
        // while (Number(startConversion[1]) >= 100) {
        //     startConversion[1] = Number(startConversion[1]) - 100;
        //     startConversion[0] = Number(startConversion[0]) + 1;
        //     decimalDigits = decimalDigits + startConversion[1];
        // }
        // const realValue = roundingUpCurrency(Number(startConversion.join('.')), 2);
        // console.log(realValue);
        // req.realValue = realValue;
        req.realValue = amount;
        return next();  
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong'
        });
    }
};

export const validateTransfer = async (req, res, next) => {
    try {
        const { error } = transferSchema.validate(req.body, {convert:false});
        if (error) {
            console.log(error);
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

export const checkIfPinIsCorrect = async (req, res, next) => {
    try {
        const { pin } = req.body;
        const { userId } = req.loggedInUser;
        const { pin_hash: pinHash } = await retrieveWalletByUserId(userId);
        if (verifyInput(String(pin), pinHash)) {
            return next(); 
        } else {
            return res.status(401).json({
                status: 'Fail',
                message: 'Invalid PIN'
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
