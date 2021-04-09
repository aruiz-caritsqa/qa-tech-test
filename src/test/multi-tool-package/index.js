const findBalanceIndex = (inputArray) => {
  const subTotalAtIndex = [];
  let subTotal = 0; 

  // first pass get the sub total at each index
  for(let i=0; i<inputArray.length; i+=1) {
    if (typeof inputArray[i] !== 'number' || isNaN(inputArray[i])) {
      throw new Error(`'${inputArray[i]}' at index ${i} is not a number - which invalidates this array`);
    }
    subTotal += inputArray[i];
    subTotalAtIndex[i] = subTotal;
  }

  // on the second pass, go backwards and see if the same total exists
  subTotal = 0;
  for (let i=inputArray.length-1; i>=0; i-=1) {
    subTotal += inputArray[i];

    if (subTotalAtIndex[i] && subTotalAtIndex[i] === subTotal) {
      return i;
    }
  }

  // no index
  return null;
};

module.exports = {
  findBalanceIndex,
};
