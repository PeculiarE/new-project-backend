import express from 'express';

import { userMiddlewares, authMiddlewares } from '../middlewares';
import { userControllers } from '../controllers';

const userRouter = express.Router();
const { validateUsername, validateSignUp, checkIfUserAlreadyExists, sendOtp,
    validateEmail, checkIfEmailExists,
    createTokenForPassword, validateOtp, validateLogin,
    validatePassword,
} = userMiddlewares;
const { authenticateOtpToken, authenticatePasswordToken,
    authenticateLoginToken
} = authMiddlewares;
const { checkIfUsernameIsUnique, registerUser,
    updateConfirmationToken, confirmUser, loginUser, sendPasswordResetLink,
    changePassword, retrieveUserProfile
} = userControllers;

userRouter.post('/validate-username', validateUsername, checkIfUsernameIsUnique);
userRouter.post('/signup', validateSignUp, checkIfUserAlreadyExists, sendOtp, registerUser);
userRouter.post('/auth/resend-email-otp', validateEmail, checkIfEmailExists, sendOtp, updateConfirmationToken);
userRouter.post('/auth/confirm-email', validateOtp, authenticateOtpToken, confirmUser);
userRouter.post('/auth/login', validateLogin, loginUser);
userRouter.post('/auth/forgot-password', validateEmail, checkIfEmailExists, createTokenForPassword, sendPasswordResetLink);
userRouter.post('/auth/reset-password', validatePassword, authenticatePasswordToken, changePassword);
userRouter.get('/auth/user', authenticateLoginToken, retrieveUserProfile)

export default userRouter;
