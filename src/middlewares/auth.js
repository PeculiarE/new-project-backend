import helperFunctions from '../utils';
import { userServices } from '../services';

const { decodeToken } = helperFunctions;
const  { getSingleUserByEmail } = userServices;

export const authenticateOtpToken = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        const { err, data } = decodeToken(token);
        if (err) {
            return res
                .status(401)
                .json({ status: 'Fail', message: 'OTP has expired' });
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

export const authenticatePasswordToken = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        const { err, data } = decodeToken(token);
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
      const token = authorization.split(' ')[1];
      const { err, data } = decodeToken(token);
      if (err) {
        console.log(err);
        return res
          .status(401)
          .json({ status: 'Fail', message: 'You need to be signed in' });
      }
      req.user = data;
      return next();
    } catch (error) {
        console.log(error);
        return res
          .status(401)
          .json({ status: 'Fail', message: 'An authorization token is required' });
    }
  };