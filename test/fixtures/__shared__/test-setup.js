'use strict';
const bunTest = require("bun:test");
const path = require('path');
const fs = require('fs-extra');
const TestSetup = require('./util/setup');

const fixturePath = path.dirname(module.parent.filename);
const fixtureName = path.basename(fixturePath);
const disablePnp = fs.existsSync(path.resolve(fixturePath, '.disable-pnp'));
const testSetup = new TestSetup(fixtureName, fixturePath, {
  pnp: !disablePnp,
});

bunTest.beforeAll(async () => {
  await testSetup.setup();
}, 1000 * 60 * 5);
bunTest.afterAll(async () => {
  await testSetup.teardown();
});

bunTest.beforeEach(() => jest.setTimeout(1000 * 60 * 5));

module.exports = testSetup;
