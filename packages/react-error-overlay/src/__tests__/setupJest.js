/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const lib = global.fetch = require('jest-fetch-mock');
lib.default.enableFetchMocks();