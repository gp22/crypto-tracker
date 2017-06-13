const { CurrencyPair } = require('./../models/currencyPair');
const { app } = require('./../server');
const request = require('supertest');
const expect = require('expect');

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
  this.timeout(3000);

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
    const currency1 = '';
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
});
