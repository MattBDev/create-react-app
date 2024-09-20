/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment jsdom
 */

import { expect, test } from "bun:test";

import { getSourceMap } from '../utils/getSourceMap';
import { resolve } from 'path';

test('finds an external source map', async () => {
  const file = await Bun.file(resolve(__dirname, '../../fixtures/bundle.mjs')).text();
  fetch.mockResponseOnce(
    await Bun.file(resolve(__dirname, '../../fixtures/bundle.mjs.map')).text()
  );

  const sm = await getSourceMap('/', file);
  expect(sm.getOriginalPosition(26122, 21)).toEqual({
    line: 7,
    column: 0,
    source: 'webpack:///packages/react-scripts/template/src/App.js',
  });
});

test('find an inline source map', async () => {
  const sourceName = 'test.js';

  const file = await Bun.file(resolve(__dirname, '../../fixtures/inline.mjs')).text();
  const fileO = await Bun.file(resolve(__dirname, '../../fixtures/inline.es6.mjs')).text();

  const sm = await getSourceMap('/', file);
  expect(sm.getSources()).toEqual([sourceName]);
  expect(sm.getSource(sourceName)).toBe(fileO);
  expect(sm.getGeneratedPosition(sourceName, 5, 10)).toEqual({
    line: 10,
    column: 8,
  });
});

test('error on a source map with unsupported encoding', async () => {
  expect.assertions(2);

  const file = await Bun.file(resolve(__dirname, '../../fixtures/junk-inline.mjs')).text();
  let error;
  try {
    await getSourceMap('/', file);
  } catch (e) {
    error = e;
  }
  expect(error instanceof Error).toBe(true);
  expect(error.message).toBe(
    'Sorry, non-base64 inline source-map encoding is not supported.'
  );
});
