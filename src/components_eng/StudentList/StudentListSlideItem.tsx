import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';import * as moment from 'moment';
import { MemberDataType, DisplayMode, AccountState } from '../../types';
import { DEFAULT_WOMAN_IMAGE, DEFAULT_MAN_IMAGE } from '../../constants';

export interface IStudentListSlideItem {
  curStudent: MemberDataType;
  cusStudentState: AccountState;
  displayMode: DisplayMode;
}

@observer
export default class StudentListSlideItem extends React.Component<IStudentListSlideItem> {
  constructor(props: IStudentListSlideItem) {
    super(props);

    // let curStudentState = AccountState.LOGOUT;
    // const student = accountManager.getAccount(props.curStudent.id);
    // if (student) {
    //   if (student.sessionState === SessionState.IN_CLASS) {
    //     curStudentState = AccountState.IN_CLASS;
    //   } else if (student.sessionState === SessionState.ABNORMAL && student.prevSessionState === SessionState.IN_CLASS) {
    //     curStudentState = AccountState.IN_CLASS;
    //   }
    // }
  }

  // componentWillReceiveProps(next: IStudentListSlideItem) {
  //   if (next.inclass !== this.props.inclass) {
  //     this.studentState = true;
  //   }
  // }

  render() {
    const { curStudent, cusStudentState, displayMode } = this.props;

    const birthMonth = moment(curStudent.birthday, 'YYYYMMDD').format('MM');
    const birthDayDisplay = moment(curStudent.birthday, 'YYYYMMDD').format('MM.DD');
    const curMonth = moment().format('MM');

    const birthClassName = birthMonth === curMonth ? 'birth con' : '';

    let studentStateClassName = 'disabled';
    if (cusStudentState === AccountState.IN_CLASS) studentStateClassName = 'ready';
    // else studentStateClassName = '';

    // if (studentState === AccountState.IN_CLASS) {
    //   studentStateClassName = 'ready';
    // } else if (studentState === AccountState.OUT_CLASS) {
    //   studentStateClassName = '';
    // }

    let thumbnail = '';
    if(curStudent.defaultThumbnail !== undefined && curStudent.defaultThumbnail === '') {
      thumbnail = curStudent.thumbnail === ''
      ? curStudent.gender === 'F'
        ? DEFAULT_WOMAN_IMAGE
        : DEFAULT_MAN_IMAGE
      : curStudent.thumbnail;
    } else thumbnail = curStudent.defaultThumbnail;
    let studentName = curStudent.name;
    if (displayMode === DisplayMode.PROFILE_THUMB_N_NICKNAME) {
      thumbnail =
        curStudent.profileThumbnail === ''
          ? curStudent.gender === 'F'
            ? DEFAULT_WOMAN_IMAGE
            : DEFAULT_MAN_IMAGE
          : curStudent.profileThumbnail;
      studentName = curStudent.nickName;
    }

    const isNewMember = false;
    const newClassName = isNewMember ? 'new' : '';
    return (
      <li className={`${newClassName} ${birthClassName} ${studentStateClassName}`}>
        <p style={{ width: '94px', height: '94px', overflow: 'hidden', borderRadius: '50%' }}>
          <img src={thumbnail} />
        </p>
        <span>{studentName}</span>
        <em>{birthDayDisplay}</em>
        <b className="i_new"></b>
        <b className="i_con"></b>
      </li>
    );
  }
}
