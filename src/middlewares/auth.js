import { decodeToken } from '../utils';
import { getSingleUserByEmail } from '../services';

export const authenticateTokenForOtp = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        console.log(authorization);
        const token = authorization.split(' ')[1];
        const { err, data } = decodeToken(token);
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
};

export const authenticateTokenForPassword = async (req, res, next) => {
    try {
        const tokenObj = req.params;
        console.log(tokenObj);
        const { err, data } = decodeToken(tokenObj.token);
        if (err) {
            console.log(err);
            return res
                .status(401)
                .json({ status: 'Fail', message: 'Password reset token expired' });
        } else {
            const { email } = data;
            const user = await getSingleUserByEmail(email);
            if (!user) {
                return res
                .status(401)
                .json({ status: 'Fail', message: 'User no longer exists!' });
            }
            req.user = user;
            return next();
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            status: 'Fail',
            message: 'Something went wrong'
        });
    }
};

export const authenticateLoginToken = (req, res, next) => {
    try {
      const { authorization } = req.headers;
      console.log(authorization);
      const token = authorization.split(' ')[1];
      const { err, data } = decodeToken(token);
      console.log('>>>>>>>', data);
      if (err) {
        console.log(err);
        return res
          .status(401)
          .json({ status: 'Fail', message: 'You need to be signed in' });
      }
      req.loggedInUser = data;
      return next();
    } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ status: 'Fail', message: 'Something went wrong' });
    }
  };