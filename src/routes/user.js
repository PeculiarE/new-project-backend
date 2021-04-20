import express from 'express';

import { validateSignUp, checkIfUserAlreadyExists, generateOTP } from '../middlewares';
import { checkIfUsernameIsUnique, sendOtpWithSignup, registerUser } from '../controllers';

/* GET users listing. */
// router.get('/', (req, res, next) => {
//   res.send('respond with a resource');
// });

const userRouter = express.Router();

userRouter.post('/validate-username', checkIfUsernameIsUnique)
userRouter.post('/signup', validateSignUp, checkIfUserAlreadyExists, generateOTP, sendOtpWithSignup, registerUser);

export default userRouter;
