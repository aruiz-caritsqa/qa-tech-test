const Page = require('../page');

let self;

/**
 * Elements that have a data-test-id attribute do not need to be defined in the POM - they are caught by the methodMissing function in the Page object
 * render-challenge
 * submit-1
 * submit-2
 * submit-3
 * submit-4
 */

class HomePage extends Page {
  constructor() {
    super();
    self = this;
  }

  gotoUrl() {
    return '/';
  }

  async arraysChallengePanel() {
    const res = await self.getElement('//section[@id="challenge"]');
    return res;
  }

  async challengeRowAsArray(rowNum = 1) {
    const cells = await self.getElements(`//td[contains(@data-test-id, "array-item-${rowNum}-")]`, undefined, false);
    const array = await Promise.all(cells.map((cell) => cell.getText()));
    return array.map((e) => parseInt(e, 10));;
  }

  async submitButton() {
    const res = await self.getElement('//button[.//span[text() = "Submit Answers"]]');
    return res;
  }
}

module.exports = new HomePage();