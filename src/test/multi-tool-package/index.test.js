const { findBalanceIndex } = require('./index');

describe('Test findBalanceIndex', () => {
  test.each`
    inputArray                               | expIndex
    ${[10, 15, 5, 7, 1, 24, 36, 2]}          | ${5}    
    ${[1, 1, 1]}                             | ${1}    
    ${[1, 1, 1, 1]}                          | ${null}    
    ${[1, 1, 1, 1, -1]}                      | ${1}    
    ${[1, 1]}                                | ${null}    
    ${[23, 50, 63, 90, 10, 30, 155, 23, 18]} | ${4}
  `('Should return index of $expIndex for array $inputArray', ({inputArray, expIndex}) => {
    const res = findBalanceIndex(inputArray);
    expect(res).toEqual(expIndex);
  });

  test.each`
    inputArray         | expError
    ${[1, '1', 1]}     | ${"'1' at index 1 is not a number - which invalidates this array"}       
    ${[1, 1, 'hello']} | ${"'hello' at index 2 is not a number - which invalidates this array"}
  `('Should throw an error for $inputArray', ({inputArray, expError}) => {
    expect(() => findBalanceIndex(inputArray)).toThrow(expError)
  });
});