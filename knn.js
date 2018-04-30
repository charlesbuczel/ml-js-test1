const KNN = require('ml-knn');
const csv = require('csvtojson');
const prompt = require('prompt');

let knn;

const irisData = 'iris.csv';
const names = ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'type'];

let separationSize,
  data = [],
  x = [],
  y = [],
  trainingSetX = [],
  trainingSetY = [],
  testSetX = [],
  testSetY = [];

const error = (predicted, expected) => {
  let misclassifications = 0;
  for (var index = 0; index < predicted.length; index++) {
    if (predicted[index] !== expected[index]) {
      misclassifications++;
    }
  }
  return misclassifications;
};

const predict = () => {
  let temp = [];
  prompt.start();

  prompt.get(['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'], function(err, result) {
    if (!err) {
      for (var key in result) {
        temp.push(parseFloat(result[key]));
      }
      console.log(`With ${temp} -- type =  ${knn.predict(temp)}`);
    }
  });
}

const test = () => {
  const result = knn.predict(testSetX);
  const testSetLength = testSetX.length;
  const predictionError = error(result, testSetY);
  console.log(`Test Set Size = ${testSetLength} and number of Misclassifications = ${predictionError}`);
  predict();
};

const train = () => {
  knn = new KNN(trainingSetX, trainingSetY, {
    k: 7
  });
  test();
};

const dressData = () => {

  /**
   * There are three different types of Iris flowers
   * that this dataset classifies.
   *
   * 1. Iris Setosa (Iris-setosa)
   * 2. Iris Versicolor (Iris-versicolor)
   * 3. Iris Virginica (Iris-virginica)
   *
   * We are going to change these classes from Strings to numbers.
   * Such that, a value of type equal to
   * 0 would mean setosa,
   * 1 would mean versicolor, and
   * 3 would mean virginica
   */

  let types = new Set(); // To gather UNIQUE classes

  data.forEach((row) => {
    types.add(row.type);
  });

  typesArray = [...types]; // To save the different types of classes.

  data.forEach((row) => {
    let rowArray, typeNumber;

    rowArray = Object.keys(row).map(key => parseFloat(row[key])).slice(0, 4);

    typeNumber = typesArray.indexOf(row.type); // Convert type(String) to type(Number)

    x.push(rowArray);
    y.push(typeNumber);
  });

  trainingSetX = x.slice(0, seperationSize);
  trainingSetY = y.slice(0, seperationSize);
  testSetX = x.slice(seperationSize);
  testSetY = y.slice(seperationSize);

  train();
};

const shuffleArray = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

csv({
    noheader: true,
    headers: names
  })
  .fromFile(irisData)
  .on('json', (jsonObj) => {
    data.push(jsonObj);
  })
  .on('done', () => {
    seperationSize = 0.6 * data.length;
    data = shuffleArray(data);
    dressData();
  });
