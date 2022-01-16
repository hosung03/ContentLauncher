import * as React from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx';
import LessonListItem from './LessonListItem';
import { SwiperInterface, CurriculumType } from '../../types';

const Swiper = require('react-id-swiper').default;

export interface ILessonList {
  lessons: CurriculumType[]|undefined;
  activeLessonId: number;
  ui: string;
  onClickLesson: (lessonId: number) => void;
}

@observer
export default class LessonList extends React.Component<ILessonList> {
  private swiper: SwiperInterface|null = null;
  @observable private swiperActiveIndex: number = 0;

  constructor(props: ILessonList) {
    super(props);
  }

  onSlideChange = () => {
    if(this.swiper) this.swiperActiveIndex = this.swiper.activeIndex;
  }

  onClickNextBt = () => {
    if(this.swiper) this.swiper.slideNext();
  }

  onClickPrevBt = () => {
    if(this.swiper) this.swiper.slidePrev();
  }

  onClickLesson = (lessonId: number) => {
    const { onClickLesson } = this.props;
    onClickLesson(lessonId);
  }

  getActivateLessonList(lessons: CurriculumType[]|undefined) {
    if(!lessons) return [];
    
    // unitList.sort((a, b) => a.code > b.code ? 1 : -1);
    // return unitList;
    const cloneChildrenList = [...lessons];
    cloneChildrenList.sort((a, b) => a.code > b.code ? 1 : -1);
    return cloneChildrenList;
  }

  render() {
    const { lessons, activeLessonId, ui } = this.props;

    const perViewCnt = 4;
    const totalItemLength = lessons ? lessons.length : 0;

    const totalLessonPageCnt = Math.ceil(totalItemLength / perViewCnt);
    let curPageNo = Math.ceil((this.swiperActiveIndex + 1) / perViewCnt);

    // swipe의 slide가 row 단위로 구성되므로
    // 페이지 계산을 위해서는 row 개수를 기반으로 계산이 필요하다.
    if (this.swiperActiveIndex + perViewCnt >= totalItemLength) curPageNo = totalLessonPageCnt;

    const prevBtClassName = this.swiperActiveIndex === 0 ? 'swiper-button-disabled' : '';
    const nextBtClassName = curPageNo === totalLessonPageCnt ? 'swiper-button-disabled' : '';

    const params = {
      className: 'swiper-container',
      containerClass: 'lesson_list',
      direction: 'vertical',
      slidesPerView: perViewCnt,
      slidesPerGroup: perViewCnt,
      on: {
        slideChange: () => {
          this.onSlideChange();
        },
      },
    };

    let activeLessons = this.getActivateLessonList(lessons);

    return (
      <div className="lesson">
        <div className="lesson_page">
          <span>
            <b>{curPageNo}</b>/{totalLessonPageCnt}
          </span>
        </div>
        <Swiper
          {...params}
          ref={(swiper: any) => {
            if (swiper) this.swiper = swiper.swiper;
            setTimeout(() => {
              if(this.swiper) this.swiper.update();
            }, 300);
          }}
        >
          {activeLessons && activeLessons.map((item, i) => (
            <LessonListItem key={item.id} lesson={item} activeLessonId={activeLessonId} ui={ui} onClickItem={this.onClickLesson} />
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
