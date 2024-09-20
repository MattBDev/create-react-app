/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import React, { useContext } from 'react';
import { ThemeContext } from '../iframeScript';
import ErrorOverlay from '../components/ErrorOverlay.tsx';
import Footer from '../components/Footer.tsx';
import Header from '../components/Header.tsx';
import CodeBlock from '../components/CodeBlock.tsx';
import generateAnsiHTML from '../utils/generateAnsiHTML.ts';
import parseCompileError from '../utils/parseCompileError.ts';
import type { ErrorLocation } from '../utils/parseCompileError.ts';

const codeAnchorStyle = {
  cursor: 'pointer',
};

type CompileErrorContainerPropsType = {
  error: string,
  editorHandler: (errorLoc: ErrorLocation) => void,
};

function CompileErrorContainer(props: CompileErrorContainerPropsType) {
  const theme = useContext<ThemeContext>(ThemeContext);
  const { error, editorHandler } = props;
  const errLoc: ErrorLocation | null = parseCompileError(error);
  const canOpenInEditor = errLoc !== null && editorHandler !== null;
  return (
    <ErrorOverlay>
      <Header headerText="Failed to compile" />
      <div
        onClick={canOpenInEditor && errLoc ? () => editorHandler(errLoc) : null}
        style={canOpenInEditor ? codeAnchorStyle : null}
      >
        <CodeBlock main={true} codeHTML={generateAnsiHTML(error, theme)} />
      </div>
      <Footer line1="This error occurred during the build time and cannot be dismissed." />
    </ErrorOverlay>
  );
}

export default CompileErrorContainer;
