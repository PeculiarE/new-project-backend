export const insertSingleTransaction = `
    insert into transactions (
        id,
        wallet_id,
        amount,
        transaction_type,
        transaction_status) values ($1, $2, $3, $4, 'Successful')
        returning id;
`;

export const insertMultipleTransactions = `
    insert into transactions (
        id,
        wallet_id,
        amount,
        transaction_type,
        transaction_status)
    values
    ($1, $2, $3, $4, 'Successful'),
    ($5, $6, $7, $8, 'Successful')
    returning id, transaction_type;
`;

export const insertOrUpdateTransactionHistory = `
    insert into transaction_history (
        id,
        user_id,
        transactions)
    values
    ($1, $2, $3)
    on conflict (user_id)
    do
    update
    set transactions = array_append(transaction_history.transactions, $4),
    updated_at = NOW()
`;

export const getTransactionHistoryArrayByUserId = `
    SELECT t.id as transaction_id, transaction_type, transaction_status,
    t.updated_at as transaction_date, amount
    FROM transactions t
    JOIN transaction_history th
    ON t.id = ANY(th.transactions)
    where user_id = $1; 
`;