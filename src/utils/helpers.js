import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const salt = genSaltSync(10);

export const hashInput = (data) => hashSync(data, salt);

export const generateUUID = () => uuidv4();

const jwtSecret = process.env.JWT_SECRET;

export const generateTokenForOtp = (data) => jwt.sign(data, jwtSecret);

export const decodeTokenForOtp = (token) => jwt.verify(token, jwtSecret, (err, data) => ({err, data}));

export const verifyInput = (data, hashedData) => compareSync(data, hashedData);

export const generateTokenForLogin = (data) => jwt.sign(data, jwtSecret, { expiresIn: '30m' });