/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import React, { useContext } from 'react';
import { ThemeContext } from '../iframeScript';
import CodeBlock from '../components/CodeBlock.tsx';
import { absolutifyCaret } from '../utils/dom/absolutifyCaret.ts';
import type { ScriptLine } from '../utils/stack-frame';
import generateAnsiHTML from '../utils/generateAnsiHTML.ts';

import { codeFrameColumns } from '@babel/code-frame';

type StackFrameCodeBlockPropsType = {
  lines: ScriptLine[],
  lineNum: number,
  columnNum?: number,
  contextSize: number,
  main: boolean,
};

function StackFrameCodeBlock(props: StackFrameCodeBlockPropsType) {
  const theme = useContext<ThemeContext>(ThemeContext);
  const { lines, lineNum, columnNum, contextSize, main } = props;
  const sourceCode: string[] = [];
  let whiteSpace = Infinity;
  lines.forEach(function (e) {
    const { content: text } = e;
    const m = text.match(/^\s*/);
    if (text === '') {
      return;
    }
    if (m && m[0]) {
      whiteSpace = Math.min(whiteSpace, m[0].length);
    } else {
      whiteSpace = 0;
    }
  });
  lines.forEach(function (e) {
    let { content: text } = e;
    const { lineNumber: line } = e;

    if (isFinite(whiteSpace)) {
      text = text.substring(whiteSpace);
    }
    sourceCode[line - 1] = text;
  });
  const ansiHighlight = codeFrameColumns(
    sourceCode.join('\n'),
    {
      start: {
        line: lineNum,
        column:
          columnNum == null
            ? 0
            : columnNum - (isFinite(whiteSpace) ? whiteSpace : 0),
      },
    },
    {
      forceColor: true,
      linesAbove: contextSize,
      linesBelow: contextSize,
    },
  );
  const htmlHighlight = generateAnsiHTML(ansiHighlight, theme);
  const code = document.createElement('code');
  code.innerHTML = htmlHighlight;
  absolutifyCaret(code);

  const ccn = code.childNodes;
  oLoop: for (let index = 0; index < ccn.length; ++index) {
    const node = ccn[index] as HTMLElement;
    const ccn2 = node.childNodes;
    for (let index2 = 0; index2 < ccn2.length; ++index2) {
      const lineNode = ccn2[index2] as HTMLElement;
      const text = lineNode.innerText;
      if (text == null) {
        continue;
      }
      if (text.indexOf(' ' + lineNum + ' |') === -1) {
        continue;
      }
      break oLoop;
    }
  }

  return <CodeBlock main={main} codeHTML={code.innerHTML} />;
}

export default StackFrameCodeBlock;