import server from '../../src/bin/www';
import db from '../../db/setup';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { userFixtures, queries } from '../fixtures';

chai.use(chaiHttp);
chai.should();

const { seedFirstUser } = queries;
const {
    testUsername, testWrongUser, testRightUser,
    testFirstUserEmail, testDuplicateUser, testVerifiedUser,
    newPassword
} = userFixtures;

let otp;
let token;

before (async() => {
    console.log(testFirstUserEmail.email);
    return db.none(seedFirstUser, testFirstUserEmail.email)
});

describe('User Routes', () => {
    // it('Should check that username is unique', (done) => {
    //     chai.request(server).post('/api/v1/validate-username')
    //     .send(testUsername).end((err, res) => {
    //         expect(res.body.status).to.be.equal('Success');
    //         expect(res.body.message).to.be.equal('Username available');
    //         done();
    //     })
    // });
    // it('Should check that user signup details are incomplete', (done) => {
    //     chai.request(server).post('/api/v1/signup')
    //     .send(testWrongUser).end((err, res) => {
    //         console.log(testWrongUser);
    //         expect(res.body.status).to.be.equal('Fail');
    //         done();
    //     })
    // });
    // it('Should check that user has been signed up and OTP sent to user\'s email', (done) => {
    //     chai.request(server).post('/api/v1/signup')
    //     .send(testRightUser).end((err, res) => {
    //         console.log(testRightUser);
    //         otp = res.body.data.otp;
    //         token = res.body.data.token;
    //         console.log(otp, token);
    //         expect(res.body.status).to.be.equal('Success');
    //         expect(res.body.message).to.be.equal('User has been signed up and OTP sent to their email')
    //         done();
    //     })
    // });
    // it('Should check that username is already taken', (done) => {
    //     chai.request(server).post('/api/v1/validate-username')
    //     .send(testUsername).end((err, res) => {
    //         expect(res.body.status).to.be.equal('Fail');
    //         expect(res.body.message).to.be.equal('Username already taken');
    //         done();
    //     })
    // });
    // it('Should check that user already exists', (done) => {
    //     chai.request(server).post('/api/v1/signup')
    //     .send(testDuplicateUser).end((err, res) => {
    //         console.log(testDuplicateUser);
    //         expect(res.body.status).to.be.equal('Fail');
    //         expect(res.body.message).to.be.equal('Email already exists!');
    //         done();
    //     })
    // });
    // it('Should check that user has entered the correct OTP', (done) => {
    //     chai.request(server).post('/api/v1/auth/confirm-email')
    //     .set('Authorization', `Bearer ${token}`)
    //     .send({otp}).end((err, res) => {
    //         expect(res.body.status).to.be.equal('Success');
    //         expect(res.body.message).to.be.equal('Email successfully verified')
    //         done();
    //     })
    // });
    // it('Should check that user is able to login with correct details', (done) => {
    //     chai.request(server).post('/api/v1/auth/login')
    //     .send(testVerifiedUser).end((err, res) => {
    //         console.log(testVerifiedUser);
    //         token = res.body.data.loginToken;
    //         expect(res).to.have.status(201);
    //         done();
    //     })
    // });
    it('Should check that OTP has been resent to user', (done) => {
        chai.request(server).post('/api/v1/auth/resend-email-otp')
        .send(testFirstUserEmail).end((err, res) => {
            console.log(testFirstUserEmail);
            otp = res.body.data.otp;
            token = res.body.data.token;
            console.log(otp, token);
            expect(res.body.status).to.be.equal('Success');
            expect(res.body.message).to.be.equal('An OTP has been sent to user\'s email for verification')
            done();
        })
    });
    // it('Should check that reset password link has been sent to user', (done) => {
    //     chai.request(server).post('/api/v1/auth/forgot-password')
    //     .send({email: testVerifiedUser.email}).end((err, res, req, next) => {
    //         // req = res.body.data;
    //         token = res.body.data;
    //         console.log(token);
    //         expect(res).to.have.status(201);
    //         // next();
    //         done();
    //     })
    // });
    // it('Should check that user has been able to reset password successfully', (done) => {
    //     chai.request(server).post('/api/v1/auth/reset-password')
    //     // .set('Authorization', `Bearer ${req}`)
    //     .set('Authorization', `Bearer ${token}`)
    //     .send(newPassword).end((err, res) => {
    //         expect(res).to.have.status(201);
    //         done();
    //     })
    // });
})
