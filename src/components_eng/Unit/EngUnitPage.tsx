import { observer } from 'mobx-react'
import * as React from 'react'
import { observable } from 'mobx';
import { WSStore } from '../../stores/wsStore'
import { ClassesType, CurriculumType, ClasSettingSessionStorage } from '../../types';
import { CLASS_LIST_DISPLAY_CNT_PER_PAGE } from '../../constants/index';
import MenuBar from '../menu/MenuBar';
import UnitListHeader from './UnitListHeader';
import UnitList from './UnitList';
import EngStudentListPage from '../StudentList/EngStudentListPage';
import ThreeMinActivityPopup from '../ExtraActivity/ThreeMinActivityPopup';
import sessionStorageManager from '../../utils/SessionStorageManager';
import ClassSettingPopup from '../ClassSetting/ClassSettingPopup';
import { DisplayMode } from '../../types';
import './EngUnitPage.scss';

const Swiper = require('react-id-swiper').default;

interface IEngUnitPage {
  wsStore: WSStore;
  classId: number;
  history: any;
  gotoLesson?: () => void;
  gotoUnit?: () => void;
  gotoHome?: () => void;
}

@observer
export class EngUnitPage extends React.Component<IEngUnitPage> {
  @observable private curPage: number = 1;
  @observable private selectedClass:ClassesType|undefined = undefined;
  @observable private level:CurriculumType|undefined = undefined;
  @observable private isVisibleStudentList: boolean = false;
  @observable private isVisibleExtraActivity: boolean = false;
  @observable private isVisibleClassSetting: boolean = false;
  @observable private studentCnt: number = 0;
  @observable private entryCnt: number = 0;

  // @observable private lessonMode = '';
  // @observable private teacherSetting = '';
  // @observable private studentSetting = '';
  private displayMode = 0;
  @observable private bgImg = '';
  @observable private inTime = false;

  constructor(props: IEngUnitPage) {
    super(props);
  }

  showStudentListPage = () => {
    this.isVisibleStudentList = true;
    console.log('=========>showStudentListPage', this.props.wsStore.allStudentList, this.props.wsStore.classOpen)
    if(!this.props.wsStore.allStudentList || this.props.wsStore.allStudentList.length === 0 || !this.props.wsStore.classOpen) {
      let data1 = { type: 'getAllStudentsProfile', from: "content", srcFrame: 'navi', msg:''};
      this.props.wsStore.sendPostMessage(data1);
    }
    let data2 = { type: 'getLoginStudentsProfile', from: "content", srcFrame: 'navi', msg:''};
    this.props.wsStore.sendPostMessage(data2);
  }
  closeStudentListPage = () => this.isVisibleStudentList = false;
  showExtraActivityPopup = () => {
    this.isVisibleExtraActivity = true;

    // let data = { type: 'getExtraActivityInfo', from: "content", srcFrame: 'navi', msg:''};
    // this.props.wsStore.sendPostMessage(data);
  }
  closeExtraActivityPopup = () => this.isVisibleExtraActivity = false;
  
  showClassSettingPopup = () => {
    this.isVisibleClassSetting = true;
    let data = { type: 'getClassSettings', from: "content", srcFrame: 'navi', msg: {classid: this.props.classId} }
    this.props.wsStore.sendPostMessage(data);
    this.props.wsStore.setNotifyClassSettingsInUnit(this.onNotifyClassSettingsInUinit);
  }
  public onNotifyClassSettingsInUinit = (msg: any) => {
    if(!msg.classid || msg.classid !== this.props.classId) return;
    this.props.wsStore.setNotifyClassSettingsInUnit(null);
    this.isVisibleClassSetting = true;
  }
  closeClassSettingPopup = () => this.isVisibleClassSetting = false;

  public componentDidMount() {
    if(this.props.classId < 1) return;

    const { classList, curriculum, studentCnt, entryCnt, classSettings, classOpen, allStudentList } = this.props.wsStore;

    if(classList) this.selectedClass = classList.find(item => item.id === this.props.classId);
    if(this.selectedClass) this.studentCnt = this.selectedClass.memberCount;
    if(curriculum !== undefined) this.level = curriculum;

    if(classOpen) {
      if(this.studentCnt === 0) this.studentCnt = studentCnt;
      this.entryCnt = entryCnt;
      this.props.wsStore.setNotifyAppStateForUnit(this.onNotifyAppStateForUnit);
    }

    // const settingObj = sessionStorageManager.getItem('classSetting_' + this.props.classId);
    // this.inTime = false;
    // if(settingObj && settingObj.enddate) {
    //   const now = new Date();
    //   let enddate = new Date(settingObj.enddate);
    //   if(now.getTime() <= enddate.getTime()) this.inTime = true;
    // }
    // console.log('=====> sessionStorageManager', this.inTime);
    // if(this.inTime) {
    //   if(settingObj.selectedBgImg && settingObj.selectedBgImg != '') this.bgImg = settingObj.selectedBgImg;
    // } else 
    if(classSettings) {
      const diplayModeSetting = classSettings.find(item => item.groupCd === 'CC01' && item.useYn === 'Y');
      if(diplayModeSetting) {
        if(diplayModeSetting.code === 'CC0101') this.displayMode = DisplayMode.DEFAULT_THUMB_N_NAME;
        else if(diplayModeSetting.code === 'CC0102') this.displayMode = DisplayMode.PROFILE_THUMB_N_NICKNAME;
      }

      const learningModeSetting = classSettings.find(item => item.groupCd === 'CC02' && item.useYn === 'Y');
      let lessonMode = "CC0201";
      if(learningModeSetting)  lessonMode = learningModeSetting.code;

      const classSetting = classSettings.find(item => item.code === 'CC0501');
      if(classSetting && classSetting.files) {
        const seletedBgFile = classSetting.files.find(file => file.selected === 'Y');
        if(seletedBgFile) this.bgImg = seletedBgFile.filePath;
        else {
          const seletedBgFile_1 = classSetting.files.find(file => file.orderNum === '1');
          if(seletedBgFile_1) this.bgImg = seletedBgFile_1.filePath;
        }

        // send classsetting to teaching tool
        let senddata = { type: 'internalMsg', from: "content", srcFrame: 'navi', 
          msg: { 
            to: 'teaching', 
            info: { 
              type: 'notifyClassSetting',
              diplayMode: this.displayMode,
              bgImg: this.bgImg,
              lessonMode: lessonMode
            }
          }
        };
        this.props.wsStore.sendPostMessage(senddata);
      } 
    } else {
      this.props.wsStore.setNotifyClassSettingsForUnit(this.onNotifyClassSettingsForUnit)
    }
  }

  public componentDidUnMount() {
    // this.props.wsStore.setNotifyAppStateForUnit(null);
    this.props.wsStore.setNotifyClassSettingsForUnit(null);
  }

  public onNotifyAppStateForUnit = (msg: any) => {
    // if(msg.studentCnt !== this.studentCnt) this.studentCnt = msg.studentCnt;
    if(msg.entryCnt !== this.entryCnt) this.entryCnt =  msg.entryCnt;
  }

  public onNotifyClassSettingsForUnit = (msg: any) => {
    if(!msg.classid || msg.classid !== this.props.classId) return;
    const { classSettings } = this.props.wsStore;
    if(classSettings) {
      const diplayModeSetting = classSettings.find(item => item.groupCd === 'CC01' && item.useYn === 'Y');
      if(diplayModeSetting) {
        if(diplayModeSetting.code === 'CC0101') this.displayMode = DisplayMode.DEFAULT_THUMB_N_NAME;
        else if(diplayModeSetting.code === 'CC0102') this.displayMode = DisplayMode.PROFILE_THUMB_N_NICKNAME;
      }

      const learningModeSetting = classSettings.find(item => item.groupCd === 'CC02' && item.useYn === 'Y');
      let lessonMode = "CC0201";
      if(learningModeSetting)  lessonMode = learningModeSetting.code;

      const classSetting = classSettings.find(item => item.code === 'CC0501');
      if(classSetting && classSetting.files) {
        const seletedBgFile = classSetting.files.find(file => file.selected === 'Y');
        if(seletedBgFile) this.bgImg = seletedBgFile.filePath;
        else {
          const seletedBgFile_1 = classSetting.files.find(file => file.orderNum === '1');
          if(seletedBgFile_1) this.bgImg = seletedBgFile_1.filePath;
        }

        // send classsetting to teaching tool
        let senddata = { type: 'internalMsg', from: "content", srcFrame: 'navi', 
          msg: { 
            to: 'teaching', 
            info: { 
              type: 'notifyClassSetting',
              diplayMode: this.displayMode,
              bgImg: this.bgImg,
              lessonMode: lessonMode,
            }
          }
        };
        this.props.wsStore.sendPostMessage(senddata);
      } 
    }
  }

  onChangeSlide = (changedSlideIndex: number) => {
    this.curPage = changedSlideIndex + 1;
  };

  onClickUnit = (unitId: number) => {
    const { curriculum } = this.props.wsStore;
    if (!curriculum) return;

    this.props.wsStore.curUnitId = unitId;
    
    let data = { type: 'internalMsg', from: "content", srcFrame: 'navi', msg: { to: 'teaching', info: { type: 'notifyUnitInfo', unitId: unitId}}};
    this.props.wsStore.sendPostMessage(data);
    
    // this.props.wsStore.classSettings = undefined;
    // this.props.wsStore.access_key_id = "";
    // this.props.wsStore.secret_access_key = "";
    let settingData = { type: 'getClassSettings', from: "content", srcFrame: 'navi', msg: {classid: this.props.classId} }
		this.props.wsStore.sendPostMessage(settingData);

    if (this.props.gotoLesson) this.props.gotoLesson();
    else this.props.history.push('/Lesson/'+this.props.classId+'/'+unitId);
  };

  onOpenClass = () => {
    const { classOpen, studentCnt, entryCnt } = this.props.wsStore;
    if(classOpen) return;

    if(this.studentCnt === 0) this.studentCnt = studentCnt;
    this.entryCnt = entryCnt;
    this.props.wsStore.setNotifyAppStateForUnit(this.onNotifyAppStateForUnit);

    let data = { type: 'openClass', from: "content", srcFrame: 'navi', msg: ''};
    this.props.wsStore.sendPostMessage(data);
  }

  public gotoHome = () => {
    this.props.wsStore.gotoClass = false;
    this.props.wsStore.curClassId = 0;
    this.props.wsStore.curUnitId = 0;
    this.props.wsStore.curLessonId = 0;
    this.props.wsStore.studentCnt = 0;
    this.props.wsStore.entryCnt = 0;
    this.props.wsStore.classOpen = false;
    this.props.wsStore.curriculum = undefined;

    this.props.wsStore.classSettings = undefined;
    this.props.wsStore.access_key_id = "";
    this.props.wsStore.secret_access_key = "";

    let data = { type: 'exitClass', from: "content", srcFrame: 'navi', msg: '' }
    this.props.wsStore.sendPostMessage(data);
    
    if(this.props.gotoHome) this.props.gotoHome();
    else this.props.history.push('/');
  }

  public onLogOut = () => {
    this.props.wsStore.gotoClass = false;
    this.props.wsStore.curClassId = 0;
    this.props.wsStore.curUnitId = 0;
    this.props.wsStore.curLessonId = 0;
    this.props.wsStore.studentCnt = 0;
    this.props.wsStore.entryCnt = 0;
    this.props.wsStore.classOpen = false;
    this.props.wsStore.curriculum = undefined;

    let data = { type: 'logout', from: "content", srcFrame: 'navi', msg:''};
    this.props.wsStore.sendPostMessage(data);
    this.props.wsStore.account = undefined;
    if(this.props.gotoHome) this.props.gotoHome();
    else this.props.history.push("/");
  } 

  public onExitApp = () => {
    let data = { type: 'exitApp', from: "content", srcFrame: 'navi', msg:''};
    this.props.wsStore.sendPostMessage(data);
  }

  render() {
    const { account, classSettings, classOpen } = this.props.wsStore;

    let levelDisplayName;
    let totalPageCnt = 0;
    let totalEngUnitPageCnt = 0;
    let backgroundStyle: React.CSSProperties = {};
    if(this.bgImg !== '') {
      backgroundStyle.backgroundImage = `url(${this.bgImg})`;
      backgroundStyle.backgroundSize = 'cover';
    }
    if(!this.inTime && this.bgImg === '' && classSettings) {
      const classSetting = classSettings.find(item => item.code === 'CC0501');
      if(classSetting && classSetting.files) {
        const seletedBgFile = classSetting.files.find(file => file.selected === 'Y');
        if(seletedBgFile) {
          backgroundStyle.backgroundImage = `url(${seletedBgFile.filePath})`;
          backgroundStyle.backgroundSize = 'cover';
        }
      }
    }

    if(this.level) {
      levelDisplayName = this.level.name;
      if (this.level.childrenList && this.level.childrenList.length > 0) {
        totalEngUnitPageCnt = this.level.childrenList.length;
        totalPageCnt = Math.ceil(totalEngUnitPageCnt / CLASS_LIST_DISPLAY_CNT_PER_PAGE);
      }
    }

    return (
      <div id="wrap">
        <div className="wrapcont classwrap" style={backgroundStyle}>
          <MenuBar
            requestMoveHome={this.gotoHome}
            requestLogout={this.onLogOut}
            requestExit={this.onExitApp}
          />
          <UnitListHeader 
            teacherDisplayName={account ? account?.name : ''} 
            selectedClass={this.selectedClass} 
            studentCnt={this.studentCnt}
            entryCnt={this.entryCnt}
            classOpen={classOpen}
            showStudentListPage={this.showStudentListPage}
            showExtraActivityPopup={this.showExtraActivityPopup}
            onOpenClass={this.onOpenClass}
            showClassSettingPopup={this.showClassSettingPopup}
          />
          <div className="classlist_cnt">
            {false && <em>{totalEngUnitPageCnt}</em>}
            {levelDisplayName}
            <p className="page">
              <span>{this.curPage}</span> / <b>{totalPageCnt}</b>
            </p>
          </div>
          <UnitList
            classId={this.props.classId}
            totalPageCnt={totalPageCnt}
            unitList={this.level ? this.level.childrenList : undefined}
            onClickUnit={this.onClickUnit}
            onChangeSlide={this.onChangeSlide}
          />
        </div>
        {this.isVisibleStudentList && <EngStudentListPage 
                                        wsStore={this.props.wsStore}
                                        onClose={this.closeStudentListPage} 
                                      />}
        {this.isVisibleExtraActivity && <ThreeMinActivityPopup 
                                          wsStore={this.props.wsStore}
                                          onClose={this.closeExtraActivityPopup}
                                        />}
        <ClassSettingPopup 
          view={this.isVisibleClassSetting}
          wsStore={this.props.wsStore}
          selectedClassId={this.props.classId}
          inClass={true}
          onClose={this.closeClassSettingPopup}
        />
      </div>
    );
  }
}
export default EngUnitPage
