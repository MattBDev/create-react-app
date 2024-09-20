/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const browserslist = require('browserslist');
const pico = require('picocolors');
const os = require('os');
const prompts = require('prompts');
const pkgUp = require('pkg-up');
const fs = require('fs');

const defaultBrowsers = {
  production: ['>0.2%', 'not dead', 'not op_mini all'],
  development: [
    'last 1 chrome version',
    'last 1 firefox version',
    'last 1 safari version',
  ],
};

/**
 * @param {boolean} isInteractive
 * @returns {Promise<boolean>}
 */
async function shouldSetBrowsers(isInteractive) {
  if (!isInteractive) {
    return Promise.resolve(true);
  }

  const question = {
    type: 'confirm',
    name: 'shouldSetBrowsers',
    message:
      pico.yellow("We're unable to detect target browsers.") +
      `\n\nWould you like to add the defaults to your ${pico.bold(
        'package.json',
      )}?`,
    initial: true,
  };

  return prompts(question).then(answer => answer.shouldSetBrowsers);
}

function checkBrowsers(dir, isInteractive, retry = true) {
  const current = browserslist.loadConfig({ path: dir });
  if (current != null) {
    return Promise.resolve(current);
  }

  if (!retry) {
    return Promise.reject(
      new Error(
        pico.red(
          'As of react-scripts >=2 you must specify targeted browsers.',
        ) +
          os.EOL +
          `Please add a ${pico.underline(
            'browserslist',
          )} key to your ${pico.bold('package.json')}.`,
      ),
    );
  }

  return shouldSetBrowsers(isInteractive).then(shouldSetBrowsers => {
    if (!shouldSetBrowsers) {
      return checkBrowsers(dir, isInteractive, false);
    }

    return (
      pkgUp({ cwd: dir })
        .then(async filePath => {
          if (filePath == null) {
            return Promise.reject();
          }
          const pkg = await Bun.file(filePath).json();
          pkg['browserslist'] = defaultBrowsers;
          fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + os.EOL);

          browserslist.clearCaches();
          console.log();
          console.log(
            `${pico.green('Set target browsers:')} ${pico.cyan(
              defaultBrowsers.join(', '),
            )}`,
          );
          console.log();
        })
        // Swallow any error
        .catch(() => {})
        .then(() => checkBrowsers(dir, isInteractive, false))
    );
  });
}

module.exports = { defaultBrowsers, checkBrowsers };
