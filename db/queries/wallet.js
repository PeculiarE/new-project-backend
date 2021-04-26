export const insertWalletDetails = `
    insert into wallets (
        id,
        user_id,
        pin_hash) values ($1, $2, $3)
        returning *;
`;

export const updateWalletOtpPin = `
    update wallets
    set
    pin_reset_token = $1,
    is_pin_reset_confirmed = $2,
    pin_reset_token_sent = NOW(),
    updated_at = NOW() where user_id = $3
    returning *;
`;

export const getWalletByUserId = `
    select * from wallets
    where user_id = $1;
`;

export const updateWalletPinResetStatus = `
    update wallets
    set
    is_pin_reset_confirmed = $2,
    updated_at = NOW() where user_id = $1
    returning *;
`;

export const updateWalletPin = `
    update wallets
    set
    pin_hash = $1,
    is_pin_reset_confirmed = $2,
    updated_at = NOW() where user_id = $3
    returning *;
`;
