import faker from 'faker';

export const testUsername = {
    username: faker.internet.userName()
}

export const testUser = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    dob: faker.date.past(),
    username: testUsername.username,
    phoneNumber: faker.phone.phoneNumber(),
    password: faker.internet.password()
}

export const testDuplicateUsername = {
    username: testUsername.username
}