import * as React from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx';
import serverHelper from '../../utils/ServerHelper';
import { CurriculumType } from '../../types';
import { DEFAULT_CLASS_IMAGE } from '../../constants';
import { Link } from 'react-router-dom';

export interface IUnitListSlideItem {
  classId: number;
  unit: CurriculumType;
  onClickUnit: (id: number) => void;
}

@observer
export default class UnitListSlideItem extends React.Component<IUnitListSlideItem> {
  constructor(props: IUnitListSlideItem) {
    super(props);
  }

  onClickUnit = () => {
    const { unit } = this.props;
    this.props.onClickUnit(unit.id);
  };

  getTotalLessonCompleteCnt = () => {
    const { unit } = this.props;
    return unit.childrenList
      .map(lessonItem => {
        const completeStepCnt = lessonItem.childrenList
          .map(stepItem => {
            // if (stepItem.book && stepItem.book.studyResultClass) return stepItem.book.studyResultClass.completed ? 1 : 0;
            if (stepItem.book && stepItem.book.completed) return stepItem.book.completed ? 1 : 0;
            return 0;
          })
          .reduce((prev: number, curr: number) => prev + curr, 0);
        return completeStepCnt === lessonItem.childrenList.length ? 1 : 0;
      })
      .reduce((prev: number, curr: number) => prev + curr, 0);
  };

  render() {
    const { unit } = this.props;

    const curriculumThumbnail = unit.thumbnail === '' ? DEFAULT_CLASS_IMAGE : unit.thumbnail;
    const unitDisplayName = unit.name;
    const depthName = unit.depth_name;
    const totalLessonCnt = unit.childrenList.length;
    const completedLessonCnt = this.getTotalLessonCompleteCnt();
    const isCompleted = completedLessonCnt === totalLessonCnt;
    const completedPercent = (completedLessonCnt / totalLessonCnt) * 100;
    const progressStyle: React.CSSProperties = { width: `${completedPercent}%` };

    return (
      <li onClick={this.onClickUnit}>
        <div className="cCnt">
          <img src={curriculumThumbnail} />
        </div>
        <div className="cInfo">
          <strong dangerouslySetInnerHTML={{ __html: unitDisplayName }} />
          <span dangerouslySetInnerHTML={{ __html: depthName }} />
          <div className="step">
            <p>
              <em>{completedLessonCnt}</em>/<em>{totalLessonCnt}</em>
            </p>
            <div className="step_bar_all">
              <span style={progressStyle} />
            </div>
          </div>
        </div>
        {isCompleted && (
          <div className="cComplete">
            <b>Complete</b>
          </div>
        )}
      </li>
    );
  }
}
