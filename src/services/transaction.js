import db from '../../db/setup';
import { insertSingleTransaction, insertMultipleTransactions, getTransactionHistoryByUserId,
    insertFirstSingleTransactionHistory, updateSubsequentSingleTransactionsHistory,
    insertFirstMultipleTransactionsHistory, updateSubsequentMultipleTransactionsHistory,
    getTransactionHistoryArrayByUserId,
} from '../../db/queries/transaction';
import { generateUUID } from '../utils';

export const addSingleTransaction = async (data) => {
    const id = generateUUID();
    const { walletId, amount } = data;
    return db.one(insertSingleTransaction, [id, walletId, amount, 'deposit']);
};

export const addMultipleTransactions = async (data) => {
    const senderId = generateUUID();
    const receiverId = generateUUID();
    const { senderWalletId, amount, receiverWalletId } = data;
    return db.many(insertMultipleTransactions, [
        senderId, senderWalletId, amount, 'transfer', receiverId, receiverWalletId, amount, 'deposit']);
};

export const getHistoryByUserId = async (userId) => db.oneOrNone(getTransactionHistoryByUserId, [userId]);

export const addFirstSingleTransactionHistory = async (transactionId, userId) => {
    const id = generateUUID();
    const transactionArray = `{${transactionId}}`
    return db.one(insertFirstSingleTransactionHistory, [id, userId, transactionArray]);
};

export const addSubsequentSingleTransactionsHistory = async (transactionId, userId) => {
    return db.one(updateSubsequentSingleTransactionsHistory, [transactionId, userId]);
};

export const addFirstMultipleTransactionsHistory = async (data) => {
    const senderId = generateUUID();
    const recipientId = generateUUID();
    const { senderUserId, senderTransactionId, recipientUserId, recipientTransactionId } = data;
    const senderTransactionArray = `{${senderTransactionId}}`;
    const recipientTransactionArray = `{${recipientTransactionId}}`;
    return db.many(insertFirstMultipleTransactionsHistory, [
        senderId, senderUserId, senderTransactionArray, recipientId, recipientUserId, recipientTransactionArray]);
};

export const addSubsequentMultipleTransactionsHistory = async (data) => {
    const { senderUserId, senderTransactionId, recipientUserId, recipientTransactionId } = data
    return db.many(updateSubsequentMultipleTransactionsHistory, [
        senderUserId, senderTransactionId, recipientUserId, recipientTransactionId
    ]);
};

export const getHistoryArrayByUserId = async (userId) => {
    return db.manyOrNone(getTransactionHistoryArrayByUserId, [userId]);
}