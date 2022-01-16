import { observer } from 'mobx-react'
import * as React from 'react'
import { observable } from 'mobx';
import { Z_INDEX_LESSON_COMPLETE_POPUP, ExtraBookType } from '../../constants';
import {
  SwiperInterface,
  ExtraActivityType,
  SwiperWrapperType,
} from '../../types';
import { WSStore } from '../../stores/wsStore';

import ThreeMinSlide from './ThreeMinSlide';
import { CAPTION, LANG } from '../../constants/Caption';
import ThreeMinFilter, { FilterType } from './ThreeMinFilter';
import './ThreeMinActivityPopup.scss';

const Swiper = require('react-id-swiper').default;

const getFilteredExtraList = (curFilterType: FilterType, extraActivityList?: ExtraActivityType[]) => {
  if (!extraActivityList) return undefined;

  let filteredExtraActList:ExtraActivityType[]|undefined = undefined;

  if (curFilterType === FilterType.ALL) {
    filteredExtraActList = [...extraActivityList];
    filteredExtraActList.sort((a, b) => a.order > b.order ? 1 : -1);
  } else if (curFilterType === FilterType.LOWER) {
    filteredExtraActList = [...extraActivityList].filter(item => item.type === ExtraBookType.LOWER);
    filteredExtraActList.sort((a, b) => a.order > b.order ? 1 : -1);
  } else if (curFilterType === FilterType.UPPER) {
    filteredExtraActList = [...extraActivityList].filter(item => item.type === ExtraBookType.UPPER);
    filteredExtraActList.sort((a, b) => a.order > b.order ? 1 : -1);
  } else {
    console.error('invalid extra filter type:', curFilterType);
  }
  return filteredExtraActList;
};

export interface IThreeMinActivityPopup {
  wsStore: WSStore;
  onClose?: () => void;
}

@observer
export default class ThreeMinActivityPopup extends React.Component<IThreeMinActivityPopup> {
  @observable private curFilterType: FilterType = FilterType.ALL;
  @observable private displayActivityList?: ExtraActivityType[] = [];
  private swiper!: SwiperInterface;

  constructor(props: IThreeMinActivityPopup) {
    super(props);
  }

  componentDidMount() {
    const { extraActivityList } = this.props.wsStore;
    if(extraActivityList) this.displayActivityList = getFilteredExtraList(this.curFilterType, extraActivityList);
  }

  handleClickActivity = (bookId: number) => {
    const { extraActivityList } = this.props.wsStore;
    if (!extraActivityList) return;

    const curActivity = extraActivityList.find(item => item.book && item.book.id === bookId);
    if (!curActivity) return;

    this.props.wsStore.curBookId = bookId;
    let data = { type: 'gotoBook', from: "content", srcFrame: 'navi', msg: {
        bookid: bookId, 
        booklist: null,
        extra: 'Y',
        extraid: curActivity.id
    }};
    this.props.wsStore.sendPostMessage(data);
  };

  handleUpdateFilter = (curFilterType: FilterType) => {
    const { extraActivityList } = this.props.wsStore;
    if(extraActivityList) {
      this.curFilterType = curFilterType;
      this.displayActivityList = getFilteredExtraList(curFilterType, extraActivityList);
    }
  }

  get swiperParams() {
    return {
      className: ' swiper-container',
      containerClass: ` swiper-container`,
      scrollbar: { el: '.swiper-scrollbar', hide: false },
      direction: 'vertical',
      slidesPerView: 'auto',
      mousewheelControl: true,
      freeMode: true,
    };
  }

  render() {
    const { onClose } = this.props; 
    let style: React.CSSProperties = {opacity: 1};

    return (
      <div id="contentToolContainer" style={style}>
        <div id="pageMask" style={{ zIndex: Z_INDEX_LESSON_COMPLETE_POPUP }}>
          <div className="stu_popup allrnd">
            <div className="stu_popup_title">
              <p>
                <b>{CAPTION[LANG].SPECIAL_ACTIVITY}</b>
              </p>{' '}
              <span className="close" onClick={onClose} />
            </div>
            {this.displayActivityList && (
              <div className="threeM_wrap infilter">
                <ThreeMinFilter curFilterType={this.curFilterType} onUpdateFilter={this.handleUpdateFilter} />
                <Swiper
                  {...this.swiperParams}
                  ref={(swiper: SwiperWrapperType) => {
                    if (swiper) this.swiper = swiper.swiper;
                    setTimeout(() => {
                      if(this.swiper) this.swiper.update();
                    }, 300);
                  }}
                >
                  <ul className="swiper-slide threeM_list threeM_full">
                    <ThreeMinSlide
                      activityList={this.displayActivityList}
                      onClickActivity={this.handleClickActivity}
                    />
                  </ul>
                </Swiper>
              </div>
            )}
            {!this.displayActivityList && <div className="threeM_wrap" />}
          </div>
        </div>
      </div>
    );
  }
}
