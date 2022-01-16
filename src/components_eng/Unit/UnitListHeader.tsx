import * as React from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx';
import Date from '../../utils/Date';
import sessionStorageManager from '../../utils/SessionStorageManager';
import { CAPTION, LANG } from '../../constants/Caption';
import { MemberDataType, ClassesType } from '../../types';

export interface IUnitListHeader {
  teacherDisplayName: string;
  selectedClass: ClassesType|undefined;
  studentCnt: number;
  entryCnt: number;
  classOpen: boolean;
  showStudentListPage?: () => void;
  showExtraActivityPopup?: () => void;
  onOpenClass?: () => void;
  showClassSettingPopup?: () => void;
}

@observer
export default class UnitListHeader extends React.Component<IUnitListHeader> {
  @observable private stateChanged: boolean = true;
  @observable private curLoginStudentCnt: number = 0;
  @observable private isTestmode: boolean = false;

  constructor(props: IUnitListHeader) {
    super(props);
  }

  updateCurStudentCount() {
    this.curLoginStudentCnt = 0;
  }

  onOpenClass = () => {
    if(this.props.classOpen) return;
    if(this.props.onOpenClass) this.props.onOpenClass();
  }

  onClickSetting = () => {
    if(this.props.classOpen) return;
    if(this.props.showClassSettingPopup) this.props.showClassSettingPopup();
  }

  render() {
    const { teacherDisplayName, selectedClass, entryCnt, studentCnt, showStudentListPage, showExtraActivityPopup, classOpen } = this.props;

    const classDisplayName = selectedClass ? selectedClass.name : '';
    
    return (
      <dl className="classinfo">
        <dt>
          <b>
            <span className="cname">{classDisplayName}</span>
            <span className="tname">
              {teacherDisplayName}
            </span>
            <span className="btn_start" onClick={this.onOpenClass} style={{display: classOpen ? 'none': ''}}></span>
            <span className="setting" onClick={this.onClickSetting} style={{display: classOpen ? 'none': ''}}></span>
            <span className="classinfo_logo"></span>
          </b>
          <Date />
        </dt>
        <dd className="unit">
          <strong className="student" onClick={showStudentListPage}>
            {CAPTION[LANG].STUDENTS}{' '}
            <span>
              <b>{entryCnt}</b> {studentCnt}
            </span>
          </strong>
          <div className="unit_info">
            <p className="activity" onClick={showExtraActivityPopup}>
              {CAPTION[LANG].SPECIAL_ACTIVITY}
            </p>
          </div>
        </dd>
      </dl>
    );
  }
}
