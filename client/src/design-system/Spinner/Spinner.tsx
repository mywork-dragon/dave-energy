import React from 'react';
import classNames from 'classnames';

import './Spinner.less';


export const Spinner = ({
  loading = true,
  ...props
}: any) => (
  <div className={classNames({ loading })} style={{...props}}>
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
);
