import * as React from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx';
import { CLASS_LIST_DISPLAY_CNT_PER_PAGE } from '../../constants/index';
import { CurriculumType } from '../../types';
import UnitListSlideItem from './UnitListSlideItem';

export interface IUnitListSlide {
  classId: number;
  curPageCnt: number;
  totalPageCnt: number;
  unitList: CurriculumType[];
  onClickUnit: (id: number) => void;
}

@observer
export default class UnitListSlide extends React.Component<IUnitListSlide> {
  render() {
    const { curPageCnt, totalPageCnt, unitList } = this.props;

    let slideItemCnt = CLASS_LIST_DISPLAY_CNT_PER_PAGE;
    const curPageIdx = curPageCnt - 1;
    // 남은 갯수 계산
    if (curPageCnt === totalPageCnt) {
      slideItemCnt = unitList.length - CLASS_LIST_DISPLAY_CNT_PER_PAGE * curPageIdx;
    }

    const startIdx = curPageIdx * CLASS_LIST_DISPLAY_CNT_PER_PAGE;
    return (
      <div className="swiper-slide">
        <ul>
          {Array(slideItemCnt)
            .fill(null)
            .map((_, i) => {
              return <UnitListSlideItem {...this.props} key={unitList[startIdx + i].id} classId={this.props.classId} unit={unitList[startIdx + i]}/>;
            })}
        </ul>
      </div>
    );
  }
}
