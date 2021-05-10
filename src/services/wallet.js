import db from '../../db/setup';
import { insertWalletDetails, updateWalletPinResetToken, getWalletByUserId, updateWalletPinResetStatus,
    updateWalletPin, updateWalletBalanceAfterDeposit, getBalanceFromUsername, updateWalletBalancesAfterTransfer,
} from '../../db/queries/wallet';

import helperFunctions from '../utils';

import { addSingleTransaction, addMultipleTransactions, addOrUpdateTransactionHistory
} from './transaction';

const { generateUUID } = helperFunctions;

export const addWalletDetails = async (data) => {
    const id = generateUUID();
    const { userId, pinHash } = data;
    return db.one(insertWalletDetails, [id, userId, pinHash]);
}

export const updatePinResetToken = async (token, userId) => db.none(updateWalletPinResetToken, [token, userId]);

export const retrieveWalletByUserId = async (userId) => db.oneOrNone(getWalletByUserId, [userId]);

export const updatePinResetStatus = async (userId) => db.none(updateWalletPinResetStatus, [userId]);

export const updatePin = async (pin, userId) => db.none(updateWalletPin, [pin, userId]);

export const updateBalanceAfterDeposit = async (data, userId) => {
    const { balance, id } = await retrieveWalletByUserId(userId);
    const incomingFund = data * 100;
    const newBalance = Number(balance) + incomingFund;
    const transactionData = { walletId: id, amount: incomingFund };
    const { id: transactionId } = await addSingleTransaction(transactionData);
    await addOrUpdateTransactionHistory(transactionId, userId);
    return db.one(updateWalletBalanceAfterDeposit, [newBalance, userId]);
};

// export const updateBalanceAfterDeposit = db.tx (async (t, data, userId) => {
//     const q1 = retrieveWalletByUserId(userId);
//     const { balance, id } = q1;
//     const incomingFund = data * 100;
//     const newBalance = Number(balance) + incomingFund;
//     const transactionData = { walletId: id, amount: incomingFund };
//     const q2 = addSingleTransaction(transactionData);
//     const { id: transactionId } = q2;
//     const q3 = addOrUpdateTransactionHistory(transactionId, userId);
//     const q4 = t.one(updateWalletBalanceAfterDeposit, [newBalance, userId]);
//     return t.batch([q1, q2, q3, q4]);
// });

// db.tx(t => {
//     // creating a sequence of transaction queries:
//     const q1 = t.none('UPDATE users SET active = $1 WHERE id = $2', [true, 123]);
//     const q2 = t.one('INSERT INTO audit(entity, id) VALUES($1, $2) RETURNING id', ['users', 123]);

//     // returning a promise that determines a successful transaction:
//     return t.batch([q1, q2]); // all of the queries are to be resolved;
// })
//     .then(data => {
//         // success, COMMIT was executed
//     })
//     .catch(error => {
//         // failure, ROLLBACK was executed
//     });

export const roundingUpCurrency = (number, precision) => {
    let base = 10 ** precision;
    return (Math.round(number * base) / base).toFixed(precision);
};

const retrieveBalanceFromUsername = async (username) => db.one(getBalanceFromUsername, [username]);

const getTransactionIds = (transactionArray) => {
    let senderTransactionId = '';
    let recipientTransactionId = '';
    transactionArray.forEach((el) => {
        if (el.transaction_type === 'transfer') {
            senderTransactionId = el.id;
            return senderTransactionId;
        } else {
            recipientTransactionId = el.id;
            return recipientTransactionId;
        }
    })
    return { senderTransactionId, recipientTransactionId};
};

export const updateBalanceAfterTransfer = async (data) => {
    const { userId, amount, recipientUsername } = data;
    const transferredFund = amount * 100;
    const { balance, id } = await retrieveWalletByUserId(userId);
    const userNewBalance = Number(balance) - transferredFund;
    const convertedRecipientUsername = recipientUsername.toLowerCase();
    const {
        balance: recipientBalance, user_id: recipientUserId, id: receiverWalletId
    } = await retrieveBalanceFromUsername(convertedRecipientUsername);
    const recipientNewBalance = Number(recipientBalance) + transferredFund;
    const transactionData = { senderWalletId: id, amount: transferredFund, receiverWalletId };
    const transactionIds = await addMultipleTransactions(transactionData);
    const idObject = getTransactionIds(transactionIds);
    await addOrUpdateTransactionHistory(idObject.senderTransactionId, userId)
    await addOrUpdateTransactionHistory(idObject.recipientTransactionId, recipientUserId);
    return db.many(updateWalletBalancesAfterTransfer, [userId, userNewBalance, recipientUserId, recipientNewBalance]);
};
