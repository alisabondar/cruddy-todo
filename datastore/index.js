const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

var create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    //console.log('dataDir:', + exports.dataDir, ' path:' + '/' + id + '.txt');
    //console.log('id, text', id, ':', text);
    fs.appendFile(exports.dataDir + '/' + id + '.txt',
    text,
    () => callback(null, { id, text }));
  });
};

var readAll = (callback) => {
  fsPromises.readdir(exports.dataDir)
    .then((filenames) => {
      Promise.all(filenames.map((filename) => exports.readOne(filename.slice(0, 5))))
      .then((result) => {
        console.log('result', result);
        callback(null, result);
      })
      .catch((err) => {
        console.log('err:' + err);
        callback(null, '');
      });
    })
    .catch((err) => {
      callback(null, '');
    });
};

var readOne = (id, callback) => {
 // console.log('read:id', id);
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, content) => {
    if (err) {
      callback(err, '');
    } else {
      callback(null, {id: id.slice(0, 5), text: content.toString()});
    }
  });
};

var update = (id, text, callback) => {
  exports.readOne(id, (err, data) => {
    if (err) {
      callback(err, '');
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err, content) => {
        if (err) {
          callback(err, '');
        } else {
          callback(null);
        }
      });
    }
  })
};

var deleteOne = (id, callback) => {
  exports.readOne(id, (err, data) => {
    if (err) {
      callback(err, '');
    } else {
      fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
        if (err) {
          callback(err, '');
        } else {
          callback(null);
        }
      });
    }
  })
};

exports.create = Promise.promisify(create);
exports.readAll = Promise.promisify(readAll);
exports.readOne = Promise.promisify(readOne);
exports.update = Promise.promisify(update);
exports.delete = Promise.promisify(deleteOne);

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
