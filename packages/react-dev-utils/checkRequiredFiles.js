/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const pico = require('picocolors');

function checkRequiredFiles(files) {
  var currentFilePath;
  try {
    files.forEach(filePath => {
      currentFilePath = filePath;
      fs.accessSync(filePath, fs.constants.F_OK);
      var dirName = path.dirname(currentFilePath);
      var fileName = path.basename(currentFilePath);
      console.log(pico.red('Found a required file.'));
      console.log(pico.red('  Name: ') + pico.cyan(fileName));
      console.log(pico.red('  Searched in: ') + pico.cyan(dirName));

    });
    return true;
  } catch (err) {
    var dirName = path.dirname(currentFilePath);
    var fileName = path.basename(currentFilePath);
    console.log(pico.red('Could not find a required file.'));
    console.log(pico.red('  Name: ') + pico.cyan(fileName));
    console.log(pico.red('  Searched in: ') + pico.cyan(dirName));
    return false;
  }
}

module.exports = checkRequiredFiles;
