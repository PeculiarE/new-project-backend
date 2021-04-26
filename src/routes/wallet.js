import express from 'express';

import { authenticateLoginToken, validatePin, generatePinOTP, validateOtp } from '../middlewares';

import { createWalletWithPin, sendPinOTP, confirmPinOTP, changePin } from '../controllers';

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

export default walletRouter;