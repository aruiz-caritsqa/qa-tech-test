const { pages } = require('../../page_objects/page_listing');
const { assert } = require('chai');

const elementTimeout = global.browser.config.waitforElementTimeout;
const pageTimeout = global.browser.config.waitforTimeout;

class Steps {

  async iGoToPage(page) {
    console.log(`iGoToPage :: ${page}`);
    let url;

    if (page.match(/^[A-Za-z0-9]+$/)) {
      // page object
      assert.isDefined(pages[page], `Could not find ${page} in page_objects/page_listing.js`);
      global.currentPage = pages[page];
      const pageObjPath = global.currentPage.gotoUrl();
      assert.isDefined(pageObjPath, `${page} doesn't return a valid value for gotoUrl(): ${pageObjPath}`);

      url = pageObjPath;
    } else if (page.match(/^(http|\/)/)) {
      // url begins with http or /
      url = page;
    } else {
      throw new Error(`iGoToPage :: ${page} is not a valid page to go to`);
    }
    await global.browser.url(url);
  }

  // ELEMENTS

  // iGetElement...

  async iGetElement({
    elementName,
    timeout = elementTimeout,
  }) {
    console.log(`iGetElement :: ${elementName} :: ${timeout / 1000}s timeout`);
    let element = null;
    const start = new Date();

    try {
      await global.browser.waitUntil(async () => {
        console.log({ page: global.currentPage });
        element = await global.currentPage[elementName]();
        return element != null;
      }, { timeout: parseInt(timeout, 10) });
    } catch (e) {
      throw new Error(`iGetElement :: The element ${elementName} is not on the page after ${timeout / 1000}s (${start} - ${new Date()})`);
    }

    if (element.constructor.name !== 'Array') {
      return element;
    } else if (element.constructor.name === 'Array') {
      return element[0];
    }
    return element;
  }

  async iGetElements({
    elementName,
    timeout = elementTimeout,
  }) {

    console.log(`iGetElements :: ${elementName} :: ${timeout / 1000}s timeout`);
    let elements = null;
    const start = new Date();

    try {
      await global.browser.waitUntil(async () => {
        elements = await global.currentPage[elementName]();
        return elements != null;
      }, { timeout: parseInt(timeout, 10) });
    } catch (e) {
      throw new Error(`iGetElements :: The elements ${elementName} are not on the page after ${timeout / 1000}s (${start} - ${new Date()})`);
    }

    // sometimes the elementName might be for a single element instead of array
    if (elements.constructor.name !== 'Array') {
      return [elements];
    }
    return elements;
  }

  // iShouldSee...

  async iShouldSee({
    elementName,
    timeout = elementTimeout,
    count = 1,
  }) {
    console.log(`iShouldSee :: ${elementName} :: ${count} element(s) :: ${timeout / 1000}s timeout`);
    let elements;
    await global.browser.waitUntil(async () => {
      elements = await this.iGetElements({ elementName, timeout });
      return elements != null && elements.constructor.name === 'Array' && elements.length >= count;
    }, parseInt(timeout, 10), `I should see ${elementName} on ${global.currentPage.__proto__.constructor.name} after ${timeout / 1000}s, but it isn't visible`);

    if (count === 1) {
      if (elements.constructor.name === 'Array') {
        assert.isAtLeast(elements.length, 1, `I should see ${count} ${elementName}on ${global.currentPage.__proto__.name}`);
      } else {
        assert.equal(elements.constructor.name, 'Element');
      }
    } else {
      assert.equal(elements.length, count, `I should see ${count} ${elementName} on ${global.currentPage.__proto__.name}`);
    }
    await global.currentPage.centreElementInView(elements[0]);
  }

  async iShouldNotSee({
    elementName,
    timeout = elementTimeout,
  }) {
    console.log(`iShouldNotSee :: ${elementName} :: ${timeout / 1000}s timeout`);
    let element;
    let isDisplayed;
    let isClickable;

    try {
      await global.browser.waitUntil(async () => {
        element = await global.currentPage[elementName]();
        if (element.constructor.name === 'Array') {
          element = element[nthElementPosition];
        }

        if (element) {
          // even though modals are closed, isDisplayed() returns true
          // so have to use isDisplayedInViewport()
          isDisplayed = await element.isDisplayedInViewport();
          isClickable = await element.isClickable();
        }
        return element == null || ((isDisplayed === false || typeof isDisplayed === 'undefined') && (isClickable === false || typeof isClickable === 'undefined'));
      }, { timeout: parseInt(timeout, 10) });
    } catch (e) {
      const elementString = element ? element.toString() : 'null';
      if (element == null || ((isDisplayed === false || typeof isDisplayed === 'undefined') && (isClickable === false || typeof isClickable === 'undefined'))) {
        // do nothing
      } else {
        throw new Error(`I should not see ${elementName} on ${global.currentPage.__proto__.name} after ${timeout / 1000}s, but it is visible => isDisplayed: ${isDisplayed} isClickable => ${isClickable}, element: ${elementString}`);
      }
    }
  }

  async iClickOn({
    elementName,
    timeout = elementTimeout,
  }) {
    console.log(`iClickOn ${elementName} :: ${timeout / 1000}s timeout`);
    await global.browser.waitUntil(async () => {
      const e = await this.iGetElement({ elementName, timeout });
      const isClicked = await global.currentPage.clickElement(e, timeout);
      return isClicked;
    }, { timeout: parseInt(timeout, 10), message: `Unable to click ${elementName} after ${timeout / 1000}s` });
  }

  async iTypeInto({
    elementName,
    input,
    timeout = elementTimeout,
  }) {
    const text = eval(`\`${input}\``);

    console.log(`iTypeInto :: ${elementName} => ${text} :: ${timeout / 1000}s timeout`);
    const element = await this.iGetElement({ elementName, timeout });

    element.click();
    await element.setValue(text);
  }
}

module.exports = new Steps();  