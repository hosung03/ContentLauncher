import * as React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx';
import { ClassesType, SwiperWrapperType, SwiperInterface } from '../../types';
import ClassListSlide from './ClassListSlide';

const Swiper = require('react-id-swiper').default;

export interface IClassList {
    totalPageCnt: number;
    classesList: ClassesType[];
    onClickClass: (classid: number, ready: boolean) => void;
    onChangeSlide: (activeSlideIndex: number) => void;
    showClassSettingPopup?: (classId: number) => void;
}

@observer
export default class ClassList extends React.Component<IClassList> {
    private swiper: SwiperInterface|null = null;
    @observable private swiperActiveIndex: number = 0;
  
    constructor(props: IClassList) {
      super(props);
    }
  
    onSlideChange = () => {
      if(this.swiper) {
        this.props.onChangeSlide(this.swiper.activeIndex);
        this.swiperActiveIndex = this.swiper.activeIndex;
      }
    };
  
    onClickNextBt = () => {
        if(this.swiper) this.swiper.slideNext();
    }
    private onClickPrevBt = () => {
        if(this.swiper) this.swiper.slidePrev();
    }
  
    get swipeParams() {
      return {
        slidesPerView: 'auto',
        on: {
          slideChange: () => this.onSlideChange(),
        },
      };
    }

    render() {
      const {
        totalPageCnt,
        classesList,
        onClickClass,
        showClassSettingPopup,
      } = this.props;
      
      return (
        <div className="classlist">
            <Swiper
                className=" swiper-container"
                containerClass="classlistout swiper-container"
                ref={(swiper: SwiperWrapperType) => {
                  if (swiper) this.swiper = swiper.swiper;
                  setTimeout(() => {
                    if(this.swiper) this.swiper.update();
                  }, 300);
                }}
                {...this.swipeParams}
            >
                {Array(totalPageCnt)
                .fill(null)
                .map((x, i) => (
                    <ClassListSlide
                        key={i + 1}
                        curPageCnt={i + 1}
                        totalPageCnt={totalPageCnt}
                        classesList={classesList}
                        onClickClass={onClickClass}
                        showClassSettingPopup={showClassSettingPopup}
                    />
                ))}
            </Swiper>
            <div className={this.swiperActiveIndex === totalPageCnt - 1 ? 'swiper-button-disabled' : 'swiper-button-next'} onClick={this.onClickNextBt} />
            <div className={this.swiperActiveIndex === 0  ? 'swiper-button-disabled' : 'swiper-button-prev'} onClick={this.onClickPrevBt} />
        </div>
      );
    }
  }
  