const { Given, When, Then } = require('@cucumber/cucumber');
const Steps = require('./steps')

const stepToFunctionName = (action1, action2 = '') => {
  const mapping = {
    // single parameter
    'click on': 'iClickOn',
    'should see': 'iShouldSee',
    'should not see': 'iShouldNotSee',

    // dual parameter
    'type into': 'iTypeInto',
  };

  const functionName = mapping[`${action1} ${action2}`.trim()];
  if (!functionName) {
    if (action2) {
      throw new Error(`The step "I ${action1}" <element> doesn't exist`);
    } else {
      throw new Error(`The step "I ${action1} <input> ${action2} <element>" doesn't exist`);
    }
  }
  return functionName;
};

Given(/^I reset the session$/, async () => {
  await global.browser.reloadSession();
});

Given(/^I go to the ([a-zA-Z0-9]+Page)$/, async (pageName) => {
  await Steps.iGoToPage(pageName);
});

When(/^I (click on|should see|should not see) (a|an|the) (.*?)$/, async (action, _article, elementName) => {
  await Steps[stepToFunctionName(action)]({ elementName });
});

When(/^I (type) "(.*?)" (into) (a|an|the) (.*?)$/, async (action1, input, action2, _article, elementName) => {
  await Steps[stepToFunctionName(action1, action2)]({ elementName, input });
});