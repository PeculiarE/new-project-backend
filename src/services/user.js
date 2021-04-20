import db from '../../db/setup';
import { getUserByUsername, getUserByEmail, insertNewUser } from '../../db/queries/user';
import { generateUUID } from '../utils';

export const getSingleUserByUsername  = async (username) => db.oneOrNone(getUserByUsername, [username]);

export const getSingleUserByEmail = async (email) => db.oneOrNone(getUserByEmail, [email]);

export const addNewUser = async (data) => {
    const id = generateUUID();
    const {
        firstName, lastName, email, phoneNumber, dob, username, password, otp
    } = data;
    const convertedUsername = String(username).toLowerCase();
    return db.one(insertNewUser, [id, firstName, lastName, email, phoneNumber, dob, username, convertedUsername, password, otp
    ]);
};