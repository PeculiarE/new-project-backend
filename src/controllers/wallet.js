import helperFunctions from '../utils';
import { walletServices, getHistoryArrayByUserId,
    getFilteredHistoryArrayByUserId } from '../services';

const { hashInput } = helperFunctions;
const { addWalletDetails, updatePinResetToken, retrieveWalletByUserId, updatePinResetStatus, updatePin,
    updateBalanceAfterDeposit, updateBalanceAfterTransfer
} = walletServices;

export const createWalletWithPin = async (req, res) => {
    try {
        const pinHash = hashInput(req.body.pin);
        const walletDetails = { pinHash, userId: req.user.userId };
        console.log(req.user.userId, walletDetails);
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

export const updateResetToken = async (req, res) => {
    try {
        await updatePinResetToken(req.pinResetToken, req.user.userId);
        return res.status(201).json({
            status: 'Success',
            message: 'An OTP has been sent to your email for PIN reset'
        })
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
        if (req.body.otp === req.decodedData.otp) {
           await updatePinResetStatus(req.user.userId);
            return res.status(201).json({
                status: 'Success',
                message: 'Reset pin OTP code is valid'
            });
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

export const changePin = async (req, res) => {
    try {
        const { is_pin_reset_confirmed: isPinResetConfirmed } = await retrieveWalletByUserId(req.user.userId);
        if (isPinResetConfirmed) {
            const newPin = hashInput(req.body.pin);
            await updatePin(newPin, req.user.userId);
            return res.status(201).json({
                status: 'Success',
                message: 'Pin reset successfully',
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
        const updatedWallet = await updateBalanceAfterDeposit(req.body.amount, req.user.userId);
        const balance = Number((updatedWallet.balance))/100;
        return res.status(201).json({
            status: 'Success',
            message: 'Wallet funded successfully!',
            data: { ...updatedWallet, balance, amount_funded: req.body.amount }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        })  
    }
};

export const checkIfRecipientHasActivatedWallet = async (req, res) => {
    try {
        const { first_name: firstName, last_name: lastName, id: userId } = req.receiver;
        const fullName = `${firstName} ${lastName}`;
        const wallet = await retrieveWalletByUserId(userId);
        if (!wallet) {
            return res.status(404).json({
                status: 'Fail',
                message: `Recipient '${fullName}' yet to activate wallet`
            })
        }
        return res.status(201).json({
                status: 'Success',
                message: `Recipient '${fullName}' found`
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        }) 
    }
}

export const checkIfBalanceIsSufficient = async (req, res) => {
    try {
        const realBalance = Number(req.wallet.balance)/100;
        if (req.body.amount <= realBalance)
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
        const { userId } = req.user;
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
        const newBalance = Number(req.wallet.balance)/100;
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
        const retrievedHistory = await getHistoryArrayByUserId(req.user.userId, req.pageData);
        retrievedHistory.forEach((el) => {
            el.amount = Number(el.amount)/100;
        });
        return res.status(200).json({
            status: 'Success',
            message: 'Transaction history fetched successfully!',
            data: retrievedHistory
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        }) 
    }
};

export const retrieveFilteredTransactionHistory = async (req, res) => {
    try {
        const data = { ...req.body, ...req.pageData };
        const retrievedFilteredHistory = await getFilteredHistoryArrayByUserId(req.user.userId, data);
        retrievedFilteredHistory.forEach((el) => {
            el.amount = Number(el.amount)/100;
        });
        return res.status(200).json({
            status: 'Success',
            message: 'Filtered transaction history fetched successfully!',
            data: retrievedFilteredHistory
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'Fail',
            message: 'Something went wrong!'
        }) 
    }
};
