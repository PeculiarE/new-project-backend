import express from 'express';

import userRouter from './user';
import walletRouter from './wallet';

/* GET home page. */
// router.get('/', (req, res, next) => {
//   res.status(200).json({
//     message: 'Welcome to our new project',
//   });
// });
const router = express.Router();

router.use('/api/v1/', userRouter);
router.use('/api/v1/wallet', walletRouter)

export default router;
