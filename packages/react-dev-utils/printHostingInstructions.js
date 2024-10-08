/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const pico = require('picocolors');
const url = require('url');
const globalModules = require('global-modules');

function printHostingInstructions(
  appPackage,
  publicUrl,
  publicPath,
  buildFolder,
  useYarn,
) {
  if (publicUrl?.includes('.github.io/')) {
    // "homepage": "http://user.github.io/project"
    const publicPathname = url.parse(publicPath).pathname;
    const hasDeployScript =
      typeof appPackage.scripts !== 'undefined' &&
      typeof appPackage.scripts.deploy !== 'undefined';
    printBaseMessage(buildFolder, publicPathname);

    printDeployInstructions(publicUrl, hasDeployScript, useYarn);
  } else if (publicPath !== '/') {
    // "homepage": "http://mywebsite.com/project"
    printBaseMessage(buildFolder, publicPath);
  } else {
    // "homepage": "http://mywebsite.com"
    //   or no homepage
    printBaseMessage(buildFolder, publicUrl);

    printStaticServerInstructions(buildFolder, useYarn);
  }
  console.log();
  console.log('Find out more about deployment here:');
  console.log();
  console.log(`  ${pico.yellow('https://cra.link/deployment')}`);
  console.log();
}

function printBaseMessage(buildFolder, hostingLocation) {
  console.log(
    `The project was built assuming it is hosted at ${pico.green(
      hostingLocation || 'the server root',
    )}.`,
  );
  console.log(
    `You can control this with the ${pico.green(
      'homepage',
    )} field in your ${pico.cyan('package.json')}.`,
  );

  if (!hostingLocation) {
    console.log('For example, add this to build it for GitHub Pages:');
    console.log();

    console.log(
      `  ${pico.green('"homepage"')} ${pico.cyan(':')} ${pico.green(
        '"http://myname.github.io/myapp"',
      )}${pico.cyan(',')}`,
    );
  }
  console.log();
  console.log(`The ${pico.cyan(buildFolder)} folder is ready to be deployed.`);
}

function printDeployInstructions(publicUrl, hasDeployScript, useYarn) {
  console.log(`To publish it at ${pico.green(publicUrl)} , run:`);
  console.log();

  // If script deploy has been added to package.json, skip the instructions
  if (!hasDeployScript) {
    if (useYarn) {
      console.log(`  ${pico.cyan('yarn')} add --dev gh-pages`);
    } else {
      console.log(`  ${pico.cyan('npm')} install --save-dev gh-pages`);
    }
    console.log();

    console.log(
      `Add the following script in your ${pico.cyan('package.json')}.`,
    );
    console.log();

    console.log(`    ${pico.dim('// ...')}`);
    console.log(`    ${pico.yellow('"scripts"')}: {`);
    console.log(`      ${pico.dim('// ...')}`);
    console.log(
      `      ${pico.yellow('"predeploy"')}: ${pico.yellow(
        `"${useYarn ? 'yarn' : 'npm run'} build",`,
      )}`,
    );
    console.log(
      `      ${pico.yellow('"deploy"')}: ${pico.yellow('"gh-pages -d build"')}`,
    );
    console.log('    }');
    console.log();

    console.log('Then run:');
    console.log();
  }
  console.log(`  ${pico.cyan(useYarn ? 'yarn' : 'npm')} run deploy`);
}

function printStaticServerInstructions(buildFolder, useYarn) {
  console.log('You may serve it with a static server:');
  console.log();
  Bun.file(`${globalModules}/serve`).exists().then(exists => {
    if (!exists) {
      if (useYarn) {
        console.log(`  ${pico.cyan('yarn')} global add serve`);
      } else {
        console.log(`  ${pico.cyan('npm')} install -g serve`);
      }
    }
    console.log(`  ${pico.cyan('serve')} -s ${buildFolder}`);
  });
}

module.exports = printHostingInstructions;
