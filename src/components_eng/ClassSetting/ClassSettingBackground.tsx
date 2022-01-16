import { observer } from 'mobx-react'
import * as React from 'react'
import { observable } from 'mobx';
import { BACKGROUND_IMAGE_DISPLAY_CNT_PER_PAGE } from '../../constants/index';
import { SwiperInterface, ClassSettingItemFile } from '../../types';
import BackgroundListSlide from './BackgroundListSlide';
import { CAPTION, LANG } from '../../constants/Caption';

const Swiper = require('react-id-swiper').default;

export type BgDataType = {
  id: number;
  thumbnail: string;
};

export interface IClassSettingBackground {
  selectedBgId: string;
  bgList: ClassSettingItemFile[];
  onClickBg: (selectedFile: ClassSettingItemFile) => void;
}

@observer
export default class ClassSettingBackground extends React.Component<IClassSettingBackground> {
  @observable private swiperActiveIndex: number = 0;  
  private swiper!: SwiperInterface;

  constructor(props: IClassSettingBackground) {
    super(props);
  }

  onSlideChange = () => {
    this.swiperActiveIndex = this.swiper.activeIndex;
  };

  onClickNextBt = () => {
    this.swiper.slideNext();
  };

  onClickPrevBt = () => {
    this.swiper.slidePrev();
  };

  onInitSwiper() {
    window.setTimeout(() => this.swiper.update(), 100);
  }

  render() {
    const { onClickBg, selectedBgId, bgList } = this.props;

    const totalCnt = bgList.length;
    const totalPageCnt = Math.ceil(totalCnt / BACKGROUND_IMAGE_DISPLAY_CNT_PER_PAGE);

    const prevBtClassName = this.swiperActiveIndex === 0 ? 'swiper-button-disabled' : '';
    const nextBtClassName = this.swiperActiveIndex === totalPageCnt - 1 ? 'swiper-button-disabled' : '';

    const params = {
      on: {
        init: () => this.onInitSwiper(),
        slideChange: () => this.onSlideChange(),
      },
    };

    const cloneBgList = [...bgList];
    cloneBgList.sort((a, b) => a.orderNum > b.orderNum ? 1 : -1);

    return (
      <div className="background">
        <dl>
          <dt>
            <b>{CAPTION[LANG].BACKGROUND}</b>
            <span>
              {this.swiperActiveIndex + 1}/<b>{totalPageCnt}</b>
            </span>
          </dt>
          <dd>
            <Swiper
              className=" swiper-container"
              containerClass=" swiper-container"
              // tslint:disable-next-line
              ref={(swiper: any) => {
                if (swiper) this.swiper = swiper.swiper;
                setTimeout(() => {
                  if(this.swiper) this.swiper.update();
                }, 300);
              }}
              {...params}
            >
              {Array(totalPageCnt)
                .fill(null)
                .map((x, i) => (
                  <BackgroundListSlide
                    key={Math.random()}
                    curPageCnt={i + 1}
                    totalPageCnt={totalPageCnt}
                    selectedBgId={selectedBgId}
                    bgList={cloneBgList}
                    onClickBg={onClickBg}
                  />
                ))}
            </Swiper>
            <div className={`swiper-button-next ${nextBtClassName}`} onClick={this.onClickNextBt} />
            <div className={`swiper-button-prev ${prevBtClassName}`} onClick={this.onClickPrevBt} />
          </dd>
        </dl>
      </div>
    );
  }
}
