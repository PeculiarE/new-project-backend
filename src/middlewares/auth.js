import { decodeTokenForOtp } from '../utils';
import { getSingleUserByEmail } from '../services';

export const authenticateTokenForOtp = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        console.log(authorization);
        const token = authorization.split(' ')[1];
        const { err, data } = decodeTokenForOtp(token);
        if (err) {
            console.log(err);
            return res
                .status(401)
                .json({ status: 'Fail', message: err });
        } else {
            const { email } = data;
            const user = await getSingleUserByEmail(email);
            if (!user) {
                return res
                .status(401)
                .json({ status: 'Fail', message: 'User no longer exists!' });
            }
            const otpHashSent = user.otp_hash_sent;
            req.userToBeVerified = { ...data, otpHashSent };
            console.log(req.userToBeVerified);
            return next();
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            status: 'Fail',
            message: 'Something went wrong'
        });
    }
}
