const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    //console.log('dataDir:', + exports.dataDir, ' path:' + '/' + id + '.txt');
    fs.appendFile(exports.dataDir + '/' + id + '.txt',
    text,
    () => callback(null, { id, text }));
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, data) => {
    var data = data.map((text) => ({id: text.slice(0,5), text: text.slice(0,5)}));
    callback(null, data);
  })
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, content) => {
    if (err) {
      callback(err, '');
      //throw('error, no data found');
    } else {
      callback(null, {id: id, text: content.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
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

exports.delete = (id, callback) => {
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

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
