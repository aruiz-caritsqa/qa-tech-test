/* eslint - disable no - await -in -loop * /
/* eslint-disable class-methods-use-this */
const fs = require('fs-extra');
const { MethodMissingClass } = require('unmiss');

let self;

class Page extends MethodMissingClass {
  constructor() {
    super();
    self = this;
  }

  checkUrl() {
  }

  gotoUrl() {
  }

  async verifyOnPageAndReady(timeout = global.browser.config.waitforTimeout) {
    let currentUrl;
    let readyState;

    const expectedUrl = global.currentPage.checkUrl();
    const start = new Date();
    try {
      await global.browser.waitUntil(async () => {
        currentUrl = await global.browser.getUrl();
        console.log(`>> currentUrl: ${currentUrl} (Expected ${expectedUrl} within ${timeout}ms)`);
        readyState = await global.browser.execute('return document.readyState');
        return currentUrl.match(new RegExp(expectedUrl)) && readyState === 'complete';
      }, { timeout: parseInt(timeout, 10) });
    } catch (e) {
      throw new Error(`The current url '${currentUrl}' does not match ${expectedUrl} or document.readyState value of "${readyState}" does not equal 'complete' after ${timeout / 1000}s (${start} - ${new Date()})`);
    }

    if (currentUrl.match(new RegExp(expectedUrl)) == null) {
      return false;
    }
    await global.browser.pause(250);
    // document.readyState === 'complete'
    // jQuery.active == 0
    return true;
  }

  async waitForElements(selector, timeout = global.browser.config.waitforElementTimeout) {
    let elementsObj;
    let isDisplayed;
    let isExisting;
    const start = new Date();

    try {
      await global.browser.waitUntil(async () => {
        elementsObj = await global.browser.$$(selector);
        console.log(`>>> waitForElements :: ${selector} (max timeout: ${timeout})`);
        if (elementsObj && elementsObj.length > 0) {
          isExisting = await elementsObj[0].isExisting();
          isDisplayed = await elementsObj[0].isDisplayed();
        }
        return isDisplayed && isExisting;
      }, { timeout: parseInt(timeout, 10) });
    } catch (e) {
      const msg = `waitForElements :: failed for ${selector} after ${timeout / 1000}s. Number of elements found: ${elementsObj.length} :: isDisplayed: ${isDisplayed} :: isExisting: ${isExisting} (${start} - ${new Date()})`;
      // process.emit('test:log', msg);
      console.log(msg);
    }
    return elementsObj;
  }

  async hiliteElement(element, colour = 'red') {
    if (global.isMobileDevice) {
      return;
    }
    console.log(`>>> hiliteElement :: ${element.selector}`);
    await global.browser.execute(
      `arguments[0].setAttribute('style', 'background-color: ${colour}');`,
      element,
    );
  }

  async flashElement(element, colour) {
    if (global.isMobileDevice) {
      return;
    }

    const displayStyle = await element.getCSSProperty('display');
    if (displayStyle.value === 'none') {
      // don't flash an element with a style that contains "display: none"
      return;
    }

    const bgColour = await element.getCSSProperty('background-color');
    await self.hiliteElement(element, colour);
    console.log(`>>> flashElement :: ${element.selector}`);
    await global.browser.pause(100);
    await global.browser.execute(
      `arguments[0].setAttribute('style', 'background-color: ${bgColour}');`,
      element,
    );
  }

  async centreElementInView(element, timeout = global.browser.config.waitforElementTimeout) {
    console.log(`>>> centreElementInView :: ${element.selector} :: ${timeout / 1000}s timeout`);
    await global.browser.execute(`
      arguments[0].scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
      });`, element);
  }

  async clickElement(
    element,
    timeout = global.browser.config.waitforElementTimeout,
    isFlash = true,
    isHilite = false,
  ) {
    let isDisplayed;
    let isEnabled;
    let isClickable;

    try {
      console.log(`>> clickElement :: ${element.selector}`);
      await global.browser.waitUntil(async () => {
        isDisplayed = await element.isDisplayed();
        isEnabled = await element.isEnabled();
        isClickable = await element.isClickable();
        return isDisplayed === true && isEnabled === true && isClickable === true;
      }, { timeout: parseInt(timeout, 10) });
    } catch (e) {
      throw new Error(`clickElement :: element ${element.selector} unable to be clicked after ${timeout / 1000}s. isDisplayed: ${isDisplayed} :: isEnabled: ${isEnabled} :: isClickable: ${isClickable}`);
    }

    if (!global.isMobileDevice) {
      // await self.centreElementInView(element);
      // await element.scrollIntoView();

      if (isFlash) {
        await self.flashElement(element);
      }

      if (isHilite) {
        await self.hiliteElement(element, 'blue');
      }
    }

    try {
      await element.click();
    } catch (e) {
      process.emit('test:log', e);
      return false;
    }
    console.log(`>> successfully clicked ${element.selector}`);
    return true;
  }

  async doubleClickElement(
    element,
    timeout = global.browser.config.waitforElementTimeout,
    isFlash = true,
    isHilite = false,
  ) {
    let isDisplayed;
    let isEnabled;
    let isClickable;

    try {
      console.log(`>> doubleClickElement :: ${element.selector}`);
      await global.browser.waitUntil(async () => {
        isDisplayed = await element.isDisplayed();
        isEnabled = await element.isEnabled();
        isClickable = await element.isClickable();
        return isDisplayed === true && isEnabled === true && isClickable === true;
      }, { timeout: parseInt(timeout, 10) });
    } catch (e) {
      throw new Error(`doubleClickElement :: element ${element.selector} unable to be double-clicked after ${timeout / 1000}s. isDisplayed: ${isDisplayed} :: isEnabled: ${isEnabled} :: isClickable: ${isClickable}`);
    }

    if (!global.isMobileDevice) {
      // await self.centreElementInView(element);
      // await element.scrollIntoView();

      if (isFlash) {
        await self.flashElement(element);
      }

      if (isHilite) {
        await self.hiliteElement(element);
      }
    }

    try {
      await element.doubleClick();
    } catch (e) {
      process.emit('test:log', e);
      return false;
    }
    return true;
  }

  async hoverElement(element) {
    console.log(`>> hoverElement :: ${element.selector}`);
    await self.centreElementInView(element);
    await element.moveTo();
  }

  async waitUntilElementHasDisappeared(element, timeout = global.browser.config.waitforTimeout) {
    if (element == null) return null;

    try {
      await element.waitForExist(timeout, true);
    } catch (e) {
      return element;
    }
    return null;
  }

  async getElement(
    selector,
    timeout = global.browser.config.waitforElementTimeout,
    isFlash = true,
  ) {
    console.log(`>> getElement :: ${selector}`);
    const elementsObj = await self.waitForElements(selector, timeout);
    console.log(`>>> getElement :: ${selector} => ${elementsObj.length} elements, isFlash: ${isFlash}`);

    if (elementsObj.length > 0) {
      await self.centreElementInView(elementsObj[0]);
    }

    if (isFlash && elementsObj.length > 0) {
      await self.flashElement(elementsObj[0], 'yellow');
      return elementsObj[0];
    }
    return null;
  }

  async getElements(
    selector,
    timeout = global.browser.config.waitforElementTimeout,
    isFlash = true,
  ) {
    console.log(`>> getElements :: ${selector}`);
    const elementsObj = await self.waitForElements(selector, timeout);
    console.log(`>>> getElements :: ${selector} => ${elementsObj.length} elements`);
    if (elementsObj.length > 0) {
      if (isFlash) {
        for (let i = 0; i < elementsObj.length; i += 1) {
          await self.flashElement(elementsObj[i], 'yellow');
        }     
      }   
      return elementsObj;
    }
    return null;
  }

  async methodMissing(name, ...args) {
    console.log(`Method ${name} was called with arguments:`, JSON.stringify(args));
    if (name === 'toJSON') {
      return null;
    }

    let elements;
    if (args[0] && args[0].sectionXPath) {
      console.log('sectionXPath');
      elements = await self.getElements(`${args[0].sectionXPath}//*[@${global.browser.config.attributeHook}="${name}"]`);
    } else {
      elements = await self.getElements(`//*[@${global.browser.config.attributeHook}="${name}"]`);
    }

    console.log('methodMissing');
    if (elements.constructor.name === 'Array' && elements.length === 1) {
      return elements[0];
    }
    return elements;
  }
}
module.exports = Page;