import helperFunctions from '../utils';
import { userValidations } from '../validations';
import { userServices } from '../services';

const { generateOTP, generateTokenForOtp,
    generateTokenForPassword, sendVerificationEmail } =  helperFunctions;
const { usernameSchema, signupSchema, emailSchema,
    otpSchema, loginSchema, passwordSchema } = userValidations;
const { getSingleUserByEmail } = userServices;

export const validateUsername = async (req, res, next) => {
    try {
        await usernameSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error.message,
        });
    }
};

export const validateSignUp = async (req, res, next) => {
    try {
        await signupSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error.message,
        });
    }
};

export const checkIfUserAlreadyExists = async (req, res, next) => {
    try {
       const user = await getSingleUserByEmail(req.body.email);
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

export const sendOtp = async (req, res, next) => {
    try {
        const firstName = req.body.firstName ? req.body.firstName : req.user.first_name;
        req.OTP = generateOTP();
        await sendVerificationEmail(req.body.email, firstName, req.OTP);
        req.confirmationToken = generateTokenForOtp({email: req.body.email});
        return next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })
    }
};

export const validateEmail = async (req, res, next) => {
    try {
        await emailSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error.message,
        });
    }
}

export const checkIfEmailExists = async (req, res, next) => {
    try {
       const user = await getSingleUserByEmail(req.body.email);
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

export const createTokenForPassword = async (req, res, next) => {
    try {
        const { email } = req.user;
        req.passwordToken = generateTokenForPassword({email});
        console.log(req.passwordToken);
        return next();
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
        const { error } = otpSchema.validate(req.body);
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
        const { error } = passwordSchema.validate(req.body);
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