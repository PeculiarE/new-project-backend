import db from '../../db/setup';
import { insertSingleTransaction, insertMultipleTransactions,
    insertOrUpdateTransactionHistory,
    getTransactionHistoryArrayByUserId,
    getFilteredTransactionHistoryArrayByUserId,
    searchTransactionAmount, getFilteredSearchResults
} from '../../db/queries/transaction';
import helperFunctions from '../utils';

const { generateUUID } = helperFunctions;

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

export const addOrUpdateTransactionHistory = async (transactionId, userId) => {
    const id = generateUUID();
    const transactionArray = `{${transactionId}}`
    return db.none(insertOrUpdateTransactionHistory, [id, userId,
        transactionArray, transactionId]);
};

export const getHistoryArrayByUserId = async (userId, data) => {
    const { page, limit } = data;
    const offset = (page-1) * limit;
    return db.manyOrNone(getTransactionHistoryArrayByUserId, [userId, limit, offset]);
};

export const getFilteredHistoryArrayByUserId = async (userId, data) => {
    const { transactionType, startDate, endDate, transactionStatus, page, limit } = data;
    const realEndDate = `${endDate} 23:59:59`
    const offset = (page-1) * limit;
    return db.manyOrNone(getFilteredTransactionHistoryArrayByUserId, [
        userId,
        startDate,
        realEndDate,
        transactionType,
        transactionStatus,
        limit,
        offset
    ]);   
}

export const searchByAmount = async(userId, data) => {
    const { page, limit, search } = data;
    const amount = `${search}%`;
    const offset = (page-1) * limit;
    return db.manyOrNone(searchTransactionAmount, [userId, amount, limit, offset]);
}

export const getFilteredSearch = async (userId, data) => {
    const { transactionType, startDate, endDate, transactionStatus, page, limit, search } = data;
    const amount = `${search}%`;
    const realEndDate = `${endDate} 23:59:59`
    const offset = (page-1) * limit;
    return db.manyOrNone(getFilteredSearchResults, [
        userId,
        amount,
        startDate,
        realEndDate,
        transactionType,
        transactionStatus,
        limit,
        offset
    ]);   
}
