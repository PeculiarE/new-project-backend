import express from 'express';

import { userMiddlewares, authMiddlewares } from '../middlewares';
import { userControllers } from '../controllers';


const userRouter = express.Router();
const { validateUsername, validateSignUp, checkIfUserAlreadyExists, sendOtp,
    validateEmail, checkIfEmailExists,
    createTokenForPassword, validateOtp, validateLogin, authenticatePasswordToken,
    validateResetPassword, authenticateLoginToken
} = userMiddlewares;
const { authenticateOtpToken } = authMiddlewares;
const { checkIfUsernameIsUnique, registerUser,
    updateConfirmationToken, confirmUser, loginUser, sendPasswordResetLink,
    changePassword, retrieveUserProfile
} = userControllers;

userRouter.post('/validate-username', validateUsername, checkIfUsernameIsUnique);
userRouter.post('/signup', validateSignUp, checkIfUserAlreadyExists, sendOtp, registerUser);
userRouter.post('/auth/verify-email', validateEmail, checkIfEmailExists, sendOtp, updateConfirmationToken);
userRouter.post('/auth/confirm-email', validateOtp, authenticateOtpToken, confirmUser);
// userRouter.post('/auth/login', validateLogin, loginUser);
// userRouter.post('/auth/forgot-password', validateEmail, checkIfEmailExists, createTokenForPassword, sendPasswordResetLink);
// userRouter.post('/auth/reset-password/:token', validateResetPassword, authenticatePasswordToken, changePassword);
// userRouter.get('/auth/user', authenticateLoginToken, retrieveUserProfile)

export default userRouter;
