import { observer } from 'mobx-react'
import * as React from 'react'
import { observable } from 'mobx';
import { ClassSettingItem, ClassSettingItemFile, ClasSettingSessionStorage, DisplayMode } from '../../types';
import ClassSettingBackground from './ClassSettingBackground';
import { CAPTION, LANG } from '../../constants/Caption';
import { Z_INDEX_LESSON_COMPLETE_POPUP } from '../../constants';
import { WSStore } from '../../stores/wsStore';
import sessionStorageManager from '../../utils/SessionStorageManager';
import DeviceSettingPopup from '../DeviceSetting/DeviceSettingPopup';
import './ClassSettingPopup.scss';

export interface IClassSettingPopup {
  view: boolean;
  wsStore: WSStore;
  selectedClassId: number;
  inClass?: boolean; 
  onClose: () => void;
}

@observer
export default class ClassSettingPopup extends React.Component<IClassSettingPopup> {
  @observable private selectedBgId: string = '';
  @observable private curClassName: string = '';
  @observable private levelDisplayName: string = '';
  @observable private totalStudentCnt: number = 0;

  @observable private lessonMode = '';
  @observable private teacherSetting = '';
  @observable private studentSetting = '';
  @observable private bglist: ClassSettingItemFile[] = [];
  private bgImg: string = '';
  @observable private todayOnly = false;
  @observable private isVisibleDeviceSetting = false;

  @observable public access_key_id: string = '';
	@observable public secret_access_key: string = '';

  componentDidMount() {
    this.getDerivedClass();
  }

  public componentDidUpdate(prev: IClassSettingPopup) {
    console.log("=========== !prev.view && this.props.view", !prev.view && this.props.view);
    if(!prev.view && this.props.view) {
      this.getDerivedClass();
    }
  }

  onClickClose = () => {
    this.hidePopup();
  };

  onClickLessonMode = (lessonMode: string) => {
    this.lessonMode = lessonMode;

    if(this.lessonMode === 'CC0201') {
      this.teacherSetting = '';
      this.studentSetting = '';
    } else if(this.lessonMode === 'CC0202') {
      if(this.teacherSetting === '') this.teacherSetting = 'all';
      if(this.studentSetting === '') this.studentSetting = 'all';
    }
  };
  onClickTeacherSetting = (teacherSetting: string) => {
    this.teacherSetting = teacherSetting;
  };
  onClickStudentSetting = (studentSetting: string) => {
    this.studentSetting = studentSetting;
  };
  onClickBg = (selectedFile: ClassSettingItemFile) => {
    const { classList } = this.props.wsStore;
    const { selectedClassId } = this.props;
    if (!classList || !selectedClassId) return;

    const foundClass = classList.find(item => item.id === selectedClassId);
    if (!foundClass) return;

    this.selectedBgId = selectedFile.classSettingsIdx;
    this.bgImg = selectedFile.filePath;
  };
  onClickTodayOnly = () => {
    this.todayOnly = !this.todayOnly;
  };
  onClickApply = () => {
    let lessonModeChange: ClassSettingItem|undefined = undefined;
    // let teacherSettingChange_v: ClassSettingItem|undefined = undefined;
    // let teacherSettingChange_a: ClassSettingItem|undefined = undefined;
    // let studentSettingChange_v: ClassSettingItem|undefined = undefined;
    // let studentSettingChange_a: ClassSettingItem|undefined = undefined;
    let backgroundImageChange: ClassSettingItem|undefined = undefined;

    if(this.lessonMode === 'CC0202' && this.access_key_id === "") {
      let data = { type: 'alert', from: "content", srcFrame: 'navi', msg: CAPTION[LANG].NOZOOMKEYALERT }
      this.props.wsStore.sendPostMessage(data);
      return;
    }

    let displayMode = DisplayMode.DEFAULT_THUMB_N_NAME;
    const { classSettings, access_key_id, secret_access_key } = this.props.wsStore;
    if (classSettings) {
      classSettings.map((item, iidx) => {
        if(item.groupCd === 'CC01') {
          if(item.useYn === 'Y') {
            if(item.code === 'CC0101') displayMode = DisplayMode.DEFAULT_THUMB_N_NAME;
            else if(item.code === 'CC0102') displayMode = DisplayMode.PROFILE_THUMB_N_NICKNAME;
          }    
        } else if(item.groupCd === 'CC02') {
          if(item.useYn === 'Y' && this.lessonMode !== item.code) {
            lessonModeChange = {
              groupNm: item.groupNm,
              code: this.lessonMode,
              useYn: 'Y',
              groupCd: item.groupCd,
              classSettingsIdx: item.classSettingsIdx
            };
          }
        } else if(item.code === 'CC0301') {
          // if(this.teacherSetting === 'all') {
          //   teacherSettingChange_v = {
          //     groupNm: item.groupNm,
          //     code: item.code,
          //     useYn: 'Y',
          //     groupCd: item.groupCd,
          //     classSettingsIdx: item.classSettingsIdx
          //   };
          // } else if(item.useYn === 'Y') {
          //   teacherSettingChange_v = {
          //     groupNm: item.groupNm,
          //     code: item.code,
          //     useYn: 'N',
          //     groupCd: item.groupCd,
          //     classSettingsIdx: item.classSettingsIdx
          //   };
          // }
        } else if(item.code === 'CC0302') {
          // if(this.teacherSetting === 'all' || this.teacherSetting === 'audio') {
          //   teacherSettingChange_a = {
          //     groupNm: item.groupNm,
          //     code: item.code,
          //     useYn: 'Y',
          //     groupCd: item.groupCd,
          //     classSettingsIdx: item.classSettingsIdx
          //   };
          // } else if(item.useYn === 'Y') {
          //   teacherSettingChange_a = {
          //     groupNm: item.groupNm,
          //     code: item.code,
          //     useYn: 'N',
          //     groupCd: item.groupCd,
          //     classSettingsIdx: item.classSettingsIdx
          //   };
          // }        
        } else if(item.code === 'CC0401') {
          // if(this.studentSetting === 'all') {
          //   studentSettingChange_v = {
          //     groupNm: item.groupNm,
          //     code: item.code,
          //     useYn: 'Y',
          //     groupCd: item.groupCd,
          //     classSettingsIdx: item.classSettingsIdx
          //   }
          // } else if(item.useYn === 'Y') {
          //   studentSettingChange_v = {
          //     groupNm: item.groupNm,
          //     code: item.code,
          //     useYn: 'N',
          //     groupCd: item.groupCd,
          //     classSettingsIdx: item.classSettingsIdx
          //   }
          // } 
        } else if(item.code === 'CC0402') {
          // if(this.studentSetting === 'all' || this.studentSetting === 'audio') {
          //   studentSettingChange_a = {
          //     groupNm: item.groupNm,
          //     code: item.code,
          //     useYn: 'Y',
          //     groupCd: item.groupCd,
          //     classSettingsIdx: item.classSettingsIdx
          //   }
          // } else if(item.useYn === 'Y') {
          //   studentSettingChange_a = {
          //     groupNm: item.groupNm,
          //     code: item.code,
          //     useYn: 'N',
          //     groupCd: item.groupCd,
          //     classSettingsIdx: item.classSettingsIdx
          //   }
          // }         
        } else if(item.code === 'CC0501' && item.files) {
          const classSettingFile = item.files.find(file => file.selected === 'Y');
          if(classSettingFile && this.selectedBgId !== classSettingFile.classSettingsIdx) {
            const changedClassSettingFile = item.files.find(file => file.classSettingsIdx === this.selectedBgId);
            if(changedClassSettingFile) {
              // let file = {
              //   classSettingsIdx: changedClassSettingFile.classSettingsIdx,
              //   filePath: changedClassSettingFile.filePath,
              //   orderNum: changedClassSettingFile.orderNum,
              //   selected: 'Y',
              // };
              backgroundImageChange = {
                groupNm: item.groupNm,
                code: item.code,
                useYn: 'Y',
                groupCd: item.groupCd,
                classSettingsIdx: changedClassSettingFile.classSettingsIdx
              };
            }
          } else if(item.files.length > 0 && this.selectedBgId !== '') {
            const changedClassSettingFile = item.files.find(file => file.classSettingsIdx === this.selectedBgId);
            if(changedClassSettingFile) {
              backgroundImageChange = {
                groupNm: item.groupNm,
                code: item.code,
                useYn: 'Y',
                groupCd: item.groupCd,
                classSettingsIdx: changedClassSettingFile.classSettingsIdx
              };
            }
          }
        }
      });
    }

    if(this.todayOnly) {
      // Save SessionStorage 
      const now = new Date();
      let settingObj: ClasSettingSessionStorage = {
        lessonMode: this.lessonMode,
        teacherSetting: this.teacherSetting,
        studentSetting: this.studentSetting,
        selectedBgId: this.selectedBgId,
        selectedBgImg: this.bgImg,
        enddate: now.setDate(now.getDate() + 1)
      }; 
      sessionStorageManager.setItem('classSetting_' + this.props.selectedClassId, settingObj);
    } else {
      // Send to LMS Server 
      let changedClassSettings: ClassSettingItem[] = [];
      if(lessonModeChange) changedClassSettings.push(lessonModeChange);
      // if(teacherSettingChange_v) changedClassSettings.push(teacherSettingChange_v);
      // if(teacherSettingChange_a) changedClassSettings.push(teacherSettingChange_a);
      // if(studentSettingChange_v) changedClassSettings.push(studentSettingChange_v);
      // if(studentSettingChange_a) changedClassSettings.push(studentSettingChange_a);
      if(backgroundImageChange) changedClassSettings.push(backgroundImageChange);

      if(changedClassSettings.length > 0 
        || (this.access_key_id !== "" && access_key_id !== this.access_key_id) 
        || (this.secret_access_key !== "" && secret_access_key !== this.secret_access_key) ) {
        const settings = JSON.parse(JSON.stringify(changedClassSettings))
        let data = { 
          type: 'saveClassSettings', 
          from: "content", 
          srcFrame: 'navi', 
          msg: {classid: this.props.selectedClassId, settings: settings, access_key_id: this.access_key_id, secret_access_key: this.secret_access_key}}
        ;
        this.props.wsStore.sendPostMessage(data);

        // 
        let senddata = { type: 'internalMsg', from: "content", srcFrame: 'navi', 
          msg: { 
            to: 'teaching', 
            info: { 
              type: 'notifyClassSetting',
              diplayMode: displayMode,
              bgImg: this.bgImg,
              lessonMode: this.lessonMode,
            }
          }
        };
        this.props.wsStore.sendPostMessage(senddata);
      }
      // sessionStorageManager.clear();
    }
    this.hidePopup();
  };

  hidePopup() {
    if(!this.props.inClass) {
      this.props.wsStore.classSettings = undefined;
      this.props.wsStore.access_key_id = "";
      this.props.wsStore.secret_access_key = "";
    }
    if (this.props.onClose) this.props.onClose();
  }

  getDerivedClass() {
    const { classList, classSettings, access_key_id, secret_access_key } = this.props.wsStore;
    const { selectedClassId } = this.props;
    console.log('getDerivedClass selectedClassId', selectedClassId);
    console.log('getDerivedClass wsStore', classList, classSettings, access_key_id, secret_access_key);

    if (classList && selectedClassId) {
      const selectedClass = classList.find(item => item.id === selectedClassId);
      if (selectedClass) {
        if (selectedClass.study) {
          this.curClassName = selectedClass.name;
          this.levelDisplayName = selectedClass.product.name;
          this.totalStudentCnt = selectedClass.memberCount;
        }
      }
    }

    // const settingObj = sessionStorageManager.getItem('classSetting_' + this.props.selectedClassId);
    // let inTime = false;
    // if(settingObj && settingObj.enddate) {
    //   const now = new Date();
    //   let enddate = new Date(settingObj.enddate);
    //   if(now.getTime() <= enddate.getTime()) inTime = true;
    // }
    // console.log('=====> sessionStorageManager', inTime);
    // if(inTime) {
    //   if(settingObj.lessonMode && settingObj.lessonMode !== '') this.lessonMode = settingObj.lessonMode;
    //   if(settingObj.teacherSetting && settingObj.teacherSetting !== '') this.teacherSetting = settingObj.teacherSetting;
    //   if(settingObj.studentSetting && settingObj.studentSetting !== '') this.studentSetting = settingObj.studentSetting;
    //   if(settingObj.selectedBgId && settingObj.selectedBgId !== '') this.selectedBgId = settingObj.selectedBgId;
    //   if(settingObj.selectedBgImg && settingObj.selectedBgImg !== '') this.bgImg = settingObj.selectedBgImg;
    //   this.todayOnly = true;
    //   if(classSettings) {
    //     const classSetting = classSettings.find((item) => item.code === 'CC0501');
    //     if(classSetting && classSetting.files) this.bglist = classSetting.files;
    //   }
    //} else 
    if(classSettings) {
      // let teacherSetting_v = false;
      // let teacherSetting_a = false;
      // let studentSetting_v = false;
      // let studentSetting_a = false;

      classSettings.map((item, iidx) => {
        if(item.groupCd === 'CC02' && item.useYn === 'Y') this.lessonMode = item.code;
        // else if(item.code === 'CC0301' && item.useYn === 'Y') teacherSetting_v = true;
        // else if(item.code === 'CC0302' && item.useYn === 'Y') teacherSetting_a = true;
        // else if(item.code === 'CC0401' && item.useYn === 'Y') studentSetting_v = true;
        // else if(item.code === 'CC0402' && item.useYn === 'Y') studentSetting_a = true;
        else if(item.code === 'CC0501' && item.files) {
          this.bglist = item.files
          const classSettingFile = item.files.find(file => file.selected === 'Y');
          if(classSettingFile) {
            this.selectedBgId = classSettingFile.classSettingsIdx;
            this.bgImg = classSettingFile.filePath;
          } else {
            const classSettingFile_1 = item.files.find(file => file.orderNum === '1');
            if(classSettingFile_1) {
              this.selectedBgId = classSettingFile_1.classSettingsIdx;
              this.bgImg = classSettingFile_1.filePath;
            }
          }
        }
      });
      
      // if(teacherSetting_v && teacherSetting_a) this.teacherSetting = 'all';
      // else if(!teacherSetting_v && teacherSetting_a) this.teacherSetting = 'audio';
      // else this.teacherSetting = '';

      // if(studentSetting_v && studentSetting_a) this.studentSetting = 'all';
      // else if(!studentSetting_v && studentSetting_a) this.studentSetting = 'audio';
      // else this.studentSetting = '';
    }

    console.log('getDerivedClass', access_key_id, secret_access_key);
    if(access_key_id !== "" || secret_access_key !== "" ) {
      this.access_key_id = access_key_id;
      this.secret_access_key = secret_access_key;
    }
  }

  openDeviceCheckPopup = () => {
    let data = { type: 'getDevice', from: "content", srcFrame: 'navi', msg: ''};
    this.props.wsStore.sendPostMessage(data);

    this.isVisibleDeviceSetting = true;
  }
  closeDeviceCheckPopup = () => {
    this.isVisibleDeviceSetting = false;
  }

  onChangeAccessKeyId = (evt: any) => {
    if (!evt.target) return;
    const tgt = evt.target as HTMLInputElement;
    if (tgt) this.access_key_id = tgt.value;
  }
  onChangeSecretAccessKey = (evt: any) => {
    if (!evt.target) return;
    const tgt = evt.target as HTMLInputElement;
    if (tgt) this.secret_access_key = tgt.value;
  }

  render() {
    const { classList, account } = this.props.wsStore;
    const teacherDisplayName = account ? account.name : '';

    return (
      <>
      <div id="contentToolContainer" style={{display : this.props.view ? 'block' : 'none'}}>
        <div id="pageMask" style={{ zIndex: Z_INDEX_LESSON_COMPLETE_POPUP }}>
          <div className="stu_popup">
            <div className="stu_popup_title">
              <b>{CAPTION[LANG].CLASS_SETTING}</b>
              <span className="close" onClick={this.onClickClose} />
            </div>
            <div className="class_set">
              <ul>
                <li>
                  {CAPTION[LANG].CLASS} <b>{this.curClassName}</b>
                </li>
                <li>
                  {CAPTION[LANG].LEVEL} <b>{this.levelDisplayName}</b>
                </li>
                <li>
                  {CAPTION[LANG].TEACHER} <b>{teacherDisplayName}</b>
                </li>
                <li>
                  {CAPTION[LANG].STUDENTS}{' '}
                  <b>
                    {CAPTION[LANG].TOTAL}&nbsp;{this.totalStudentCnt}
                  </b>
                </li>
              </ul>
            </div>
            <div className="stu_popup_wrap">
              <div className="cnt_l">
                  <div className="choice">
                      <div className="set_tit">{CAPTION[LANG].LEARNING_MODE}</div>
                      <div className="set_choice">
                          <button type="button" className={this.lessonMode === 'CC0201' ? "on" : undefined} onClick={this.onClickLessonMode.bind(this, 'CC0201')}>{CAPTION[LANG].INCLASS}</button>
                          <div className="remote">
                            <button type="button" className={this.lessonMode === 'CC0202' ? "on" : undefined} onClick={this.onClickLessonMode.bind(this, 'CC0202')}>{CAPTION[LANG].REMOTE}</button>
                            {/* <button type="button" className="btn_dv_chk" style={{display: this.lessonMode === 'CC0202' ? 'block' : 'none'}} onClick={this.openDeviceCheckPopup}/> 강사에서 디바이스 체크 버튼을 무조건 비노출 수정(2021.06.21) */}  
                          </div>
                      </div>
                  </div>
                  <div className={'remote_content ' + (this.lessonMode === 'CC0201' ? 'dim' : '')}>
                    <div className="set_tit">Zoom Meeting Information</div>
                    <div>
                        <div className="zoom_info">
                            <h3>Meeting ID</h3>
                            <input type="text" disabled={this.lessonMode === 'CC0201'} value={this.lessonMode === 'CC0201' ? "" : this.access_key_id} onChange={this.onChangeAccessKeyId}/>
                        </div>
                        <div className="zoom_info">
                            <h3>Password</h3>
                            <input type="text" disabled={this.lessonMode === 'CC0201'} value={this.lessonMode === 'CC0201' ? "" : this.secret_access_key} onChange={this.onChangeSecretAccessKey}/>
                        </div>
                    </div>
                  </div>
                  {/* <div className="choice">
                      <div className="set_tit">{CAPTION[LANG].TEACHER_SETTING}</div>
                      <div className="set_choice">
                          <button type="button" className={this.lessonMode === 'CC0201' ? "disable" : this.teacherSetting === 'all' ? "on" : undefined} onClick={this.lessonMode === 'CC0201' ? undefined : this.onClickTeacherSetting.bind(this, 'all')}>{CAPTION[LANG].VIDEO} &<br/>{CAPTION[LANG].AUDIO}</button>
                          <button type="button" className={this.lessonMode === 'CC0201' ? "disable" : this.teacherSetting === 'audio' ? "on" : undefined} onClick={this.lessonMode === 'CC0201' ? undefined : this.onClickTeacherSetting.bind(this, 'audio')}>{CAPTION[LANG].AUDIO_ONLY}</button>
                      </div>
                  </div>
                  <div className="choice">
                      <div className="set_tit">{CAPTION[LANG].STUDENT_SETTING}</div>
                      <div className="set_choice">
                          <button type="button" className={this.lessonMode === 'CC0201' ? "disable" : this.studentSetting === 'all' ? "on" : undefined} onClick={this.lessonMode === 'CC0201' ? undefined : this.onClickStudentSetting.bind(this, 'all')}>{CAPTION[LANG].VIDEO} &<br/>{CAPTION[LANG].AUDIO}</button>
                          <button type="button" className={this.lessonMode === 'CC0201' ? "disable" : this.studentSetting === 'audio' ? "on" : undefined} onClick={this.lessonMode === 'CC0201' ? undefined : this.onClickStudentSetting.bind(this, 'audio')}>{CAPTION[LANG].AUDIO_ONLY}</button>
                      </div>
                  </div> */}
                  {/*  
                  <p className="exp">
                      <span>※</span>{CAPTION[LANG].VIDEO_SETMSG}
                  </p>
                  <div className="check">
                      <div>
                          <button type="button" className={'btn_chk ' + (this.todayOnly ? 'checked' : '')} onClick={this.onClickTodayOnly}></button>
                          <span onClick={this.onClickTodayOnly}>{CAPTION[LANG].ONLY_CLASS}</span>
                      </div>
                  </div>
                  */}
              </div>
              <ClassSettingBackground 
                selectedBgId={this.selectedBgId}
                bgList={this.bglist}
                onClickBg={this.onClickBg} 
              />
              <button type="button" className="btn_apply" onClick={this.onClickApply}>{CAPTION[LANG].APPLY.toUpperCase()}</button>
            </div>
          </div>
        </div>
      </div>
      {this.isVisibleDeviceSetting && <DeviceSettingPopup wsStore={this.props.wsStore} onClose={this.closeDeviceCheckPopup}/>}
      </>
    );
  }
}
