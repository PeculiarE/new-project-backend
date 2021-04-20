import express from 'express';

import userRouter from './user';

/* GET home page. */
// router.get('/', (req, res, next) => {
//   res.status(200).json({
//     message: 'Welcome to our new project',
//   });
// });
const router = express.Router();

router.use('/api/v1/', userRouter)

export default router;
