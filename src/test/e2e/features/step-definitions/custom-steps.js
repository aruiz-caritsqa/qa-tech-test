const { When } = require('@cucumber/cucumber');
const Steps = require('./steps')
const { findBalanceIndex } = require("multi-tool-package");

When(/^I utilise the multi-tool to calculate the answer for each row and populate the text fields$/, async () => {
  // Also able to use the getElements() function on the global.currentPage
  // The global.currentPage is set on the "I go to * page" step
  const numArrayChallengeRows = (await global.currentPage.getElements('//section[@id="challenge"]//table//tr')).length;

  for(let i=1; i<= numArrayChallengeRows; i+=1) {
    const array = await global.currentPage.challengeRowAsArray(i);
    console.log(array)
    const res = findBalanceIndex(array);
    await Steps.iTypeInto({ elementName: `submit-${i}`, input: res })
  }
});