import { observer } from 'mobx-react'
import * as React from 'react'
import { observable } from 'mobx';
import { WSStore } from '../../stores/wsStore'
import { CLASS_LIST_DISPLAY_CNT_PER_PAGE } from '../../constants/index';
import { DisplayMode } from '../../types';
import LoadingSpinner from '../../spinner/LoadingSpinner';
import MenuBar from '../menu/MenuBar';
import ClassListHeader from './ClassListHeader';
import ClassList from './ClassList';
import ClassSettingPopup from '../ClassSetting/ClassSettingPopup';
import sessionStorageManager from '../../utils/SessionStorageManager';
import './EngTeacherHome.scss';

const Swiper = require('react-id-swiper').default;

interface IEngTeacherHome {
  wsStore: WSStore;
  history: any;
  gotoUnit?: () => void;
  gotoHome?: () => void;
}

@observer
export class EngTeacherHome extends React.Component<IEngTeacherHome> {
  @observable private curPage: number = 1;
  @observable private viewAlert: boolean = false;
  @observable private isVisibleLoading: boolean = false;
  @observable private isVisibleClassSetting: boolean = false;
  @observable private selectedClassId: number = 0;

  constructor(props: IEngTeacherHome) {
    super(props);
  }

  showClassSettingPopup = (classId: number) => {
    this.selectedClassId = classId;
    this.isVisibleLoading = true;
    // this.isVisibleClassSetting = true;
    let data = { type: 'getClassSettings', from: "content", srcFrame: 'navi', msg: {classid: classId} }
    this.props.wsStore.sendPostMessage(data);
    this.props.wsStore.setNotifyClassSettings(this.onNotifyClassSettings);
  }
  public onNotifyClassSettings = (msg: any) => {
    if(!msg.classid || msg.classid !== this.selectedClassId) return;
    this.isVisibleLoading = false;
    this.props.wsStore.setNotifyClassSettings(null);
    this.isVisibleClassSetting = true;
  }
  closeClassSettingPopup = () => this.isVisibleClassSetting = false;

  public componentDidMount() {
    if(this.props.wsStore.isDvlp) {
      let data = { type: 'getTeacherHomeInfo', from: "content", srcFrame: 'navi', msg: '' }
      this.props.wsStore.sendPostMessage(data);
    }
    this.props.wsStore.setNotifyClassInfo(this.onNotifyClassInfo);
    this.viewAlert = false;
  }
  public onNotifyClassInfo = () => {
    if(this.props.gotoUnit) this.props.gotoUnit();
    else this.props.history.push("/Unit/"+this.props.wsStore.curClassId);
  }

  onClickClass = (classid: number, ready: boolean) => {
    this.props.wsStore.curClassId = classid;
    // if(this.props.gotoUnit) this.props.gotoUnit();
    // else this.props.history.push("/Unit/"+classid);
    let gtotoData = { type: 'gotoClass', from: "content", srcFrame: 'navi', msg: {classid: classid, video: true, audio: true, open: ready}}; 
    this.props.wsStore.sendPostMessage(gtotoData);

    this.props.wsStore.classSettings = undefined;
    this.props.wsStore.access_key_id = "";
    this.props.wsStore.secret_access_key = "";
    let settingData = { type: 'getClassSettings', from: "content", srcFrame: 'navi', msg: {classid: classid} }
		this.props.wsStore.sendPostMessage(settingData);
  }

  onChangeSlide = (changedSlideIndex: number) => {
    this.curPage = changedSlideIndex + 1;
  }

  onLogOut = () => {
    let data = { type: 'logout', from: "content", srcFrame: 'navi', msg: '' }
    this.props.wsStore.sendPostMessage(data);
    this.props.wsStore.account = undefined;
    if(this.props.gotoHome) this.props.gotoHome();
    else this.props.history.push("/");
  }

  public onExitApp = () => {
    let data = { type: 'exitApp', from: "content", srcFrame: 'navi', msg:''};
    this.props.wsStore.sendPostMessage(data);
  }

  public render() {
    const { account, classList } = this.props.wsStore;

    const totalClassCnt = classList ? classList.length : 0;
    const totalPageCnt = Math.ceil(totalClassCnt / CLASS_LIST_DISPLAY_CNT_PER_PAGE);
    const teacherDisplayName = account ? account.name : '';

    return (
      <>
        {classList && (
          <div id="wrap">
            <div className="wrapcont classwrap">
              <MenuBar
                requestMoveHome={this.props.gotoHome}
                requestLogout={this.onLogOut}
                requestExit={this.onExitApp}
              />
              <ClassListHeader teacherDisplayName={teacherDisplayName} totalClassCnt={totalClassCnt} ui={this.props.wsStore.UI}/>
              <div className="classlist_cnt">
                <p className="page">
                  <span>{this.curPage}</span> / <b>{totalPageCnt}</b>
                </p>
              </div>
              <ClassList
                totalPageCnt={totalPageCnt}
                classesList={classList}
                onClickClass={this.onClickClass}
                onChangeSlide={this.onChangeSlide}
                showClassSettingPopup={this.showClassSettingPopup}
              />
            </div>
            <ClassSettingPopup 
              view={this.isVisibleClassSetting}
              wsStore={this.props.wsStore}
              selectedClassId={this.selectedClassId}
              onClose={this.closeClassSettingPopup}
            />
            {this.isVisibleLoading && (<LoadingSpinner />)}                              
          </div>
        )}
      </>
    )
  }
}
export default EngTeacherHome
