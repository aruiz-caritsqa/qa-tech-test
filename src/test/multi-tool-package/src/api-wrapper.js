const needle = require('needle');

const submitAnswer = async ({
  method = 'POST',
  body,
  headers = {
    'content-type': 'application/json'
  },
  isRaw = false,
} = {}) => {
  const res = await needle(
    method,
    `${global.testUrl}/ECSD-QA-tech-test`,
    body,
    {
      headers
    }
  );

  if (isRaw) {
    return res;
  }

  if (res.statusCode !== 200) {
    throw new Error(`submitAnswer :: received ${res.statusCode} response instead of 200 => ${JSON.stringify(res.data)}`);
  }
  return res.body;
};

module.exports = {
  submitAnswer
}