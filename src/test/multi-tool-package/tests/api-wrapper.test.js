const { submitAnswer } = require('../src/api-wrapper');

describe('Test the /ECSD-QA-tech-test endpoint', () => {
  test.each`
   desc                                                      | body                                                     | headers                                    | expStatus | expResp      | method     
   ${'correct answers'}                                      | ${({'answer-1': '4', 'answer-2': '3', 'answer-3': '5'})} | ${({ 'content-type': 'application/json'})} | ${200}    | ${'success'} | ${'POST'}  
   ${'correct answers - but as integers instead of strings'} | ${({'answer-1': 4, 'answer-2': 3, 'answer-3': 5})}       | ${({ 'content-type': 'application/json'})} | ${200}    | ${'failure'} | ${'POST'}  
   ${'incorrect answers'}                                    | ${({'answer-1': 1, 'answer-2': 3, 'answer-3': 5})}       | ${({ 'content-type': 'application/json'})} | ${200}    | ${'failure'} | ${'POST'}  
   ${'correct answers - using PATCH'}                        | ${({'answer-1': '4', 'answer-2': '3', 'answer-3': '5'})} | ${({ 'content-type': 'application/json'})} | ${403}    | ${undefined} | ${'PATCH'} 
   ${'correct anwers - using PUT'}                           | ${({'answer-1': '4', 'answer-2': '3', 'answer-3': '5'})} | ${({ 'content-type': 'application/json'})} | ${403}    | ${undefined} | ${'PUT'}   
   ${'using GET'}                                            | ${null}                                                  | ${({ 'content-type': 'application/json'})} | ${403}    | ${undefined} | ${'PUT'}   
   ${'correct anwers - using text/html'}                     | ${null}                                                  | ${({ 'content-type': 'text/html' })}       | ${200}    | ${'failure'} | ${'POST'}  
  `('$desc', async ({ body, headers, expStatus, expResp, method }) => {
    const res = await submitAnswer({
      method,
      body,
      headers,
      isRaw: true
    });

    expect(res.statusCode).toEqual(expStatus);
    expect(res.body.body).toEqual(expResp);
  })
});