import * as React from 'react';
import { CAPTION, LANG } from '../constants/Caption';
import './LoadingSpinner.scss';

interface LoadingSpinnerProps {}

const LoadingSpinner: React.SFC<LoadingSpinnerProps> = (props: LoadingSpinnerProps) => (
  <div id="pageMask">
    <div className="student_screen">
      <strong className="img_loading"></strong>
      <strong className="text_loading" style={{ fontSize: '30px' }}>
        {CAPTION[LANG].LOADING}
      </strong>
    </div>
  </div>
);

export default LoadingSpinner;
