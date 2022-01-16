import * as React from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx';
import { CLASS_LIST_DISPLAY_CNT_PER_PAGE } from '../../constants/index';
import { ClassesType } from '../../types';
import ClassListSlideItem from './ClassListSlideItem';

export interface IClassListSlide {
  curPageCnt: number;
  totalPageCnt: number;
  classesList: ClassesType[];
  onClickClass: (classid: number, ready: boolean) => void;
  showClassSettingPopup?: (classId: number) => void;
}

@observer
export default class ClassListSlide extends React.Component<IClassListSlide> {
  render() {
    const {
      curPageCnt,
      totalPageCnt,
      classesList,
      onClickClass,
      showClassSettingPopup,
    } = this.props;
    const curPageIdx = curPageCnt - 1;
    // 남은 갯수 계산
    const slideItemCnt = curPageCnt === totalPageCnt ? classesList.length - CLASS_LIST_DISPLAY_CNT_PER_PAGE * curPageIdx : CLASS_LIST_DISPLAY_CNT_PER_PAGE;
    const startIdx = curPageIdx * CLASS_LIST_DISPLAY_CNT_PER_PAGE;
    return (
      <div className="swiper-slide">
        <ul>
          {Array(slideItemCnt)
            .fill(null)
            .map((_, i) => {
              return (
                <ClassListSlideItem
                  key={i}
                  curClass={classesList[startIdx + i]}
                  onClickClass={onClickClass}
                  showClassSettingPopup={showClassSettingPopup}
                />
              );
            })}
        </ul>
      </div>
    );
  }
}
