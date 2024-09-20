/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useContext, ReactElement, CSSProperties } from 'react';
import { ThemeContext } from '../iframeScript';

import type { Theme } from '../styles.ts';

const _collapsibleStyle: CSSProperties = {
  cursor: 'pointer',
  border: 'none',
  display: 'block',
  width: '100%',
  textAlign: 'left',
  fontFamily: 'Consolas, Menlo, monospace',
  fontSize: '1em',
  padding: '0px',
  lineHeight: '1.5',
};

const collapsibleCollapsedStyle = (theme: Theme) => ({
  ..._collapsibleStyle,
  color: theme.color,
  background: theme.background,
  marginBottom: '1.5em',
});

const collapsibleExpandedStyle = (theme: Theme) => ({
  ..._collapsibleStyle,
  color: theme.color,
  background: theme.background,
  marginBottom: '0.6em',
});

type CollapsiblePropsType = {
  children: ReactElement | ReactElement[];
};

function Collapsible(props: CollapsiblePropsType) {
  const theme = useContext<ThemeContext>(ThemeContext);
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const count = Array.isArray(props.children) ? props.children.length : 1;
  return (
    <div>
      <button
        onClick={toggleCollapsed}
        style={
          collapsed
            ? collapsibleCollapsedStyle(theme)
            : collapsibleExpandedStyle(theme)
        }
      >
        {(collapsed ? '▶' : '▼') +
          ` ${count} stack frames were ` +
          (collapsed ? 'collapsed.' : 'expanded.')}
      </button>
      <div style={{ display: collapsed ? 'none' : 'block' }}>
        {props.children}
        <button
          onClick={toggleCollapsed}
          style={collapsibleExpandedStyle(theme)}
        >
          {`▲ ${count} stack frames were expanded.`}
        </button>
      </div>
    </div>
  );
}

export default Collapsible;