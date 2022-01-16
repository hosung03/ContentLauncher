import * as React from 'react';
import Date from '../../utils/Date';
import { CAPTION, LANG } from '../../constants/Caption';

export interface IClassListHeader {
  teacherDisplayName: string;
  totalClassCnt: number;
  ui: string;
}

const ClassListHeader: React.SFC<IClassListHeader> = ({ teacherDisplayName, totalClassCnt, ui }: IClassListHeader) => (
  <dl className="classinfo">
    <dt>
      <img src={ui === 'textbook' ? 'images/img_logo_sub_tb.png' : 'images/img_logo_sub.png'} width={ui === 'textbook' ? '200' : '110'} />
      <Date />
    </dt>
    <dd className="choice">
      <strong>{teacherDisplayName}</strong>
      <p>
        {CAPTION[LANG].MY_CLASS}
        <span className="tCnt">
          <b>
            {CAPTION[LANG].MY_CLASS_TOTAL}&nbsp;&nbsp;{totalClassCnt}
          </b>
        </span>
      </p>
    </dd>
  </dl>
);

export default ClassListHeader;
