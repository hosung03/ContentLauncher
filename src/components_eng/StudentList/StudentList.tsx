import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import { STUDENT_LIST_DISPALY_CNT_PER_PAGE } from '../../constants';
import { MemberDataType, DisplayMode, SwiperInterface, AccountState } from '../../types';
import StudentListSlide from './StudentListSlide';
import { CAPTION, LANG } from '../../constants/Caption';

const Swiper = require('react-id-swiper').default;

interface IStudentList {
  allStudents: MemberDataType[];
  studentStates: AccountState[];
  displayMode: DisplayMode;
}

@observer
export default class StudentList extends React.Component<IStudentList> {
  private swiper: SwiperInterface|null = null;
  @observable private swiperActiveIndex = 0;

  constructor(props: IStudentList) {
    super(props);
  }

  onSlideChange() {
    if(this.swiper) this.swiper.activeIndex = this.swiperActiveIndex;
  }

  onClickNextBt() {
    if(this.swiper) this.swiper.slideNext();
  }

  onClickPrevBt() {
    if(this.swiper) this.swiper.slidePrev();
  }

  render() {
    const { allStudents, studentStates, displayMode } = this.props;
    if (!allStudents) return null;

    const params = {
      className: 'swiper-container',
      containerClass: 'swiper-container',
      on: {
        slideChange: () => {
          this.onSlideChange();
        },
      },
    };

    let totalPageCnt = 0;
    if (allStudents) {
      totalPageCnt = Math.ceil(allStudents.length / STUDENT_LIST_DISPALY_CNT_PER_PAGE);
    }

    const prevBtClassName = this.swiperActiveIndex === 0 ? 'swiper-button-disabled' : '';
    const nextBtClassName = this.swiperActiveIndex === totalPageCnt - 1 ? 'swiper-button-disabled' : '';

    return (
      <div className="attend">
        <dl>
          <dt>
            <b>{CAPTION[LANG].STUDENT_ATTEND}</b>
            <span>
              {this.swiperActiveIndex + 1}/<b>{totalPageCnt}</b>
            </span>
          </dt>
          <dd>
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
              {Array(totalPageCnt)
                .fill(null)
                .map((x, i) => (
                  <StudentListSlide
                    key={Math.random()}
                    curPageCnt={i + 1}
                    totalPageCnt={totalPageCnt}
                    allStudents={allStudents}
                    studentStates={studentStates}
                    displayMode={displayMode}
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
