/* eslint-disable max-len */

const dotenv = require('dotenv').config();
const fs = require('fs-extra');
const glob = require('glob');

global.browserSizeName = process.env.SIZE;
baseUrl = process.env.BASE_URL || 'http://localhost:3000';

const browserSize = () => {
  switch (process.env.SIZE) {
    case 'xSmall':
      return { w: 320, h: 568 };
    case 'small':
      return { w: 375, h: 812 };
    case 'medium':
      return { w: 768, h: 1024 };
    case 'large':
      return { w: 1920, h: 1080 };
    case 'xLarge':
      return { w: 3840, h: 2160 };
    default:
      global.browserSizeName = 'large';
      return { w: 1920, h: 1080 };
  }
};

const logLevel = process.env.DEBUG ? 'verbose' : 'error';
const instances = 4;

let browserCapabilities = {};
const chromeDefaultCapabilities = {
  maxInstances: instances,
  browserName: 'chrome',
  'goog:chromeOptions': {
    args: [
      '--disable-blink-features',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
    ],
  },
  ...(process.env.HEADLESS && {
    'goog:chromeOptions': {
      args: [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features',
        '--disable-blink-features=AutomationControlled',
        '--incognito',
      ],
    },
  }),
};

const createHtmlReport = !process.env.NHR;

const browserstackConfig = {};

if (process.env.BROWSER != null && process.env.BROWSER.match(/(android|iPhone|iPad|Galaxy Tab|chrome|firefox|safari|MicrosoftEdge|internet explorer)/)) {
  // browserCapabilities[0].browserName = process.env.BROWSER
  browserCapabilities.browserName = process.env.BROWSER;
  browserCapabilities['goog:chromeOptions'] = undefined;

  if (process.env.REMOTE) {
    browserstackConfig.user = process.env.USER;
    browserstackConfig.key = process.env.KEY;
    browserstackConfig.path = '/wd/hub';
    browserstackConfig.browserstackLocal = true;

    if (process.env.BROWSER === 'iPhone') {
      browserCapabilities.browserName = 'iPhone';
      browserCapabilities.device = 'iPhone 8 Plus';
      browserCapabilities.realMobile = 'true';
      browserCapabilities.os_version = '11';
    } else if (process.env.BROWSER === 'android') {
      browserCapabilities.browserName = 'android';
      browserCapabilities.device = 'Google Pixel 4 XL';
      browserCapabilities.realMobile = 'true';
      browserCapabilities.os_version = '10.0';
    } else if (process.env.BROWSER === 'iPad') {
      browserCapabilities.browserName = 'iPhone';
      browserCapabilities.device = 'iPad Pro 12.9 2017';
      browserCapabilities.realMobile = 'true';
      browserCapabilities.os_version = '11';
    } else if (process.env.BROWSER === 'Galaxy Tab') {
      browserCapabilities.browserName = 'android';
      browserCapabilities.device = 'Samsung Galaxy Tab S6';
      browserCapabilities.realMobile = 'true';
      browserCapabilities.os_version = '9.0';
    }
  }

  if (process.env.BROWSER === 'safari') {
    browserCapabilities.maxInstances = 1;
  } else if (process.env.BROWSER === 'chrome') {
    browserCapabilities = chromeDefaultCapabilities;
  }
} else {
  process.env.BROWSER = 'chrome';
  browserCapabilities = chromeDefaultCapabilities;
}

console.log(JSON.stringify(`browserCapabilities: ${JSON.stringify(browserCapabilities)}`));
console.log(JSON.stringify(`browserstackConfig: ${JSON.stringify(browserstackConfig)}`));

exports.config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  //
  attributeHook: 'data-test-id',
  // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
  // on a remote machine).
  runner: 'local',
  //
  // Override default path ('/wd/hub') for chromedriver service.
  path: '/',
  //
  port: parseInt(process.env.PORT, 10) || 4444,
  ...browserstackConfig,
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which `wdio` was called. Notice that, if you are calling `wdio` from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // directory is where your package.json resides, so `wdio` will be called from there.
  //
  specs: [
    './features/**/*.feature',
  ],
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  maxInstances: 10,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  capabilities: [{
    ...browserCapabilities,
    // maxInstances can get overwritten per capability. So if you have an in-house Selenium
    // grid with only 5 firefox instances available you can make sure that not more than
    // 5 instances get started at a time.
    // maxInstances: instances,
    //
    // browserName,
    // If outputDir is provided WebdriverIO can capture driver session logs
    // it is possible to configure which logTypes to include/exclude.
    // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
    // excludeDriverLogs: ['bugreport', 'server'],
  }],
  sync: false,
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel,
  //
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner, @wdio/lambda-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // logLevels: {
  // webdriver: 'info',
  // '@wdio/applitools-service': 'info'
  // },
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl,
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 20000,
  waitforElementTimeout: 4000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  plugins: {
  },
  services: [
    // 'browserstack',
    // 'selenium-standalone',
    ...((process.env.BROWSER == null || (process.env.BROWSER && process.env.BROWSER === 'chrome')) ? ['chromedriver'] : []),
    ...(process.env.BROWSER && process.env.BROWSER === 'firefox' ? ['geckodriver'] : []),
    ...(process.env.BROWSER && process.env.BROWSER === 'safari' ? ['safaridriver'] : []),
    ...(process.env.BROWSER && process.env.BROWSER === 'MicrosoftEdge' ? ['edgedriver'] : []),
  ],
  edgeDriverArgs: ['--port=4444', '--host=localhost'],
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: 'cucumber',
  //
  // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetries: 1,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter.html
  reporters: [
    'spec',
  ],

  // If you are using Cucumber you need to specify the location of your step definitions.
  cucumberOpts: {
    require: ['./features/step-definitions/**.js'], // <string[]> (file/dir) require files before executing features
    backtrace: false, // <boolean> show full backtrace for errors
    requireModule: [], // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
    dryRun: false, // <boolean> invoke formatters without executing steps
    failFast: false, // <boolean> abort the run on first failure
    format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
    colors: true, // <boolean> disable colors in formatter output
    snippets: true, // <boolean> hide step definition snippets for pending steps
    source: true, // <boolean> hide source uris
    profile: [], // <string[]> (name) specify the profile to use
    strict: false, // <boolean> fail if there are any undefined or pending steps
    tagExpression: '', // <string> (expression) only execute the features or scenarios with tags matching the expression
    timeout: 900000, // <number> timeout for step definitions
    ignoreUndefinedDefinitions: false, // <boolean> Enable this config to treat undefined definitions as warnings.
  },

  //
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  /**
  * Gets executed once before all workers get launched.
  * @param {Object} config wdio configuration object
  * @param {Array.<Object>} capabilities list of capabilities details
  */
  onPrepare(config, capabilities) {
    console.log('>> onPrepare');
  },
  /**
  * Gets executed just before initialising the webdriver session and test framework. It allows you
  * to manipulate configurations depending on the capability or spec.
  * @param {Object} config wdio configuration object
  * @param {Array.<Object>} capabilities list of capabilities details
  * @param {Array.<String>} specs List of spec file paths that are to be run
  */
  async beforeSession(config, capabilities, specs) {
    console.log('>> beforeSession');
  },
  /**
  * Gets executed before test execution begins. At this point you can access to all global
  * variables like `browser`. It is the perfect place to define custom commands.
  * @param {Array.<Object>} capabilities list of capabilities details
  * @param {Array.<String>} specs List of spec file paths that are to be run
  */
  async before(capabilities, specs) {
    console.log(`>> before :: session: ${global.browser.sessionId}`);
    // const throttles = ['Regular 2G', 'Regular 3G', 'Regular 4g'];
    // browser.setNetworkConditions({}, throttle );
    global.currentPage = null;
    global.saved = {};

    // TEST_ENV is handled by be-test-data

    global.isMobile = false;
    global.isMobileDevice = false;
    if (browserCapabilities.browserName.match(/(iPhone|android)/)) {
      global.isMobileDevice = true;
    }
    if (['xSmall', 'small'].includes(global.browserSizeName)) {
      global.isMobile = true;
    }

    global.isTablet = false;
    global.isTabletDevice = false;
    if (browserCapabilities.browserName.match(/(iPad|Galaxy Tab)/)) {
      global.isTabletDevice = true;
    }
    if (global.browserSizeName === 'medium') {
      global.isTablet = true;
    }

    if (!process.env.REMOTE) {
      await global.browser.setWindowRect(null, null, browserSize().w, browserSize().h);
    }

    global.browserName = browserCapabilities.browserName;
    global.browserDimensions = `${browserSize().w}x${browserSize().h}`;
  },
  /**
  * Runs before a WebdriverIO command gets executed.
  * @param {String} commandName hook command name
  * @param {Array} args arguments that command would receive
  */
  // beforeCommand: function (commandName, args) {
  // },
  /**
  * Runs before a Cucumber feature
  */
  // async beforeFeature(uri, feature, scenarios) {
  // },
  /**
  * Runs before a Cucumber scenario
  */
  async beforeScenario(uri, feature, scenario, sourceLocation) {
  },
  /**
  * Runs before a Cucumber step
  */
  async beforeStep(uri, feature, stepData, context) {
    // console.log(`\n>> beforeStep :: session: ${global.browser.sessionId} => ${stepData.step.text}\n`);
  },
  /**
  * Runs after a Cucumber step
  */
  async afterStep(uri, feature, {
    error, result, duration, passed,
  }, stepData, context) {

  },
  /**
  * Runs after a Cucumber scenario
  */
  async afterScenario(uri, feature, scenario, result, sourceLocation) {
  },
  /**
  * Runs after a Cucumber feature
  */
  // async afterFeature(uri, feature, scenarios) {

  // },
  /**
  * Runs after a WebdriverIO command gets executed
  * @param {String} commandName hook command name
  * @param {Array} args arguments that command would receive
  * @param {Number} result 0 - command success, 1 - command error
  * @param {Object} error error object if any
  */
  // afterCommand: function (commandName, args, result, error) {
  // },
  /**
  * Gets executed after all tests are done. You still have access to all global variables from
  * the test.
  * @param {Number} result 0 - test pass, 1 - test fail
  * @param {Array.<Object>} capabilities list of capabilities details
  * @param {Array.<String>} specs List of spec file paths that ran
  */
  // after: function (result, capabilities, specs) {
  // },
  /**
  * Gets executed right after terminating the webdriver session.
  * @param {Object} config wdio configuration object
  * @param {Array.<Object>} capabilities list of capabilities details
  * @param {Array.<String>} specs List of spec file paths that ran
  */
  // afterSession: function (config, capabilities, specs) {
  // },
  /**
  * Gets executed after all workers got shut down and the process is about to exit. An error
  * thrown in the onComplete hook will result in the test run failing.
  * @param {Object} exitCode 0 - success, 1 - fail
  * @param {Object} config wdio configuration object
  * @param {Array.<Object>} capabilities list of capabilities details
  * @param {<Object>} results object containing test results
  */
  async onComplete(exitCode, config, capabilities, results) {
  },
  /**
  * Gets executed when a refresh happens.
  * @param {String} oldSessionId session ID of the old session
  * @param {String} newSessionId session ID of the new session
  */
  async onReload(oldSessionId, newSessionId) {
    if (!process.env.REMOTE) {
      await global.browser.setWindowRect(null, null, browserSize().w, browserSize().h);
    }
  },
};