import { CryptoTrackerPage } from './app.po';

describe('crypto-tracker App', () => {
  let page: CryptoTrackerPage;

  beforeEach(() => {
    page = new CryptoTrackerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
