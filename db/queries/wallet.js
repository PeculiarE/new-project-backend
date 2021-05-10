export const insertWalletDetails = `
    insert into wallets (
        id,
        user_id,
        pin_hash) values ($1, $2, $3)
        returning id, user_id, balance;
`;

export const updateWalletPinResetToken = `
    update wallets
    set
    pin_reset_token = $1,
    is_pin_reset_confirmed = false,
    updated_at = NOW() where user_id = $2;
`;

export const getWalletByUserId = `
    select * from wallets
    where user_id = $1;
`;

export const updateWalletPinResetStatus = `
    update wallets
    set
    is_pin_reset_confirmed = true,
    updated_at = NOW() where user_id = $1;
`;

export const updateWalletPin = `
    update wallets
    set
    pin_hash = $1,
    is_pin_reset_confirmed = false,
    updated_at = NOW() where user_id = $2;
`;

export const updateWalletBalanceAfterDeposit = `
    update wallets
    set
    balance = $1,
    updated_at = NOW() where user_id = $2
    returning id, user_id, balance;
`;

export const getBalanceFromUsername = `
    select username, user_id, wt.id, balance from users us
    join wallets wt on
    wt.user_id = us.id
    where converted_username = $1;
`;

export const updateWalletBalancesAfterTransfer = `
    update wallets
    set
    balance = 
    case user_id
        when $1 then $2
        when $3 then $4
    end,
    updated_at = 
    case user_id
        when $1 then NOW()
        when $3 then NOW()
    end
    where user_id in ($1, $3)
    returning user_id = $1 as sender, balance;
`;
