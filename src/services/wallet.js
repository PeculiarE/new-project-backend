import db from '../../db/setup';
import { insertWalletDetails, updateWalletOtpPin, getWalletByUserId, updateWalletPinResetStatus,
    updateWalletPin, updateWalletBalanceAfterDeposit, getBalanceFromUsername, updateWalletBalancesAfterTransfer,
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

export const updateBalanceAfterDeposit = async (data, userId) => {
    const { balance } = await retrieveWalletByUserId(userId);
    const incomingFund = Number(data) * 100;
    const newBalance = Number(balance) + incomingFund;
    console.log(balance, incomingFund, newBalance);
    return db.one(updateWalletBalanceAfterDeposit, [newBalance, userId]);
};

export const roundingUpCurrency = (number, precision) => {
    let base = 10 ** precision;
    return (Math.round(number * base) / base).toFixed(precision);
};

const retrieveBalanceFromUsername = async (username) => db.one(getBalanceFromUsername, [username]);

export const updateBalanceAfterTransfer = async (data) => {
    const { userId, amount, recipientUsername } = data;
    const transferredFund = Number(amount) * 100;
    const { balance } = await retrieveWalletByUserId(userId);
    const userNewBalance = Number(balance) - transferredFund;
    const convertedRecipientUsername = String(recipientUsername).toLowerCase();
    const { balance: recipientBalance, user_id: recipientUserId } = await retrieveBalanceFromUsername(convertedRecipientUsername);
    const recipientNewBalance = Number(recipientBalance) + transferredFund;
    console.log(userId, userNewBalance, recipientUserId, recipientNewBalance);
    return db.many(updateWalletBalancesAfterTransfer, [userId, userNewBalance, recipientUserId, recipientNewBalance]);
};
