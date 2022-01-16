import * as React from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx';
import StepListItem from './StepListItem';
import { SwiperInterface, CurriculumType } from '../../types';
import soundPlayManager, { EffectSoundType } from '../../manager/SoundPlayManager';
import { getStepLatestStudyDate } from './LessonListItem';

const Swiper = require('react-id-swiper').default;

export interface IStepList {
  lesson: CurriculumType|undefined;
  activeLessonId: number;
  ui: string;
  onClickStart: (stepId: number, bookId: number) => void;
}

@observer
export default class StepList extends React.Component<IStepList> {
  private swiper: SwiperInterface|null = null;
  @observable swiperActiveIndex: number = 0;

  constructor(props: IStepList) {
    super(props);
  }

  componentWillReceiveProps(nextProps: IStepList) {
    const { activeLessonId } = this.props;

    if (nextProps.activeLessonId != activeLessonId) {
      if(this.swiper) this.swiper.slideTo(0);
      this.swiperActiveIndex = 0;
    }
  }

  onSlideChange = () => {
    if( this.swiper) this.swiperActiveIndex = this.swiper.activeIndex;
  };

  onClickNextBt = () => {
    if(this.swiper)this.swiper.slideNext();
  };

  onClickPrevBt = () => {
    if(this.swiper)this.swiper.slidePrev();
  };

  getActivateStepList(steps: CurriculumType[]|undefined) {
    if(!steps) return [];
    
    // unitList.sort((a, b) => a.code > b.code ? 1 : -1);
    // return unitList;
    const cloneChildrenList = [...steps];
    cloneChildrenList.sort((a, b) => a.code > b.code ? 1 : -1);
    return cloneChildrenList;
  }

  render() {
    const { lesson, ui, onClickStart } = this.props;
    if (!lesson) return null;

    const lessonLastStudyData = getStepLatestStudyDate(lesson);
    const perViewCnt = 5; // 4 => 5 표시개수 수정
    const totalItemLength = lesson.childrenList.length;

    const totalStepPageCnt = Math.ceil(totalItemLength / perViewCnt);
    let curPageNo = Math.ceil((this.swiperActiveIndex + 1) / perViewCnt);

    // swipe의 slide가 row 단위로 구성되므로
    // 페이지 계산을 위해서는 row 개수를 기반으로 계산이 필요하다.
    if (this.swiperActiveIndex + perViewCnt >= totalItemLength) curPageNo = totalStepPageCnt;

    const params = {
      className: 'swiper-container',
      containerClass: 'step_list',
      direction: 'vertical',
      slidesPerView: perViewCnt,
      slidesPerGroup: perViewCnt,
      on: {
        slideChange: () => {
          this.onSlideChange();
        },
      },
    };

    const prevBtClassName = this.swiperActiveIndex === 0 ? 'swiper-button-disabled' : '';
    const nextBtClassName = curPageNo === totalStepPageCnt ? 'swiper-button-disabled' : '';

    let steps = this.getActivateStepList(lesson.childrenList);

    return (
      <div className="step">
        <div className="step_title">
          {ui === 'textbook' ? 
            (<p>
              <b className="textbook"><span dangerouslySetInnerHTML={{ __html: lesson.depth_name }} /></b>
              <span className="date">{lessonLastStudyData}</span>
            </p>)
            :
            (<p>
              <span dangerouslySetInnerHTML={{ __html: lesson.name }} /> <b><span dangerouslySetInnerHTML={{ __html: lesson.depth_name }} /></b>
              <span className="date">{lessonLastStudyData}</span>
            </p>)
          }
          <span className="page">
            <b>{curPageNo}</b>/{totalStepPageCnt}
          </span>
        </div>
        <Swiper
          {...params}
          // tslint:disable-next-line
          ref={(swiper: any) => {
            if (swiper) this.swiper = swiper.swiper;
            setTimeout(() => {
              if(this.swiper) this.swiper.update();
            }, 300);
          }}
        >
          {steps.map((item, i) => (
            <StepListItem key={item.id} idx={i+1} step={item} onClickStart={onClickStart} />
          ))}
        </Swiper>
        <div className={`swiper-button-next ${nextBtClassName}`} onClick={this.onClickNextBt}>
          &nbsp;
        </div>
        <div className={`swiper-button-prev ${prevBtClassName}`} onClick={this.onClickPrevBt}>
          &nbsp;
        </div>
      </div>
    );
  }
}
