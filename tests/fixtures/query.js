export const seedFirstUser = `
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
        confirmation_token
    ) values (
        '0626600c-da12-4afd-b090-b91904441f77',
        'Modupe',
        'Falodun',
        $1,
        '08126432823',
        '1996-04-26',
        'Pecsy56',
        'pecsy56',
        '$2a$10$7Mow76Z0FafQUxgpcmVT1exNydjQ7TIhTywnbrNzcRkwE3JBdvVsW',
        'xxxxxxxxxxxxx',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkRhbmUuU2NodW1tODhAZ21haWwuY29tIiwiaWF0IjoxNjIxMzQ2MzU1LCJleHAiOjE2MjEzNDY2NTV9.VUNAVp69MrVeigqP4JDFhK56lEtOpRVqXHA9z2rO1IU'
        );
`