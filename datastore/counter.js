const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');


// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

var readCount = Promise.promisify(readCounter);

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

var writeCount = Promise.promisify(writeCounter);

// Public API - Fix this function //////////////////////////////////////////////

/*
doSomething()
  .then(function (result) {
    return doSomethingElse(result);
  })
  .then(function (newResult) {
    return doThirdThing(newResult);
  })
  .then(function (finalResult) {
    console.log(`Got the final result: ${finalResult}`);
  })
  .catch(failureCallback);
*/

exports.getNextUniqueId = (callback) => {
  readCount()
    .then((result) => {
      result++;
      return writeCount(result);
    })
    .then((result) => {
      callback(null, result);
    })
    .catch((err) => {
      callback('error writing counter', null);
    });

  // readCounter((err, counter) => {
  //   if (err) {
  //     callback('error reading counter', null);
  //   } else {
  //     counter++;
  //     writeCounter(counter, (err, result) => {
  //       if (err) {
  //         callback('error writing counter', null);
  //       } else {
  //         callback(null, result);
  //       }
  //     });
  //   }
  // });
};


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
