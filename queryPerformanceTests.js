const axios = require('axios');
const url = 'http://127.0.0.1:3000/reviews';
const numberOfProducts = 1000011;

const average = (array) => {
  let sum = array.reduce((memo, ele) => {
    return memo + ele;
  }, 0);
  return sum / array.length;
};

const runQueryTests = async (query) => {
  const timeResults = {
    firstQueries: [],
    subsequentQueryAvgs: [],
    overallAvgs: []
  };
  const productsQueried = new Set();
  const reviewsQueries = Array(100).fill(0).map(ele => {
    let random = Math.ceil(Math.random() * numberOfProducts);
    while (productsQueried.has(random)) {
      random = Math.ceil(Math.random() * numberOfProducts);
    }
    return random;
  });
  for (let item of reviewsQueries) {
    let queryResults = [];
    for (let i = 0; i < 100; i++) {
      let time = Date.now();
      await axios.get(`${url}/${item}/${query}`).then(result => {
        queryResults.push(Date.now() - time);
        return true;
      }).catch(err => {
        console.error(err);
        console.log('Unable to process query - abort test');
      });
    }
    let mean = average(queryResults);
    timeResults.firstQueries.push(queryResults[0]);
    timeResults.subsequentQueryAvgs.push((mean * queryResults.length - queryResults[0]) / (queryResults.length - 1));
    timeResults.overallAvgs.push(mean);
  }
  return timeResults;
};

process.stdin.setEncoding('utf8');

let chunk;

process.stdin.on('readable', async () => {
  while ((chunk = process.stdin.read()) !== null) {
    let testResults = await runQueryTests('meta');

    let firstQueryAvg = average(testResults.firstQueries);
    let subsequentQueryAvg = average(testResults.subsequentQueryAvgs);
    let overallQueryAvg = average(testResults.overallAvgs);

    console.log(`First query average using method ${chunk}: ${firstQueryAvg}`);
    console.log('----------');
    console.log(`Subsequent query average using method ${chunk}: ${subsequentQueryAvg}`);
    console.log('----------');
    console.log(`Overall query average using method ${chunk}: ${overallQueryAvg}`);
    console.log('----------');
    console.log('Test end')
  }
});

