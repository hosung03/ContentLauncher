import * as React from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx';
import LessonStepListItem from './LessonStepListItem';
import soundPlayManager, { EffectSoundType } from '../../manager/SoundPlayManager';
import { CLASS_LIST_DISPLAY_CNT_PER_PAGE } from '../../constants/index';
import { CurriculumType, SwiperInterface } from '../../types';

const Swiper = require('react-id-swiper').default;

export interface ILessonStepList {
  unitId: number;
  unitList: CurriculumType[]|undefined;
  classOpen: boolean;
  moveBookId: number;
  ui: string;
  onClickStart: (bookId: number, bookIdList: number[]) => void;
  changeUnitSelect?: (unitId: number) => void;
  onClickBack?: () => void;
}

@observer
export default class LessonStepList extends React.Component<ILessonStepList> {
  private swiper: SwiperInterface|null = null;
  @observable swiperActiveIndex: number = 0;

  constructor(props: ILessonStepList) {
    super(props);
  }

  componentDidUpdate(prev: ILessonStepList) {
    if(prev.unitList === undefined && this.props.unitList && this.props.unitList.length > 0) {
      const initSlideIndex = this.getInitSlideIndex();
      this.swiperActiveIndex = initSlideIndex;
    } else if (prev.unitList && this.props.unitList && prev.unitList.length !== this.props.unitList.length) {
      const initSlideIndex = this.getInitSlideIndex();
      this.swiperActiveIndex = initSlideIndex;
    }
  }

  onSlideChange = () => {
    if (this.swiper) {
      this.swiperActiveIndex = this.swiper.activeIndex;

      const { unitList, changeUnitSelect } = this.props;

      if (unitList) {
        const selectedUnitData = unitList[this.swiper.activeIndex];
        if (changeUnitSelect) changeUnitSelect(selectedUnitData.id);
      }
    }
  };

  onClickLessonMenu = () => {
    const { onClickBack } = this.props;
    if (onClickBack) onClickBack();
  };

  onClickStart = (bookId: number, bookIdList: number[]) => {
    const { onClickStart } = this.props;
    if(onClickStart) onClickStart(bookId, bookIdList);
  };

  onClickNextBt = () => {
    soundPlayManager.playEffect(EffectSoundType.COMMON_ARROW_CLASSUNIT_SELECT);
    if(this.swiper) this.swiper.slideNext();
  };

  onClickPrevBt = () => {
    soundPlayManager.playEffect(EffectSoundType.COMMON_ARROW_CLASSUNIT_SELECT);
    if(this.swiper) this.swiper.slidePrev();
  };

  getInitSlideIndex = () => {
    const { unitList, unitId } = this.props;

    let initSlideIndex = 0;
    if (unitId && unitList) {
      initSlideIndex = unitList.findIndex(item => item.id === unitId);
    }
    return initSlideIndex;
  };

  render() {
    const { unitList, classOpen, moveBookId, ui } = this.props;
    if (!unitList) return null;

    const initSlideIndex = this.getInitSlideIndex();

    const params = {
      className: 'swiper-container',
      containerClass: 'lessonunit swiper-container',
      spaceBetween: 90,
      on: {
        slideChange: () => {
          this.onSlideChange();
        },
      },
      initialSlide: initSlideIndex,
      threshold: 100,
      simulateTouch: true,
    };

    const maxItemCnt = unitList.length;
    const prevBtClassName = this.swiperActiveIndex === 0 || maxItemCnt < 2 ? 'swiper-button-disabled' : '';
    const nextBtClassName = this.swiperActiveIndex >= maxItemCnt - 1 || maxItemCnt < 2 ? 'swiper-button-disabled' : '';

    return (
      <div className="lessonwrap">
        <div className="lesson_menu" onClick={this.onClickLessonMenu}>
          &nbsp;
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
          {unitList.map((item, i) => (
            <LessonStepListItem key={item.id} unitData={item} classOpen={classOpen} moveBookId={moveBookId} ui={ui} onClickStart={this.onClickStart} />
          ))}
        </Swiper>
        <div className="lessonnav">
          <div className={`swiper-button-next ${nextBtClassName}`} onClick={this.onClickNextBt}>
            &nbsp;
          </div>
          <div className={`swiper-button-prev ${prevBtClassName}`} onClick={this.onClickPrevBt}>
            &nbsp;
          </div>
        </div>
      </div>
    );
  }
}
