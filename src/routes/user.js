import express from 'express';

import { validateUsername, validateSignUp, checkIfUserAlreadyExists, generateOTP, validateEmail, checkIfEmailExists,
    createTokenForPassword, authenticateTokenForOtp, validateOtp, validateLogin, authenticateTokenForPassword,
    validateResetPassword, authenticateLoginToken
} from '../middlewares';

import { checkIfUsernameIsUnique, sendOtpWithSignup, registerUser, sendOtpOnly, confirmOtp, loginUser,
    sendPasswordResetLink, changePassword, retrieveUserProfile
} from '../controllers';

/* GET users listing. */
// router.get('/', (req, res, next) => {
//   res.send('respond with a resource');
// });

const userRouter = express.Router();

userRouter.post('/validate-username', validateUsername, checkIfUsernameIsUnique);
userRouter.post('/signup', validateSignUp, checkIfUserAlreadyExists, generateOTP, sendOtpWithSignup, registerUser);
userRouter.post('/auth/verify-email', validateEmail, checkIfEmailExists, generateOTP, sendOtpOnly);
userRouter.post('/auth/confirm-email', authenticateTokenForOtp, validateOtp, confirmOtp);
userRouter.post('/auth/login', validateLogin, loginUser);
userRouter.post('/auth/forgot-password', validateEmail, checkIfEmailExists, createTokenForPassword, sendPasswordResetLink);
userRouter.post('/auth/reset-password/:token', validateResetPassword, authenticateTokenForPassword, changePassword);
userRouter.get('/auth/user', authenticateLoginToken, retrieveUserProfile)

export default userRouter;
