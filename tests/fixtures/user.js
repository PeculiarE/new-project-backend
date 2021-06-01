import faker from 'faker';

export const testWrongUser = {
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    dob: faker.date.past(),
    username: faker.random.alphaNumeric(7),
    phoneNumber: `${Math.ceil(1000000000 + Math.random()*90000000000)}`,
    password: faker.internet.password()
}

export const testRightUser = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    dob: faker.date.past(),
    username: faker.random.alphaNumeric(7),
    phoneNumber: faker.phone.phoneNumber('081########'),
    password: faker.internet.password()
}

export const testUsername = {
    username: testRightUser.username
}

export const testDuplicateUser = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: testRightUser.email,
    dob: faker.date.past(),
    username: faker.random.alphaNumeric(7),
    phoneNumber: faker.phone.phoneNumber('070########'),
    password: faker.internet.password()
}

export const testVerifiedUser = {
    email: testRightUser.email,
    password: testRightUser.password
}

export const testFirstUserEmail = {
    email: 'erhisoghenetega@gmail.com'
}

export const newPassword = {
    password: faker.internet.password()
}