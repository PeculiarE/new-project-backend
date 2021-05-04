import db from '../../db/setup';
import { insertWalletDetails, updateWalletOtpPin, getWalletByUserId, updateWalletPinResetStatus,
    updateWalletPin, updateWalletBalanceAfterDeposit, getBalanceFromUsername, updateWalletBalancesAfterTransfer,
    getWalletBalanceByUserId,
} from '../../db/queries/wallet';

import { generateUUID } from '../utils';

import { addSingleTransaction, addMultipleTransactions, addFirstSingleTransactionHistory,
    getHistoryByUserId, addSubsequentSingleTransactionsHistory, addFirstMultipleTransactionsHistory,
    addSubsequentMultipleTransactionsHistory
} from './transaction';

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
    const { balance, id } = await retrieveWalletByUserId(userId);
    const incomingFund = Number(data) * 100;
    const newBalance = Number(balance) + incomingFund;
    console.log(balance, incomingFund, newBalance);
    const transactionData = { walletId: id, amount: incomingFund };
    console.log(transactionData);
    const { id: transactionId } = await addSingleTransaction(transactionData);
    console.log(transactionId);
    const transactionHistoryRow = await getHistoryByUserId(userId);
    console.log(transactionHistoryRow);
    if (!transactionHistoryRow) {
        const transactionHistoryData = { userId, transactionId };
        console.log(userId, transactionHistoryData);
        await addFirstSingleTransactionHistory(transactionId, userId);
    } else {
        await addSubsequentSingleTransactionsHistory(transactionId, userId);
    }
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
    const { balance, id } = await retrieveWalletByUserId(userId);
    const userNewBalance = Number(balance) - transferredFund;
    const convertedRecipientUsername = String(recipientUsername).toLowerCase();
    const {
        balance: recipientBalance, user_id: recipientUserId, id: receiverWalletId
    } = await retrieveBalanceFromUsername(convertedRecipientUsername);
    const recipientNewBalance = Number(recipientBalance) + transferredFund;
    console.log(userId, userNewBalance, recipientUserId, recipientNewBalance);
    const transactionData = { senderWalletId: id, amount: transferredFund, receiverWalletId };
    const transactionIds = await addMultipleTransactions(transactionData);
    let senderTransactionId = '';
    let recipientTransactionId = '';
    transactionIds.forEach((el) => {
            if (el.transaction_type === 'transfer')
            {
                senderTransactionId = el.id;
                return senderTransactionId;
            }
            else {
                recipientTransactionId = el.id;
                return recipientTransactionId;
            }
        })
    const senderTransactionHistoryRow = await getHistoryByUserId(userId);
    const recipientTransactionHistoryRow = await getHistoryByUserId(recipientUserId);
    const historyData = { senderUserId: userId, senderTransactionId, recipientUserId, recipientTransactionId };
    if (senderTransactionHistoryRow && recipientTransactionHistoryRow) {
        await addSubsequentMultipleTransactionsHistory(historyData);
    } else if (!senderTransactionHistoryRow && !recipientTransactionHistoryRow) {
        await addFirstMultipleTransactionsHistory(historyData);
    // } else if (!senderTransactionHistoryRow && recipientTransactionHistoryRow) {
    //     await addFirstSingleTransactionHistory(senderTransactionId, userId);
    //     await addSubsequentSingleTransactionsHistory(recipientTransactionId, recipientUserId);
    // I feel the above elseif block is redundant as sender must fund before he can transfer
    // and would therefore have history
    } else {
        console.log(recipientUserId, recipientTransactionId, senderTransactionId, userId);
        await addFirstSingleTransactionHistory(recipientTransactionId, recipientUserId);
        await addSubsequentSingleTransactionsHistory(senderTransactionId, userId);
    }
    return db.many(updateWalletBalancesAfterTransfer, [userId, userNewBalance, recipientUserId, recipientNewBalance]);
};

export const getWalletBalance = async (userId) => db.one(getWalletBalanceByUserId, [userId]);
