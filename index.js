const ml = require('ml-regression');
const csv = require('csvtojson');
const SLR = ml.SLR; // Simple Linear Regression
const readline = require('readline'); // For user prompt to allow predictions

const csvFilePath = 'Advertising.csv'; // Data
let csvData = [], // parsed Data
  X = [], // Input
  y = []; // Output

let regressionModel;

csv()
  .fromFile(csvFilePath)
  .on('json', (jsonObj) => {
    csvData.push(jsonObj);
  })
  .on('done', () => {
    dressData(); // To get data points from JSON Objects
    performRegression();
  });

const parse = (s) => parseFloat(s);

const dressData = () => {
  /**
   * One row of the data object looks like:
   * {
   *   TV: "10",
   *   Radio: "100",
   *   Newspaper: "20",
   *   Sales: "1000"
   * }
   *
   * Hence, while adding the data points,
   * we need to parse the String value as a Float.
   */
  csvData.forEach((row) => {
    X.push(parse(row.Radio));
    y.push(parse(row.Sales));
  });
}

const performRegression = () => {
  regressionModel = new SLR(X, y); // Train the model on training data
  console.log(regressionModel.toString(3));
  predictOutput();
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const predictOutput = () => {
  rl.question('Enter input X for prediction (Press CTRL+C to exit) : ', (answer) => {
    console.log(`At X = ${answer}, y =  ${regressionModel.predict(parseFloat(answer))}`);
    predictOutput();
  });
}
