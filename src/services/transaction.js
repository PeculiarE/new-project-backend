import db from '../../db/setup';
import { insertSingleTransaction, insertMultipleTransactions,
    insertOrUpdateTransactionHistory,
    getTransactionHistoryArrayByUserId,
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

export const getHistoryArrayByUserId = async (userId) => {
    return db.manyOrNone(getTransactionHistoryArrayByUserId, [userId]);
}