import { observer } from 'mobx-react'
import * as React from 'react'
import { observable } from 'mobx';
import BackgroundListSlideItem from './BackgroundListSlideItem';
import { BACKGROUND_IMAGE_DISPLAY_CNT_PER_PAGE } from '../../constants/index';
import { ClassSettingItemFile } from '../../types';

export interface IBackgroundListSlide {
  curPageCnt: number;
  totalPageCnt: number;
  bgList: ClassSettingItemFile[];
  selectedBgId: string;
  onClickBg: (selectedFile: ClassSettingItemFile) => void;
}

@observer
export default class BackgroundListSlide extends React.Component<IBackgroundListSlide> {
  render() {
    const { curPageCnt, totalPageCnt, bgList, selectedBgId, onClickBg } = this.props;

    let slideItemCnt = BACKGROUND_IMAGE_DISPLAY_CNT_PER_PAGE;
    const curPageIdx = curPageCnt - 1;
    // 남은 갯수 계산
    if (curPageCnt === totalPageCnt) {
      slideItemCnt = bgList.length - BACKGROUND_IMAGE_DISPLAY_CNT_PER_PAGE * curPageIdx;
    }

    const startIdx = curPageIdx * BACKGROUND_IMAGE_DISPLAY_CNT_PER_PAGE;
    return (
      <ul className="background_list swiper-slide">
        {Array(slideItemCnt)
          .fill(null)
          .map((_, i) => {
            return <BackgroundListSlideItem curBg={bgList[startIdx + i]} selectedBgId={selectedBgId} onClickBg={onClickBg} key={Math.random()} />;
          })}
      </ul>
    );
  }
}
