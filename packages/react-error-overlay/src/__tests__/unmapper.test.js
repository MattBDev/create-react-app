/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { expect, test } from "bun:test";

import { unmap } from '../utils/unmapper';
import { parse } from '../utils/parser';
import fs from 'fs';
import { resolve } from 'path';

test('basic warning', async () => {
  expect.assertions(2);
  const error = `Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of \`B\`. See https://fb.me/react-warning-keys for more information.
    in div (at B.js:8)
    in B (at A.js:6)
    in A (at App.js:8)
    in div (at App.js:10)
    in App (at index.js:6)`;

  fetch.mockResponseOnce(
    await Bun.file(resolve(__dirname, '../../fixtures/bundle_u.mjs')).text()
  );
  fetch.mockResponseOnce(
    await Bun.file(resolve(__dirname, '../../fixtures/bundle_u.mjs.map')).text()
  );
  const frames = await unmap('/static/js/bundle.js', parse(error), 0);

  const expected = await Bun.file(resolve(__dirname, '../../fixtures/bundle2.json')).json();
  expect(frames).toEqual(expected);

  fetch.mockResponseOnce(
    await Bun.file(resolve(__dirname, '../../fixtures/bundle_u.mjs')).text()
  );
  fetch.mockResponseOnce(
    await Bun.file(resolve(__dirname, '../../fixtures/bundle_u.mjs.map')).text()
  );
  expect(await unmap('/static/js/bundle.js', expected)).toEqual(expected);
});


test('default context & unfound source', async () => {
  expect.assertions(1);
  const error = `Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of \`B\`. See https://fb.me/react-warning-keys for more information.
    in div (at B.js:8)
    in unknown (at blabla.js:10)`;

  fetch.mockResponseOnce(await Bun.file(resolve(__dirname, '../../fixtures/bundle_u.mjs'))
    .text()
  );
  fetch.mockResponseOnce(
    await Bun.file(resolve(__dirname, '../../fixtures/bundle_u.mjs.map'))
      .text()
  );
  const frames = await unmap('/static/js/bundle.js', parse(error));
  expect(frames).toMatchSnapshot();
});
