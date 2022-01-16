import { MemberDataType, ClassesType } from '../../types';
import * as React from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx';
import Date from '../../utils/Date';
import { CAPTION, LANG } from '../../constants/Caption';
import { CurriculumType } from '../../types';

export interface ILessonListHeader {
  teacherDisplayName: string;
  classStudentList?: MemberDataType[]|undefined;
  selectedClass: ClassesType|undefined;
  unitList: CurriculumType[]|undefined;
  studentCnt: number;
  entryCnt: number;
  classOpen: boolean;
  showStudentListPage?: () => void;
  showExtraActivityPopup?: () => void;
  onOpenClass?: () => void;
  showClassSettingPopup?: () => void;
}

@observer
export default class LessonListHeader extends React.Component<ILessonListHeader> {
  constructor(props: ILessonListHeader) {
    super(props);
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
    const { selectedClass, classStudentList,  entryCnt, studentCnt, classOpen, showStudentListPage, showExtraActivityPopup } = this.props;

    let classDisplayName = '';
    if (selectedClass) classDisplayName = selectedClass.name;

    return (
      <dl className="classinfo">
        <dt>
          <b>
            <span className="cname">{classDisplayName}</span>
            <span className="tname">
              {this.props.teacherDisplayName}
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
            {showExtraActivityPopup && (
              <p className="activity" onClick={showExtraActivityPopup}>
                {CAPTION[LANG].SPECIAL_ACTIVITY}
              </p>
            )}
          </div>
        </dd>
      </dl>
    );
  }
}
