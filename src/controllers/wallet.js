// import { createTransport } from 'nodemailer';
import dotenv from "dotenv";
import { differenceInDays, differenceInMinutes } from 'date-fns';
import sgMail from '@sendgrid/mail';

import { hashInput, verifyInput, decodeToken } from '../utils';
import { addWalletDetails, updateOtpPin, retrieveWalletByUserId, updatePinResetStatus, updatePin,
    updateBalanceAfterDeposit, getSingleUserByUsername, updateBalanceAfterTransfer, getWalletBalance,
    getHistoryArrayByUserId
} from '../services';

dotenv.config();

export const createWalletWithPin = async (req, res) => {
    try {
        const { pin } = req.body;
        const { userId } = req.loggedInUser;
        const pinHash = hashInput(pin);
        const walletDetails = { pinHash, userId };
        console.log(walletDetails);
        const wallet = await addWalletDetails(walletDetails);
        return res.status(201).json({
            status: 'Success',
            message: 'Pin created successfully!',
            data: wallet,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong'
        });
    }

};

export const sendPinOTP = async (req, res) => {
    try {
        const { email, userId, firstName } = req.loggedInUser;
        console.log(email, firstName);
        // using SendGrid
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: `Jupyter Wallet Admin <${process.env.EMAIL_SENDER_TWO}>`,
            subject: 'PIN Reset',
            text: `Dear ${firstName},
            Kindly use the One-Time-Password (OTP) below to reset your pin.
            ${req.OTP}`,
            html: `<h2> Dear ${firstName}, </h2>
            <p> Kindly use the One-Time-Password (OTP) below to reset your pin. </p>
            <h1>${req.OTP}</h1>`,
        }
        sgMail
            .send(msg)
            .then( async (response) => {
                console.log(response[0].statusCode)
                console.log(response[0].headers)
                const updatedWallet = await updateOtpPin(req.hashedOTP, false, userId);
                return res.status(201).json({
                    status: 'Success',
                    message: 'An OTP has been sent to your email for PIN reset',
                    data: updatedWallet
                });
            }).catch((error) => {
                console.log(error);
                console.error(error);
                return res.status(400).json({
                    status: 'Fail',
                    message: error.message,
            });
        
        // Using Nodemailer
        // const transporter = createTransport({
        //     host: 'smtp.gmail.com',
        //     port: 465,
        //     secure: true,
        //     auth: {
        //         type: 'OAuth2',
        //         user: process.env.EMAIL_SENDER,
        //         clientId: process.env.CLIENT_ID,
        //         clientSecret: process.env.CLIENT_SECRET,
        //         refreshToken: process.env.REFRESH_TOKEN,
        //         accessToken: process.env.ACCESS_TOKEN,
        //         expires: 3599
        // }});
        // const mailOptions = {
        //     from: `"Jupyter Wallet Admin" <${process.env.EMAIL_SENDER}>`,
        //     to: email,
        //     subject: 'PIN Reset',
        //     text: `Dear ${firstName},
        //     Kindly use the One-Time-Password (OTP) below to reset your pin.
        //     ${req.OTP}`,
        //     html: `<h2> Dear ${firstName}, </h2>
        //     <p> Kindly use the One-Time-Password (OTP) below to reset your pin. <p>
        //     <h1>${req.OTP}</h1>`,
        // };
        
        // transporter.sendMail(mailOptions, async (error, info) => {
        //     if (error) {
        //       console.log(error);
        //       return res.status(400).json({
        //         status: 'Fail',
        //         message: error.message,
        //       });
        //     } else {
        //       console.log(info.response, 'OTP sent successfully.');
        //       const updatedWallet = await updateOtpPin(req.hashedOTP, false, userId);
        //       return res.status(201).json({
        //         status: 'Success',
        //         message: 'An OTP has been sent to your email for PIN reset',
        //         data: updatedWallet
        //       });
        //     }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })
    }
};

export const confirmPinOTP = async (req, res) => {
    try {
        const { userId } = req.loggedInUser;
        const { pin_reset_token: pinResetToken, pin_reset_token_sent: pinResetTokenSent, is_pin_reset_confirmed: isPinResetConfirmed
        } = await retrieveWalletByUserId(userId);
        console.log(pinResetToken, pinResetTokenSent);
        const { otp } = req.body;
        const endDate = new Date();
        const startDate = new Date(pinResetTokenSent);
        const daysBetween = differenceInDays(endDate, startDate);
        const minutesBetween = differenceInMinutes(endDate, startDate);
        console.log(startDate, endDate, daysBetween, minutesBetween);
        if (daysBetween < 1) {
            if (minutesBetween <= 5 && verifyInput(otp, decodeToken(pinResetToken).data)) {
                console.log(userId, isPinResetConfirmed, !isPinResetConfirmed);
                const updatedWallet = await updatePinResetStatus(userId, true);
                return res.status(201).json({
                    status: 'Success',
                    message: 'Reset pin OTP code is valid',
                    data: updatedWallet
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

export const changePin = async (req, res, next) => {
    try {
        const { pin } = req.body;
        const { userId } = req.loggedInUser;
        const { is_pin_reset_confirmed: isPinResetConfirmed } = await retrieveWalletByUserId(userId);
        if (isPinResetConfirmed === true) {
            const newPassword = hashInput(pin);
            const updatedWallet = await updatePin(newPassword, false, userId);
            return res.status(201).json({
                status: 'Success',
                message: 'Pin reset successfully',
                data: updatedWallet
            })  
        } else {
            return res.status(401).json({
                status: 'Fail',
                message: 'Pin reset OTP not yet verified'
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

export const fundWallet = async (req, res) => {
    try {
        const { userId } = req.loggedInUser;
        const updatedWallet = await updateBalanceAfterDeposit(req.realValue, userId);
        const balance = Number((updatedWallet.balance))/100;
        return res.status(201).json({
            status: 'Success',
            message: 'Wallet funded successfully!',
            data: { ...updatedWallet, balance, amount_funded: req.realValue }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })  
    }
};

export const checkIfUsernameExists = async (req, res) => {
    try {
        const { recipientUsername } = req.body;
        const realUsername = String(recipientUsername).toLowerCase();
        const user = await getSingleUserByUsername(realUsername);
        if (user) {
            const { first_name: firstName, last_name: lastName } = user;
            const fullName = `${firstName} ${lastName}`
            console.log(recipientUsername, realUsername, fullName);
            return res.status(201).json({
                status: 'Success',
                message: `Recipient '${fullName}' found`
            })
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

export const checkIfBalanceIsSufficient = async (req, res) => {
    try {
        const { userId } = req.loggedInUser;
        const { balance } = await retrieveWalletByUserId(userId);
        const realBalance = balance/100;
        console.log(req.realValue, realBalance);
        if (req.realValue <= realBalance)
        return res.status(201).json({
            status: 'Success',
            message: 'Balance is sufficient',
            balance: realBalance
        })
        else {
            return res.status(409).json({
                status: 'Fail',
                message: 'Insufficient balance. Please input a lower amount',
                balance: realBalance
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })  
    }
};

export const transferFunds = async (req, res) => {
    try {
        const { userId } = req.loggedInUser;
        const data = { ...req.body, userId };
        const updatedWallets = await updateBalanceAfterTransfer(data);
        let senderBalance = 0;
        updatedWallets.forEach((el) => {
            if (el.sender === true)
            {
                senderBalance = el.balance
            }
            return senderBalance;
        })
        senderBalance = Number(senderBalance)/100;
        return res.status(201).json({
            status: 'Success',
            message: 'Funds transferred successfully!',
            data: { amountTransferred: req.body.amount, balance: senderBalance }

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })  
    }
};

export const retrieveWalletBalance = async (req, res) => {
    try {
        const { userId } = req.loggedInUser;
        const { balance } = await getWalletBalance(userId);
        const newBalance = Number(balance)/100;
        return res.status(200).json({
            status: 'Success',
            message: 'Wallet balance fetched successfully!',
            data: { 'balance': newBalance }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        }) 
    }
};

export const retrieveTransactionHistory = async (req, res) => {
    try {
        const { userId } = req.loggedInUser;
        const retrievedHistory = await getHistoryArrayByUserId(userId);
        if(!retrievedHistory) {
            return res.status(404).json({
                status: 'Fail',
                message: 'User has not made any transactions'
            })
        } else {
            retrievedHistory.forEach((el) => {
                el.amount = Number(el.amount)/100;
            });
            return res.status(200).json({
                status: 'Success',
                message: 'Transaction history fetched successfully!',
                data: retrievedHistory
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