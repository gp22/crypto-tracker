const { CurrencyPair } = require('./../models/currencyPair');
const { clearCurrencyPairs } = require('./seed/seed');
const { app } = require('./../server');
const request = require('supertest');
const expect = require('expect');

before(clearCurrencyPairs);

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
describe('POST /api/currency', function () {
  // Disable this when testing with MLAB db
  this.timeout(5000);

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

        CurrencyPair.findById(res.body._id).then((foundCurrencyPair) => {
          expect(foundCurrencyPair.currencyPair).toBe(`${currency1}_${currency2}`);
          done();
        }).catch(error => done(error));
      });
  });

  it('should not create a duplicate currency pair', (done) => {
    const currency1 = 'USDT';
    const currency2 = 'BTC';
    const start = '1495874524';

    request(app)
      .post('/api/currency')
      .send({ currency1, currency2, start })
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }

        CurrencyPair.find().then((currencyPairs) => {
          expect(currencyPairs.length).toBe(1);
          done();
        }).catch(error => done(error));
      });
  });

  it('should not create a currency pair with invalid data', (done) => {
    const currency1 = 'USDT';
    const currency2 = 'BTC';
    const start = '';

    request(app)
      .post('/api/currency')
      .send({ currency1, currency2, start })
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }

        CurrencyPair.find().then((currencyPairs) => {
          expect(currencyPairs.length).toBe(1);
          done();
        }).catch(error => done(error));
      });
  });
});

describe('DELETE /api/currency', () => {
  it('should delete an existing currency pair', (done) => {
    const currency1 = 'USDT';
    const currency2 = 'BTC';

    request(app)
      .delete('/api/currency')
      .send({ currency1, currency2 })
      .expect(200)
      .end((err) => {
        if (err) {
          return done(err);
        }

        CurrencyPair.find().then((currencyPairs) => {
          expect(currencyPairs.length).toBe(0);
          done();
        }).catch(error => done(error));
      });
  });

  it('should return 404 if currency pair not found', (done) => {
    const currency1 = 'USDT';
    const currency2 = 'BTC';

    request(app)
      .delete('/api/currency')
      .send({ currency1, currency2 })
      .expect(404)
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should return 400 if invalid data supplied', (done) => {
    const currency1 = 'a';
    const currency2 = '';

    request(app)
      .delete('/api/currency')
      .send({ currency1, currency2 })
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});
