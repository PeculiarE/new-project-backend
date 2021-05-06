import db from '../../db/setup';
import { getUserByUsername, getUserByEmail, insertNewUser, updateUserOtp, updateUserStatus,
    updateUserPasswordResetToken, updateUserPassword, getUserProfileByUserId,
} from '../../db/queries/user';
import helperFunctions from '../utils';

const { generateUUID } = helperFunctions;

export const getSingleUserByUsername  = async (username) => db.oneOrNone(getUserByUsername, [username]);

export const getSingleUserByEmail = async (email) => db.oneOrNone(getUserByEmail, [email]);

export const addNewUser = async (data) => {
    const id = generateUUID();
    const {
        firstName, lastName, email, phoneNumber, dob, username, password, otp, confirmationToken
    } = data;
    const convertedUsername = username.toLowerCase();
    return db.one(insertNewUser, [id, firstName, lastName, email, phoneNumber, dob,
        username, convertedUsername, password, otp, confirmationToken
    ]);
};

export const updateOtpHash = async (data, email) => {
    const { hashedOTP, confirmationToken } = data;
    return db.one(updateUserOtp, [hashedOTP, confirmationToken, email]);
};

export const updateUserVerificationStatus = async (email) => db.one(updateUserStatus, [email]);

export const updatePasswordResetToken = async (token, email) => db.none(updateUserPasswordResetToken, [token, email]);

export const updatePassword = async (password, email) => db.none(updateUserPassword, [password, email]);

export const getUserProfile = async (userId) => db.one(getUserProfileByUserId, [userId]);
