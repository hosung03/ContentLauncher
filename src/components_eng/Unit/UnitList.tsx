import * as React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx';
import { CurriculumType, SwiperInterface, SwiperWrapperType } from '../../types';
import UnitListSlide from './UnitListSlide';
import soundPlayManager, { EffectSoundType } from '../../manager/SoundPlayManager';

const Swiper = require('react-id-swiper').default;

export interface IUnitList {
  classId: number;
  totalPageCnt: number;
  unitList: CurriculumType[]|undefined;
  onClickUnit: (id: number) => void;
  onChangeSlide: (activeSlideIndex: number) => void;
}

@observer
export default class UnitList extends React.Component<IUnitList> {
  private swiper: SwiperInterface|null = null;
  @observable private swiperActiveIndex: number = 0;
  @observable private activateUnitList: CurriculumType[] = [];

  constructor(props: IUnitList) {
    super(props);
  }

  componentDidMount() {
    if(this.swiper) this.swiper.slideTo(this.swiperActiveIndex, 0);
    this.activateUnitList = this.getActivateUnitList(this.props.unitList);
  }

  componentWillReceiveProps(nextProps: IUnitList) {
    if (this.props.unitList !== nextProps.unitList) {
      this.activateUnitList = this.getActivateUnitList(nextProps.unitList);
    }
  }

  onSlideChange = () => {
    if(this.swiper === null) return;
    this.props.onChangeSlide(this.swiper.activeIndex);
    this.swiperActiveIndex = this.swiper.activeIndex;
  };

  onClickNextBt = () => {
    if(this.swiper === null) return;
    soundPlayManager.playEffect(EffectSoundType.COMMON_ARROW_CLASSUNIT_SELECT);
    this.swiper.slideNext();
  };

  onClickPrevBt = () => {
    if(this.swiper === null) return;
    soundPlayManager.playEffect(EffectSoundType.COMMON_ARROW_CLASSUNIT_SELECT);
    this.swiper.slidePrev();
  };

  getActivateUnitList(unitList: CurriculumType[]|undefined) {
    if(!unitList) return [];
    
    // unitList.sort((a, b) => a.code > b.code ? 1 : -1);
    // return unitList;
    const cloneChildrenList = [...unitList];
    cloneChildrenList.sort((a, b) => a.code > b.code ? 1 : -1);
    return cloneChildrenList;
  }

  get swipeParams() {
    return {
      className: 'swiper-container',
      containerClass: 'classlistout swiper-container',
      speed: 500,
      slidesPerView: 'auto',
      on: {
        slideChange: () => {
          this.onSlideChange();
        },
      },
    };
  }

  render() {
    if (this.activateUnitList.length === 0) return null;

    const { totalPageCnt, onClickUnit } = this.props;
  
    return (
      <div className="classlist">
        <Swiper
          {...this.swipeParams}
          ref={(swiper: SwiperWrapperType) => {
            if (swiper) this.swiper = swiper.swiper;
            setTimeout(() => {
              if(this.swiper) this.swiper.update();
            }, 300);
          }}
        >
          {Array(totalPageCnt)
            .fill(null)
            .map((x, i) => (
              <UnitListSlide
                key={i}
                classId={this.props.classId}
                curPageCnt={i + 1}
                totalPageCnt={totalPageCnt}
                unitList={this.activateUnitList}
                onClickUnit={onClickUnit}
              />
            ))}
        </Swiper>
        <div className={this.swiperActiveIndex === totalPageCnt - 1 ? 'swiper-button-disabled' : 'swiper-button-next'} onClick={this.onClickNextBt} />
        <div className={this.swiperActiveIndex === 0  ? 'swiper-button-disabled' : 'swiper-button-prev'} onClick={this.onClickPrevBt} />
      </div>
    );
  }
}
