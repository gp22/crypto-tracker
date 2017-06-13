const request = require('supertest');
const expect = require('expect');

const { app } = require('./../server');

/*
Verify that we get a homepage
*/
describe('GET /', () => {
  it('should return a 200 for the index route', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });
});

/*
Verify that we can add a currency pair to the db
*/
describe('POST /api/currency', () => {
  it('should create a new currency pair', (done) => {
    const currency1 = 'USDT';
    const currency2 = 'BTC';
    const start = '1495874524';

    request(app)
      .post('/api/currency')
      .send({ currency1, currency2, start })
      .expect(200)
      .expect((res) => {
        expect(res.body.currencyPair).toExist();
        expect(res.body.currencyPair).toBe(`${currency1}_${currency2}`);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});
