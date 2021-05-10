export const getUserByUsername = `
    select * from users
    where converted_username = $1;
`;

export const getUserByEmail = `
    select us.first_name as firstname, us.email,
    us.is_confirmed, us.password_hash, us.otp_hash,
    us.id as userid, wt.id as walletid
    from users us
    left join wallets wt on
    wt.user_id = us.id
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
        otp_hash,
        confirmation_token) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        returning id, first_name, last_name, email, confirmation_token, is_confirmed;
`;

export const updateUserOtp = `
    update users
    set
    otp_hash = $1,
    confirmation_token = $2,
    updated_at = NOW() where email = $3
    returning id, first_name, last_name, email, confirmation_token, is_confirmed;
`;

export const updateUserStatus = `
    update users
    set
    is_confirmed = true,
    updated_at = NOW() where email = $1
    returning id, first_name, last_name, email, is_confirmed;;
`;

export const updateUserPasswordResetToken = `
    update users
    set
    password_reset_token = $1,
    updated_at = NOW() where email = $2;
`;

export const updateUserPassword = `
    update users
    set
    password_hash = $1,
    updated_at = NOW() where email = $2;
`;

export const getUserProfileByUserId = `
    select first_name, last_name, email, dob, phone_number, username, balance
    from users us
    join wallets wt on
    wt.user_id = us.id
    where us.id = $1;
`;
