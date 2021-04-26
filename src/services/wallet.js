import db from '../../db/setup';
import { insertWalletDetails, updateWalletOtpPin, getWalletByUserId, updateWalletPinResetStatus,
    updateWalletPin
} from '../../db/queries/wallet';
import { generateUUID } from '../utils';

export const addWalletDetails = async (data) => {
    const id = generateUUID();
    const { userId, pinHash } = data;
    return db.one(insertWalletDetails, [id, userId, pinHash]);
}

export const updateOtpPin = async (data, status, userId) => db.one(updateWalletOtpPin, [data, status, userId]);

export const retrieveWalletByUserId = async (userId) => db.oneOrNone(getWalletByUserId, [userId]);

export const updatePinResetStatus = async (userId, status) => db.one(updateWalletPinResetStatus, [userId, status]);

export const updatePin = async (data, status, userId) => db.one(updateWalletPin, [data, status, userId]);
