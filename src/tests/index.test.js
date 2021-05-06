import chai, { expect } from 'chai';
import chaiHttp from 'chai-http'
import server from '../bin/www'
import './user.test'

chai.use(chaiHttp);
chai.should()
let bearerToken;

describe('Hello Test suite', function () {
    // this.timeout(0)
    it('Should say hello', done => {
        console.log(('Hello, test!'))
        done()
    })

    it('Should say hello to Peculiar', done => {
        console.log(('Hello, Perculiar!'))
        expect(1).to.eql(1)
        done()
    })
    it('Should Login user', async () => {
        const req = chai.request('http://localhost:3000')
            .get('/login')
            .end((err, res) => {
                console.log('Response from testing home route is', res);
                expect(res.body).to.have.status(200)
                bearerToken = res.body.token
            })
    })

    it('Should return NOT_FOUND for wrong email', async () => {
        const req = chai.request('http://localhost:3000')
            .get('/login')
            .end((err, res) => {
                console.log('Response from testing home route is', res);
                expect(res.body).to.have.status(200)
                bearerToken = res.body.token
            })
    })

    it('Should say hello to home route', async () => {
        const req = chai.request('http://localhost:3000')
            .get('/')
            .set('Authorization', `Bearer ${bearerToken}`)
            .end((err, res) => {
                console.log('Response from testing home route is', res);
            })
    })
});
