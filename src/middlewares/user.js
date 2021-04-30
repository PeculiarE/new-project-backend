import { generate } from 'generate-password';

import { usernameSchema, signupSchema, sendOtpSchema, confirmOtpSchema, loginSchema, resetPasswordSchema } from '../validations';
import { getSingleUserByEmail } from '../services';
import { hashInput, generateTokenForOtp } from '../utils';

export const validateUsername = (req, res, next) => {
    try {
        const { error } = usernameSchema.validate(req.body);
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
            message: 'Something went wrong!',
        });
    }
};

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
            message: 'Something went wrong!',
        });
    }
};

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
            message: 'Something went wrong!',
        });
    }
}

export const generateOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        const OTP = generate({
            length: 4,
            numbers: true,
            lowercase: false,
            uppercase: false,
        });
        req.OTP = OTP;
        const hashedOTP = hashInput(OTP);
        req.hashedOTP = generateTokenForOtp({ hashedOTP, email });
        console.log(req.OTP, req.hashedOTP);
        return next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!',
        });
    }
}

export const validateEmail = (req, res, next) => {
    try {
        const { error } = sendOtpSchema.validate(req.body);
        if (!error) {
            return next();
        } else {
            return res.status(400).json({
                status: 'Fail',
                message: error.message,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!',
        });
    }
}

export const checkIfEmailExists = async (req, res, next) => {
    try {
       const { email } = req.body;
       const user = await getSingleUserByEmail(email);
       console.log(email, user);
       if (user) {
           req.user = user;
           return next();
       } else {
            return res.status(409).json({
                status: 'Fail',
                message: 'Email does not exist!',
            });
       }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!',
        });
    }
}

export const validateOtp = (req, res, next) => {
    try {
        const { error } = confirmOtpSchema.validate(req.body);
        if (!error) {
            return next();
        } else {
            return res.status(400).json({
                status: 'Fail',
                message: error.message,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!',
        });
    }
}

export const validateLogin = (req, res, next) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (!error) {
            return next();
        } else {
            return res.status(400).json({
                status: 'Fail',
                message: error.message,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!',
        });
    }
}

export const validateResetPassword = (req, res, next) => {
    try {
        const { error } = resetPasswordSchema.validate(req.body);
        if (!error) {
            return next();
        } else {
            return res.status(400).json({
                status: 'Fail',
                message: error.message,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!',
        });
    }
}