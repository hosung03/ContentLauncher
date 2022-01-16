import * as React from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx';
import StepList from './StepList';
import LessonList from './LessonList';
import { CurriculumType } from '../../types';
import * as moment from 'moment';

export interface ILessonStepListItem {
  unitData: CurriculumType|undefined;
  classOpen: boolean;
  moveBookId: number;
  ui: string;
  onClickStart?: (bookId: number, bookIdList: number[]) => void;
}

@observer
export default class LessonStepListItem extends React.Component<ILessonStepListItem> {
  @observable private activeLessonId: number = 0;

  constructor(props: ILessonStepListItem) {
    super(props);
  }

  componentDidMount() {
    const { unitData } = this.props;
    if(!unitData) return;

    if(this.activeLessonId === 0) this.activeLessonId = unitData.childrenList[0].id;
  }

  onClickLesson = (lessonId: number) => {
    this.activeLessonId = lessonId;
  };

  onClickStart = (stepId: number, bookId: number) => {
    const { unitData, classOpen, onClickStart } = this.props;
    if (!unitData) return;

    const activeLesson = unitData.childrenList.find(item => item.id === this.activeLessonId);
    if(!activeLesson) return;

    const step = activeLesson.childrenList.find(item => item.id === stepId);
    if(!step) return;
    if(step.book && step.book.completed === 0 && classOpen) {
      let curdatetime = moment().format('YYYY-MM-DD HH:mm:ss');
      step.book.updatetime = curdatetime;
      step.book.completed = 1;
    }

    let bookIdList: number[] = [];
    activeLesson.childrenList.map((item) => {
      const id = item.book ? item.book.id : 0;
      if(id > 0) bookIdList.push(id);
    });
   
    if(onClickStart && bookId > 0) onClickStart(bookId, bookIdList);
  };

  componentDidUpdate(prev: ILessonStepListItem) {
    if(this.props.moveBookId > 0 && prev.moveBookId !== this.props.moveBookId && this.props.unitData && this.props.classOpen) {
      const activeLesson = this.props.unitData.childrenList.find(item => item.id === this.activeLessonId);
      if(!activeLesson) return;

      const step = activeLesson.childrenList.find(item => item.book && item.book.id === this.props.moveBookId);
      if(!step) return;
      if(step.book && step.book.completed === 0 && this.props.classOpen) {
        let curdatetime = moment().format('YYYY-MM-DD HH:mm:ss');
        step.book.updatetime = curdatetime;
        step.book.completed = 1;
      }
    }
  }

  render() {
    const { unitData, ui } = this.props;
    if (!unitData || this.activeLessonId === 0) return null;

    const activeLesson = unitData.childrenList.find(item => item.id === this.activeLessonId);

    return (
      <div className="swiper-slide">
        <div className="lesson_title">
          <p>
            <em style={{display: ui === 'textbook' ? 'none' : ''}}><span dangerouslySetInnerHTML={{ __html: unitData.name }} /></em>
            <b><span dangerouslySetInnerHTML={{ __html: unitData.depth_name }} /></b>
          </p>
        </div>
        <div className="lesson_info">
          <StepList lesson={activeLesson} activeLessonId={this.activeLessonId} ui={ui} onClickStart={this.onClickStart} />
          <LessonList lessons={unitData.childrenList} activeLessonId={this.activeLessonId} ui={ui} onClickLesson={this.onClickLesson} />
        </div>
      </div>
    );
  }
}
