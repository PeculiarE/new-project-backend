import express from 'express';

import { validateSignUp, checkIfUserAlreadyExists, generateOTP, validateEmail, checkIfEmailExists, authenticateTokenForOtp,
    validateOtp, validateLogin
} from '../middlewares';

import { checkIfUsernameIsUnique, sendOtpWithSignup, registerUser, sendOtpOnly, confirmOtp, loginUser } from '../controllers';

/* GET users listing. */
// router.get('/', (req, res, next) => {
//   res.send('respond with a resource');
// });

const userRouter = express.Router();

userRouter.post('/validate-username', checkIfUsernameIsUnique);
userRouter.post('/signup', validateSignUp, checkIfUserAlreadyExists, generateOTP, sendOtpWithSignup, registerUser);
userRouter.post('/auth/verify-email', validateEmail, checkIfEmailExists, generateOTP, sendOtpOnly);
userRouter.post('/auth/confirm-email', authenticateTokenForOtp, validateOtp, confirmOtp );
userRouter.post('/auth/login', validateLogin, loginUser );

export default userRouter;
