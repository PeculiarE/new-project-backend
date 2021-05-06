export const getUserByUsername = `
    select * from users
    where converted_username = $1;
`;

export const getUserByEmail = `
    select * from users
    where email = $1;
`;

export const insertNewUser = `
    insert into users (
        id,
        first_name,
        last_name,
        email,
        phone_number,
        dob,
        username,
        converted_username,
        password_hash,
        otp_hash) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        returning *;
`;

export const updateUserOtp = `
    update users
    set
    otp_hash = $1,
    otp_hash_sent = NOW(),
    updated_at = NOW() where email = $2
    returning *;
`;

export const updateUserStatus = `
    update users
    set
    is_confirmed = true,
    updated_at = NOW() where email = $1
    returning *;
`;

export const updateUserPasswordResetToken = `
    update users
    set
    password_reset_token = $1,
    updated_at = NOW() where email = $2
    returning *;
`;

export const updateUserPassword = `
    update users
    set
    password_hash = $2,
    updated_at = NOW() where email = $1
    returning *;
`;

export const getUserProfileByUserId = `
    select first_name, last_name, email, dob, phone_number, username, balance
    from users us
    join wallets wt on
    wt.user_id = us.id
    where us.id = $1;
`;