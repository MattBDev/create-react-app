/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { PureComponent } from 'react';
import ErrorOverlay from '../components/ErrorOverlay.tsx';
import CloseButton from '../components/CloseButton.tsx';
import NavigationBar from '../components/NavigationBar.tsx';
import RuntimeError from './RuntimeError.tsx';
import Footer from '../components/Footer.tsx';

import type { ErrorRecord } from './RuntimeError.tsx';
import type { ErrorLocation } from '../utils/parseCompileError.ts';

type Props = {
  errorRecords: ErrorRecord[],
  close: () => void,
  editorHandler: (errorLoc: ErrorLocation) => void,
};

type State = {
  currentIndex: number,
};

class RuntimeErrorContainer extends PureComponent<Props, State> {
  state = {
    currentIndex: 0,
  };

  previous = () => {
    this.setState((state, props) => ({
      currentIndex:
        state.currentIndex > 0
          ? state.currentIndex - 1
          : props.errorRecords.length - 1,
    }));
  };

  next = () => {
    this.setState((state, props) => ({
      currentIndex:
        state.currentIndex < props.errorRecords.length - 1
          ? state.currentIndex + 1
          : 0,
    }));
  };

  shortcutHandler = (key: string) => {
    if (key === 'Escape') {
      this.props.close();
    } else if (key === 'ArrowLeft') {
      this.previous();
    } else if (key === 'ArrowRight') {
      this.next();
    }
  };

  render() {
    const { errorRecords, close } = this.props;
    const totalErrors = errorRecords.length;
    return (
      <ErrorOverlay shortcutHandler={this.shortcutHandler}>
        <CloseButton close={close} />
        {totalErrors > 1 && (
          <NavigationBar
            currentError={this.state.currentIndex + 1}
            totalErrors={totalErrors}
            previous={this.previous}
            next={this.next}
          />
        )}
        <RuntimeError
          errorRecord={errorRecords[this.state.currentIndex]}
          editorHandler={this.props.editorHandler}
        />
        <Footer
          line1="This screen is visible only in development. It will not appear if the app crashes in production."
          line2="Open your browser’s developer console to further inspect this error.  Click the 'X' or hit ESC to dismiss this message."
        />
      </ErrorOverlay>
    );
  }
}

export default RuntimeErrorContainer;
