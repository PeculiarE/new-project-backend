import express from 'express';

import { walletMiddlewares, authMiddlewares, userMiddlewares } from '../middlewares';
import { walletControllers } from '../controllers';

const walletRouter = express.Router();

const { authenticateLoginToken } = authMiddlewares;
const { validateOtp } = userMiddlewares;

const { validatePin, sendPinOTP, checkIfOTPHasExpired,
    validateAmount, checkIfUserHasActivatedWallet, validateRecipientUsername,
    checkIfRecipientExists, validateTransfer, checkIfPinIsCorrect, checkPageNumberAndLimit
} = walletMiddlewares;

const { createWalletWithPin, updateResetToken, confirmPinOTP, changePin, fundWallet,
    checkIfRecipientHasActivatedWallet, checkIfBalanceIsSufficient,
    transferFunds, retrieveWalletBalance, retrieveTransactionHistory,
    retrieveFilteredTransactionHistory,
} = walletControllers;

walletRouter.use(authenticateLoginToken);

walletRouter.post('/create-pin', validatePin, createWalletWithPin);
walletRouter.post('/forgot-pin', sendPinOTP, updateResetToken);
walletRouter.post('/confirm-reset-pin-otp', validateOtp, checkIfOTPHasExpired, confirmPinOTP);
walletRouter.post('/reset-pin', validatePin, changePin);
walletRouter.post('/deposit', validateAmount, checkIfUserHasActivatedWallet, fundWallet);
walletRouter.post('/validate-receiver', validateRecipientUsername, checkIfRecipientExists, checkIfRecipientHasActivatedWallet);
walletRouter.post('/validate-amount', validateAmount, checkIfUserHasActivatedWallet, checkIfBalanceIsSufficient);
walletRouter.post('/transfer', validateTransfer, checkIfUserHasActivatedWallet, checkIfPinIsCorrect, transferFunds);
walletRouter.get('/balance', checkIfUserHasActivatedWallet, retrieveWalletBalance);
walletRouter.get('/transaction-history', checkIfUserHasActivatedWallet, checkPageNumberAndLimit, retrieveTransactionHistory);
walletRouter.get('/filtered-transaction-history', checkIfUserHasActivatedWallet, checkPageNumberAndLimit, retrieveFilteredTransactionHistory);

export default walletRouter;
