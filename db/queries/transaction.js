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
    select t.id as transaction_id, transaction_type, transaction_status,
    t.updated_at as transaction_date, amount
    from transactions t
    join transaction_history th
    on t.id = any(th.transactions)
    where user_id = $1
    order by transaction_date desc; 
`;

export const getFilteredTransactionHistoryArrayByUserId = `
    select date_trunc('day', t.updated_at) as date_range,
    t.id as transaction_id, transaction_type,
    transaction_status, t.updated_at as transaction_date, amount
    from transactions t
    join transaction_history th
    on t.id = any(th.transactions)
    where user_id = $1
    and t.updated_at between $2 and $3
    and transaction_type = $4
    and transaction_status = $5
    order by transaction_date desc;
`;