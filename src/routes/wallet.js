import express from 'express';

import { authenticateLoginToken, validatePin, generatePinOTP, validateOtp, validateAmount, convertCurrency,
    validateTransfer, validateUsername, checkIfPinIsCorrect
} from '../middlewares';

import { createWalletWithPin, sendPinOTP, confirmPinOTP, changePin, fundWallet, checkIfUsernameExists, checkIfBalanceIsSufficient,
    transferFunds, retrieveWalletBalance,
} from '../controllers';

/* GET users listing. */
// router.get('/', (req, res, next) => {
//   res.send('respond with a resource');
// });

const walletRouter = express.Router();

walletRouter.use(authenticateLoginToken);

walletRouter.post('/create-pin', validatePin, createWalletWithPin);
walletRouter.post('/forgot-pin', generatePinOTP, sendPinOTP);
walletRouter.post('/confirm-reset-pin-otp', validateOtp, confirmPinOTP);
walletRouter.post('/reset-pin', validatePin, changePin);
walletRouter.post('/deposit', validateAmount, convertCurrency, fundWallet);
walletRouter.post('/validate-receiver', validateUsername, checkIfUsernameExists);
walletRouter.post('/validate-amount', validateAmount, convertCurrency, checkIfBalanceIsSufficient);
walletRouter.post('/transfer', validateTransfer, checkIfPinIsCorrect, transferFunds);
walletRouter.get('/balance', retrieveWalletBalance)

export default walletRouter;