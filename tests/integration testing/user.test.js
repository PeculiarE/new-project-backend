import server from '../../src/bin/www';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import userFixtures from '../fixtures';

chai.use(chaiHttp);
chai.should();

const {
    testUsername, testUser,
    testDuplicateUsername
} = userFixtures;

describe('User Routes', () => {
    it('Should check that username is unique', (done) => {
        chai.request(server).post('/api/v1/validate-username')
        .send(testUsername).end((err, res) => {
            console.log(testUsername);
            expect(res.body.status).to.be.equal('Success');
            expect(res.body.message).to.be.equal('Username available');
            done();
        })
    });
    it('Should check that user has been signed up and OTP sent to user\'s email', (done) => {
        chai.request(server).post('/api/v1/signup')
        .send(testUser).end((err, res) => {
            console.log(testUser);
            console.log(err);
            expect(res.body.status).to.be.equal('Success');
            expect(res.body.message).to.be.equal('User has been signed up and OTP sent to their email')
            console.log(err);
            done();
        })
    });
    // it('Should check that username is already taken', (done) => {
    //     chai.request(server).post('/api/v1/validate-username')
    //     .send(testDuplicateUsername).end((err, res) => {
    //         console.log(testDuplicateUsername);
    //         expect(res.body.status).to.be.equal('Fail');
    //         expect(res.body.message).to.be.equal('Username already taken');
    //         done();
    //     })
    // });
})
