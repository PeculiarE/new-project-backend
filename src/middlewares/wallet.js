import helperFunctions from '../utils';
import { walletValidations } from '../validations';
import { walletServices, userServices } from '../services';

const { generateOTP, generateTokenForOtp, sendOtpEmail,
    decodeToken, verifyInput } = helperFunctions;
const { pinSchema, recipientUsernameSchema, amountSchema, transferSchema } = walletValidations;
const { retrieveWalletByUserId } = walletServices;
const { getSingleUserByUsername } = userServices;

export const validatePin = async (req, res, next) => {
    try {
        await pinSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        return res.status(400).json({
            status: 'Fail',
            message: error.message
        });
    }
};

export const sendPinOTP = async (req, res, next) => {
    try {
        const { email, firstName } = req.user;
        req.OTP = generateOTP();
        const check = false;
        await sendOtpEmail(email, firstName, req.OTP, check);
        req.pinResetToken = generateTokenForOtp({email, otp:req.OTP});
        return next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })
    }
};

export const checkIfOTPHasExpired = async (req, res, next) => {
    try {
        const { pin_reset_token: pinResetToken
        } = await retrieveWalletByUserId(req.user.userId);
        const { err, data } = decodeToken(pinResetToken);
        if (err) {
            return res
                .status(401)
                .json({ status: 'Fail', message: 'OTP has expired' });
        }
        req.decodedData = data;
        return next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })
    }
};

export const validateAmount = async (req, res, next) => {
    try {
        await amountSchema.validateAsync(req.body, {convert:false});
        return next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 'Fail',
            message: error.message
        });
    }
};

export const checkIfUserHasActivatedWallet = async (req, res, next) => {
    try {
        const wallet = await retrieveWalletByUserId(req.user.userId);
        if (wallet) {
            req.wallet = wallet;
            return next();
        }
        return res.status(401).json({
            status: 'Fail',
            message: 'User must create pin to activate wallet'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        });
    }
};

export const validateRecipientUsername = async (req, res, next) => {
    try {
        await recipientUsernameSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 'Fail',
            message: error.message
        });
    }
};

export const checkIfRecipientExists = async (req, res, next) => {
    try {
        const realUsername = req.body.recipientUsername.toLowerCase();
        const user = await getSingleUserByUsername(realUsername);
        if (user) {
            req.receiver = user;
            return next();
        } else {
            return res.status(409).json({
                status: 'Fail',
                message: 'Recipient not found'
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

export const validateTransfer = async (req, res, next) => {
    try {
       await transferSchema.validateAsync(req.body, {convert:false});
        return next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 'Fail',
            message: error.message
        });
    }
};

export const checkIfPinIsCorrect = async (req, res, next) => {
    try {
        const { pin_hash: pinHash } = req.wallet;
        if (verifyInput(String(req.body.pin), pinHash)) {
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
