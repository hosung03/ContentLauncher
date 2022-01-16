import { convertCodeToSeq, convertUnixTime } from '../../utils/HelperFunc';
import { CurriculumType } from '../../types';
import * as React from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx';
import { CAPTION, LANG } from '../../constants/Caption';

export interface IStepListItem {
  idx: number;
  step: CurriculumType;
  onClickStart: (stepId: number, bookId: number) => void;
}

@observer
export default class StepListItem extends React.Component<IStepListItem> {
  render() {
    const { step, onClickStart } = this.props;
    // const isCompleted = step.book && step.book.studyResultClass ? step.book.studyResultClass.completed : false;
    // const stepLastStudyDate = step.book && step.book.studyResultClass ? convertUnixTime(step.book.studyResultClass.startTime) : '';
    // const stepCompleteClassName = isCompleted ? 'select' : '';
    const isCompleted = step.book && step.book.completed ? true : false;
    const stepLastStudyDate = step.book && step.book.updatetime ? step.book.updatetime : '';
    const stepCompleteClassName = isCompleted ? 'select' : '';
    return (
      <div className="swiper-slide cursor_pointer" onClick={() => onClickStart(step.id, step.book ? step.book.id : 0)}>
        <div className="idx">
          <em className={stepCompleteClassName}>{this.props.idx}</em>
        </div>
        <div className="name">
          <div dangerouslySetInnerHTML={{ __html: step.name }} />
          <span>{stepLastStudyDate}</span>
        </div>
        <div className="btn">
          <button className="s">
            {CAPTION[LANG].START}
          </button>
        </div>
      </div>
    );
  }
}
