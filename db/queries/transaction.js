export const insertSingleTransaction = `
    insert into transactions (
        id,
        wallet_id,
        amount,
        transaction_type) values ($1, $2, $3, $4)
        returning *;
`;

export const insertMultipleTransactions = `
    insert into transactions (
        id,
        wallet_id,
        amount,
        transaction_type)
    values
    ($1, $2, $3, $4),
    ($5, $6, $7, $8)
    returning *;
`;

export const getTransactionHistoryByUserId = `
    select * from transaction_history
    where user_id = $1;
`;

export const insertFirstSingleTransactionHistory = `
    insert into transaction_history (
        id,
        user_id,
        transactions)
    values
    ($1, $2, $3)
    returning *;
`;

export const updateSubsequentSingleTransactionsHistory = `
    update transaction_history
    set
    transactions = array_append(transactions, $1),
    updated_at = NOW()
    where user_id = $2
    returning *;
`;

export const insertFirstMultipleTransactionsHistory = `
    insert into transaction_history (
        id,
        user_id,
        transactions)
    values
    ($1, $2, $3),
    ($4, $5, $6)
    returning *;
`;

export const updateSubsequentMultipleTransactionsHistory = `
    update transaction_history
    set
    transactions =
    case user_id
        when $1 then array_append(transactions, $2)
        when $3 then array_append(transactions, $4)
    end,
    updated_at = 
    case user_id
        when $1 then NOW()
        when $3 then NOW()
    end
    where user_id in ($1, $3)
    returning *;
`;