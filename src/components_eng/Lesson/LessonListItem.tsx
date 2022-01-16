import * as React from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx';import { CurriculumType } from '../../types';
import * as moment from 'moment';
import { convertUnixTime } from '../../utils/HelperFunc';

export interface ILessonListItem {
  lesson: CurriculumType;
  activeLessonId: number;
  ui: string;
  onClickItem: (lessonid: number) => void;
}

export const getStepLatestStudyDate = (lesson: CurriculumType) => {
  const latestStudyDate = lesson.childrenList
    .map(item => {
      if (!item.book) return undefined;
      if (item.book.updatetime === '') return undefined;
      // if (!item.book.studyResultClass) return undefined;
      return item.book.updatetime;
    })
    .filter(item => typeof item !== undefined)
    .sort((lhs, rhs) => {
      if(!lhs || !rhs) return 0;
      else {
        const lhsDate = moment(lhs, 'YYYY-MM-DD HH:mm:ss');
        const rhsDate = moment(rhs, 'YYYY-MM-DD HH:mm:ss');
        if(!lhsDate || !rhsDate) return 0;
        if(lhsDate > rhsDate) return 1;
        else return -1;
      }
    })
    .shift();

  return latestStudyDate ? latestStudyDate : '-';
};


@observer
export default class LessonListItem extends React.Component<ILessonListItem> {
  constructor(props: ILessonListItem) {
    super(props);
  }
  render() {
    const { lesson, activeLessonId, ui, onClickItem } = this.props;
    const lessonLastStudyDate = getStepLatestStudyDate(lesson);

    const completeCnt = lesson.childrenList
      .map(item => {
        if (!item.book) return 0;
        return item.book.completed ? 1 : 0;
      })
      .reduce((prev: number, curr: number) => prev + curr, 0);

    const completePercent = Math.floor((completeCnt / lesson.childrenList.length) * 100);
    const completeStyle: React.CSSProperties = { width: `${completePercent}%` };
    const selectClassName = activeLessonId === lesson.id ? 'select' : '';
    return (
      <div className={`swiper-slide ${selectClassName}`} onClick={() => onClickItem(lesson.id)}>
        <div className="line">
          <span>{lessonLastStudyDate !== '' ? lessonLastStudyDate.substring(0,10): ''}</span>
          <p>
            <em dangerouslySetInnerHTML={{ __html: lesson.name }} style={{display: ui === 'textbook' ? 'none' : ''}}/> <span style={ui === 'textbook' ?  {fontSize: '26px'} : undefined} dangerouslySetInnerHTML={{ __html: lesson.depth_name }} /> 
          </p>
          <div className="progress-bar">
            <span style={completeStyle}>&nbsp;</span>
          </div>
        </div>
      </div>
    );
  }
}
