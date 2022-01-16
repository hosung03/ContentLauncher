import * as React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx';
import { WSStore } from '../../stores/wsStore'
import { ClassesType, CurriculumType } from '../../types';
import MenuBar from '../menu/MenuBar';
import LessonListHeader from './LessonListHeader';
import LessonStepList from './LessonStepList';
import EngStudentListPage from '../StudentList/EngStudentListPage';
import ThreeMinActivityPopup from '../ExtraActivity/ThreeMinActivityPopup';
import sessionStorageManager from '../../utils/SessionStorageManager';
import ClassSettingPopup from '../ClassSetting/ClassSettingPopup';
import './EngLessonPage.scss';

const Swiper = require('react-id-swiper').default;

interface IEngLessonPage {
    wsStore: WSStore;
    classId: number;
    unitId: number;
    lessonId: number;
    history: any;
    gotoLesson?: () => void;
    gotoUnit?: () => void;
    gotoHome?: () => void;
    onChangeLesson? : () => void;
}

@observer
export default class EngLessonPage extends React.Component<IEngLessonPage> {
  @observable private curPage: number = 1;
  @observable private selectedClass:ClassesType|undefined = undefined;
  @observable private level:CurriculumType|undefined = undefined;
  @observable private unitList:CurriculumType[]|undefined = undefined;
  @observable private isVisibleStudentList: boolean = false;
  @observable private isVisibleExtraActivity: boolean = false;
  @observable private isVisibleClassSetting: boolean = false;
  @observable private studentCnt: number = 0;
  @observable private entryCnt: number = 0;
  @observable private moveBookId: number = 0;

  // @observable private lessonMode = '';
  // @observable private teacherSetting = '';
  // @observable private studentSetting = '';
  @observable private bgImg = '';

  constructor(props: IEngLessonPage) {
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
    this.props.wsStore.setNotifyClassSettingsInLesson(this.onNotifyClassSettingsInLesson);
  }
  public onNotifyClassSettingsInLesson = (msg: any) => {
    if(!msg.classid || msg.classid !== this.props.classId) return;
    this.props.wsStore.setNotifyClassSettingsInLesson(null);
    this.isVisibleClassSetting = true;
  }
  closeClassSettingPopup = () => this.isVisibleClassSetting = false;

  public componentDidMount() {
    if(this.props.classId < 1) return;

    const { classList, curriculum, studentCnt, entryCnt, classSettings, classOpen, allStudentList } = this.props.wsStore;

    if(classList && curriculum) {
      this.selectedClass = classList.find(item => item.id === this.props.classId);
      if(this.selectedClass) this.studentCnt = this.selectedClass.memberCount;
      this.level = curriculum;
      this.unitList = curriculum.childrenList;
    }  

    if(classOpen) {
      if(this.studentCnt === 0) this.studentCnt = studentCnt;
      this.entryCnt = entryCnt;
      this.props.wsStore.setNotifyAppStateForLesson(this.onNotifyAppStateForLesson);
    }

    // const settingObj = sessionStorageManager.getItem('classSetting_' + this.props.classId);
    let inTime = false;
    // if(settingObj && settingObj.enddate) {
    //   const now = new Date();
    //   let enddate = new Date(settingObj.enddate);
    //   if(now.getTime() <= enddate.getTime()) inTime = true;
    // }
    // console.log('=====> sessionStorageManager', inTime);
    // if(inTime) {
    //   if(settingObj.selectedBgImg && settingObj.selectedBgImg != '') this.bgImg = settingObj.selectedBgImg;
    // } else 
    if(classSettings) {
      const classSetting = classSettings.find(item => item.code === 'CC0501');
      if(classSetting && classSetting.files) {
        const seletedBgFile = classSetting.files.find(file => file.selected === 'Y');
        if(seletedBgFile) this.bgImg = seletedBgFile.filePath;
      }
    }
    this.moveBookId = 0;
    this.props.wsStore.setNotifyMoveBook(this.onNotifyMoveBook);
  }

  public onNotifyAppStateForLesson = (msg: any) => {
    // if(msg.studentCnt !== this.studentCnt) this.studentCnt = msg.studentCnt;
    if(msg.entryCnt !== this.entryCnt) this.entryCnt =  msg.entryCnt;
  }

  public onNotifyMoveBook = (msg: any) => {
    const {classOpen} = this.props.wsStore;
    if(!classOpen) return;
    this.moveBookId = msg.bookid;
  }

  public onClickBack = () => {
    let data = { type: 'internalMsg', from: "content", srcFrame: 'navi', msg: { to: 'teaching', info: { type: 'notifyUnitInfo', unitId: 0}}};
    this.props.wsStore.sendPostMessage(data);

    // this.props.wsStore.classSettings = undefined;
    // this.props.wsStore.access_key_id = "";
    // this.props.wsStore.secret_access_key = "";
    let settingData = { type: 'getClassSettings', from: "content", srcFrame: 'navi', msg: {classid: this.props.classId} }
		this.props.wsStore.sendPostMessage(settingData);

    if(this.props.gotoUnit) this.props.gotoUnit();
    else this.props.history.push('/Unit/'+this.props.classId);
  }

  onOpenClass = () => {
    const { classOpen, studentCnt, entryCnt } = this.props.wsStore;
    if(classOpen) return;

    if(this.studentCnt === 0) this.studentCnt = studentCnt;
    this.entryCnt = entryCnt;
    this.props.wsStore.setNotifyAppStateForLesson(this.onNotifyAppStateForLesson);
    
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

    let data1 = { type: 'internalMsg', from: "content", srcFrame: 'navi', msg: { to: 'teaching', info: { type: 'notifyUnitInfo', unitId: 0}}};
    this.props.wsStore.sendPostMessage(data1);

    let data2 = { type: 'exitClass', from: "content", srcFrame: 'navi', msg: '' }
    this.props.wsStore.sendPostMessage(data2);

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
    
    let data1 = { type: 'internalMsg', from: "content", srcFrame: 'navi', msg: { to: 'teaching', info: { type: 'notifyUnitInfo', unitId: 0}}};
    this.props.wsStore.sendPostMessage(data1);

    let data2 = { type: 'logout', from: "content", srcFrame: 'navi', msg:''};
    this.props.wsStore.sendPostMessage(data2);
    this.props.wsStore.account = undefined;
    if(this.props.gotoHome) this.props.gotoHome();
    else this.props.history.push("/");
  } 

  public onExitApp = () => {
    let data = { type: 'exitApp', from: "content", srcFrame: 'navi', msg:''};
    this.props.wsStore.sendPostMessage(data);
  }

  public onClickStart = (bookId: number, bookIdList: number[]) => {
    console.log('onClickStart', bookId, bookIdList);
    this.props.wsStore.curBookId = bookId;
    let data = { type: 'gotoBook', from: "content", srcFrame: 'navi', msg: {
        bookid: bookId, 
        booklist: bookIdList
    }};
    this.props.wsStore.sendPostMessage(data);
  }

  render() {
    const { account, classOpen, UI } = this.props.wsStore;

    let backgroundStyle: React.CSSProperties = {};
    if(this.bgImg !== '') {
      backgroundStyle.backgroundImage = `url(${this.bgImg})`;
      backgroundStyle.backgroundSize = 'cover';
    }

    return (
      <div id="wrap">
        <div className="wrapcont classwrap" style={backgroundStyle}>
          <MenuBar
            requestMoveHome={this.gotoHome}
            requestLogout={this.onLogOut}
            requestExit={this.onExitApp}
          />
          <LessonListHeader
            teacherDisplayName={account ? account?.name : ''}
            selectedClass={this.selectedClass}
            unitList={this.unitList}
            studentCnt={this.studentCnt}
            entryCnt={this.entryCnt}
            classOpen={classOpen}
            showStudentListPage={this.showStudentListPage}
            showExtraActivityPopup={this.showExtraActivityPopup}
            onOpenClass={this.onOpenClass}
            showClassSettingPopup={this.showClassSettingPopup}
          />
          <LessonStepList unitId={this.props.unitId} unitList={this.unitList} classOpen={classOpen} moveBookId={this.moveBookId} ui={UI} onClickStart={this.onClickStart} onClickBack={this.onClickBack}/>
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
          onClose={this.closeClassSettingPopup}
        />
      </div>
    );
  }
}
