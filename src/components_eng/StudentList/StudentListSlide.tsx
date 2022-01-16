import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import { STUDENT_LIST_DISPALY_CNT_PER_PAGE } from '../../constants/index';
import { MemberDataType, DisplayMode, AccountState } from '../../types';
import StudentListSlideItem from './StudentListSlideItem';

export interface IStudentListSlide {
  curPageCnt: number;
  totalPageCnt: number;
  allStudents: MemberDataType[];
  studentStates: AccountState[];
  displayMode: DisplayMode;
}

@observer
export default class StudentListSlide extends React.Component<IStudentListSlide> {
  render() {
    const { curPageCnt, totalPageCnt, allStudents, studentStates, displayMode } = this.props;
    let slideItemCnt = STUDENT_LIST_DISPALY_CNT_PER_PAGE;
    const curPageIdx = curPageCnt - 1;

    // 남은 갯수 계산
    if (curPageCnt === totalPageCnt) {
      slideItemCnt = allStudents.length - STUDENT_LIST_DISPALY_CNT_PER_PAGE * curPageIdx;
    }

    const startIdx = curPageIdx * STUDENT_LIST_DISPALY_CNT_PER_PAGE;
    return (
      <ul className="attendance_list swiper-slide">
        {Array(slideItemCnt)
          .fill(null)
          .map((_, i) => {
            return <StudentListSlideItem 
                      key={Math.random()} 
                      curStudent={allStudents[startIdx + i]} 
                      cusStudentState={studentStates[startIdx + i]}
                      displayMode={displayMode} 
                    />;
          })}
      </ul>
    );
  }
}
