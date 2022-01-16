import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import { WSStore } from '../../stores/wsStore';
import StudentList from './StudentList';
import { ClassesType, MemberDataType, DisplayMode, AccountState, ClassSettingItem } from '../../types';
import { DEFAULT_DISPLAY_MODE } from '../../constants';
import { CAPTION, LANG } from '../../constants/Caption';
import sessionStorageManager from '../../utils/SessionStorageManager';
import './EngStudentListPage.scss';

export interface IEngStudentListPage {
  wsStore: WSStore;
  onClose?: () => void;
}

@observer
export default class EngStudentListPage extends React.Component<IEngStudentListPage> {
  @observable private selectedClass:ClassesType|undefined = undefined;
  @observable private studentCnt: number = 0;
  @observable private entryCnt: number = 0;

  @observable private displayMode:DisplayMode = DEFAULT_DISPLAY_MODE;
  private diplayModeSetting: ClassSettingItem|undefined = undefined;
  private bgImg = '';

  @observable private allStudents: MemberDataType[] = [];
  @observable private studentStates: AccountState[] = [];

  constructor(props: IEngStudentListPage) {
    super(props);
  }

  public componentDidMount() {
    const { classList, allStudentList, loginStudentList, curClassId, studentCnt, entryCnt, classSettings, classOpen } = this.props.wsStore;

    if(classList && curClassId > 0) this.selectedClass = classList.find(item => item.id === curClassId);
    if(this.selectedClass) this.studentCnt = this.selectedClass.memberCount;

    if(classOpen) {
      if(this.studentCnt === 0) this.studentCnt = studentCnt;
      this.entryCnt = entryCnt;
      this.props.wsStore.setNotifyAppStateForStudentList(this.onNotifyAppStateForStudentList);
    }

    if(classSettings) {
      this.diplayModeSetting = classSettings.find(item => item.groupCd === 'CC01' && item.useYn === 'Y');
      if(this.diplayModeSetting) {
        if(this.diplayModeSetting.code === 'CC0101') this.displayMode = DisplayMode.DEFAULT_THUMB_N_NAME;
        else if(this.diplayModeSetting.code === 'CC0102') this.displayMode = DisplayMode.PROFILE_THUMB_N_NICKNAME;
      }
      this.bgImg = '';
      const classSetting = classSettings.find(item => item.code === 'CC0501');
      if(classSetting && classSetting.files) {
        const seletedBgFile = classSetting.files.find(file => file.selected === 'Y');
        if(seletedBgFile) this.bgImg = seletedBgFile.filePath;
      }

    } else this.diplayModeSetting = undefined;

    while(this.allStudents.length > 0) this.allStudents.pop();
    while(this.studentStates.length > 0) this.studentStates.pop();

    if(allStudentList) {
      if(loginStudentList) {
        allStudentList.map((allstudent, i) => {
          this.allStudents.push(allstudent);
          let student = loginStudentList.find(logingstudent => logingstudent.id === allstudent.id);
          if(student) this.studentStates.push(AccountState.IN_CLASS);
          else this.studentStates.push(AccountState.LOGOUT);
        });
      } else {
        allStudentList.map((allstudent, i) => {
          this.allStudents.push(allstudent);
          this.studentStates.push(AccountState.LOGOUT);
        });
      }
    }
    this.props.wsStore.setNotifyAllStudentList(this.onNotifyAllStudentList);
    this.props.wsStore.setNotifyLoginStudentList(this.onNotifyLoginStudentList);
  }

  public onNotifyAppStateForStudentList = (msg: any) => {
    // if(msg.studentCnt !== this.studentCnt) this.studentCnt = msg.studentCnt;
    if(msg.entryCnt !== this.entryCnt) this.entryCnt =  msg.entryCnt;

    let loginData = { type: 'getLoginStudentsProfile', from: "content", srcFrame: 'navi', msg:''};
    this.props.wsStore.sendPostMessage(loginData);
  }
  
  public onNotifyAllStudentList = () => {
    const { allStudentList} = this.props.wsStore;

    while(this.allStudents.length > 0) this.allStudents.pop();
    while(this.studentStates.length > 0) this.studentStates.pop();

    if(allStudentList) {
      allStudentList.map((allstudent, i) => {
        this.allStudents.push(allstudent);
        this.studentStates.push(AccountState.LOGOUT);
      });
    }
  }

  public onNotifyLoginStudentList = () => {
    const { allStudentList, loginStudentList } = this.props.wsStore;

    while(this.allStudents.length > 0) this.allStudents.pop();
    while(this.studentStates.length > 0) this.studentStates.pop();

    if(allStudentList) {
      if(loginStudentList) {
        allStudentList.map((allstudent, i) => {
          this.allStudents.push(allstudent);
          let student = loginStudentList.find(logingstudent => logingstudent.id === allstudent.id);
          if(student) this.studentStates.push(AccountState.IN_CLASS);
          else this.studentStates.push(AccountState.LOGOUT);
        });
      } else {
        allStudentList.map((allstudent, i) => {
          this.allStudents.push(allstudent);
          this.studentStates.push(AccountState.LOGOUT);
        });
      }
    }
  }

  onChangeDisplayMode(displayMode: DisplayMode) {
    if(this.displayMode === displayMode) return;
    this.displayMode = displayMode;

    const { curClassId, classSettings} = this.props.wsStore;
    if(curClassId) {
      let changedClassSettings: ClassSettingItem[] = [];
      let code = '';
      if(this.displayMode === DisplayMode.DEFAULT_THUMB_N_NAME) code = 'CC0101';
      else if(this.displayMode === DisplayMode.PROFILE_THUMB_N_NICKNAME) code = 'CC0102';

      if(this.diplayModeSetting && code !== '') {
        const diplayModeSetting: ClassSettingItem = {
          groupNm: this.diplayModeSetting.groupNm,
          code,
          useYn: 'Y',
          groupCd: this.diplayModeSetting.groupCd,
          classSettingsIdx: this.diplayModeSetting.classSettingsIdx
        }
        changedClassSettings.push(diplayModeSetting);
        
        const settings = JSON.parse(JSON.stringify(changedClassSettings))
        let data = { type: 'saveClassSettings', from: "content", srcFrame: 'navi', msg: {classid: curClassId, settings: settings}};
        this.props.wsStore.sendPostMessage(data);
      }

      // send classsetting to teaching tool
      // const settingObj = sessionStorageManager.getItem('classSetting_' + curClassId);
      // let inTime = false;
      // if(settingObj && settingObj.enddate) {
      //   const now = new Date();
      //   let enddate = new Date(settingObj.enddate);
      //   if(now.getTime() <= enddate.getTime()) inTime = true;
      // }
      // console.log('=====> onChangeDisplayMode intime', inTime);
      // if(inTime) {
      //   if(settingObj.selectedBgImg && settingObj.selectedBgImg != '') this.bgImg = settingObj.selectedBgImg;
      // } 

      let lessonMode = undefined;
      if(classSettings) {
        const learningModeSetting = classSettings.find(item => item.groupCd === 'CC02' && item.useYn === 'Y');
        if(learningModeSetting)  lessonMode = learningModeSetting.code;
      }

      let senddata = { type: 'internalMsg', from: "content", srcFrame: 'navi', 
        msg: { 
          to: 'teaching', 
          info: { 
            type: 'notifyClassSetting',
            diplayMode: displayMode,
            bgImg: this.bgImg,
            lessonMode: lessonMode,
          }
        }
      };
      this.props.wsStore.sendPostMessage(senddata);
    }
  }

  render() {
    const { onClose } = this.props;
    const { classList, allStudentList, loginStudentList, curClassId } = this.props.wsStore;

    let curClassName = '';
    let levelDisplayName = '';
    
    if(this.selectedClass) {
      curClassName = this.selectedClass.name;
      levelDisplayName = this.selectedClass.product.name;
    }

    return (
      <div className="wrap" style={{width: '1280px', height:'800px', position:'absolute', backgroundColor: 'white', left: 0, top: 0}}>
        <div className="stu_popup">
          <div className="stu_popup_title">
            <p>
              {curClassName} <b>{CAPTION[LANG].STUDENTS}</b>
            </p>
            <span className="close" onClick={onClose}></span>
          </div>
          <div className="stu_popup_info">
            <div className="cnt">
              <div className="login">
                <p>
                  {CAPTION[LANG].PARTICIPATE}
                  <b>{this.entryCnt}</b>
                </p>
              </div>
              <div className="all">
                <p>
                  {CAPTION[LANG].ALL} <b>{this.studentCnt}</b>
                </p>
              </div>
            </div>
            <div className="level">{levelDisplayName}</div>
          </div>
          <div className="stu_popup_wrap">
            <div className="display">
              <dl>
                <dt>
                  <b>{CAPTION[LANG].DISPLAY_MODE}</b>
                  <span>{CAPTION[LANG].DISPLAY_MODE_SENTENCE}</span>
                </dt>
                <dd>
                  <ul>
                    <li
                      className={`${this.displayMode === DisplayMode.DEFAULT_THUMB_N_NAME ? 'select' : ''}`}
                      onClick={() => this.onChangeDisplayMode(DisplayMode.DEFAULT_THUMB_N_NAME)}
                    >
                      <div>
                        <p className="img">
                          <img src="images/tmp11.jpg" />
                        </p>
                        <span className="name">{CAPTION[LANG].NAME}</span>
                        <em></em>
                      </div>
                    </li>
                    <li
                      className={`${this.displayMode === DisplayMode.PROFILE_THUMB_N_NICKNAME ? 'select' : ''}`}
                      onClick={() => this.onChangeDisplayMode(DisplayMode.PROFILE_THUMB_N_NICKNAME)}
                    >
                      <div>
                        <p className="img bg"></p>
                        <span className="name nstar">{CAPTION[LANG].NICKNAME}</span>
                        <em></em>
                      </div>
                    </li>
                  </ul>
                </dd>
              </dl>
            </div>
            <StudentList allStudents={this.allStudents} studentStates={this.studentStates} displayMode={this.displayMode}/>
          </div>
        </div>
        <div id="pageMask" style={{ display: 'block' }}></div>
      </div>
    );
  }
}
