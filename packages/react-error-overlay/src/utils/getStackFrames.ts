/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { StackFrame } from './stack-frame';
import { parse } from './parser.ts';
import { map } from './mapper.ts';
import { unmap } from './unmapper.ts';
import EnhancedError from './enhancedError.ts';

function getStackFrames(
  error: EnhancedError,
  unhandledRejection: boolean = false,
  contextSize: number = 3
): Promise<StackFrame[] | null> {
  const parsedFrames = parse(error);
  let enhancedFramesPromise: Promise<StackFrame[]>;
  if (error.__unmap_source) {
    enhancedFramesPromise = unmap(
      error.__unmap_source,
      parsedFrames,
      contextSize
    );
  } else {
    enhancedFramesPromise = map(parsedFrames, contextSize);
  }
  return enhancedFramesPromise.then((enhancedFrames: StackFrame[]) => {
    if (
      enhancedFrames
        .map(f => f._originalFileName)
        .filter(f => f != null && f.indexOf('node_modules') === -1).length === 0
    ) {
      return null;
    }
    return enhancedFrames.filter(
      ({ functionName }) =>
        functionName == null ||
        functionName.indexOf('__stack_frame_overlay_proxy_console__') === -1
    );
  });
}

export default getStackFrames;
export { getStackFrames };
