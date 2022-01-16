import { observer } from 'mobx-react'
import * as React from 'react'
import { observable } from 'mobx';
import Select from 'react-select';
// import { ClassSettingItem, ClassSettingItemFile, ClasSettingSessionStorage } from '../../types';
import { CAPTION, LANG } from '../../constants/Caption';
import { Z_INDEX_LESSON_COMPLETE_POPUP } from '../../constants';
import { WSStore } from '../../stores/wsStore';
import { DeviceInfo } from 'src/types';
import './DeviceSettingPopup.scss';

interface ISelectOption { 
  label: string;
  value: string; 
}

export interface IDeviceSettingPopup {
  wsStore: WSStore;
  onClose: () => void;
}

@observer
export default class DeviceSettingPopup extends React.Component<IDeviceSettingPopup> {
  private deviceInfo: DeviceInfo = {soundid: '', videoid: '', speakerid: ''};
  @observable private gotDeviceList = false;
  private audioInputOptions: ISelectOption[] = [];
  private audioOutputOptions: ISelectOption[] = [];
  private videoOptions: ISelectOption[] = [];

  private videoEl: HTMLVideoElement|null = null;
  private audioEl: HTMLVideoElement|null = null;

  private audioContext:AudioContext|null = null;
  private deviceStream:MediaStream|null = null;
  private microphone:MediaStreamAudioSourceNode|null = null;
  private javascriptNode:ScriptProcessorNode|null = null;

  @observable private viewCameraList = false;
  @observable private selectedCameraName = '';

  @observable private viewMicList = false;
  @observable private selectedMicName = '';

  @observable private viewSpeakerList = false;
  @observable private selectedSpeakerName = '';

  @observable private viewAudioPlaying = false;

  constructor(props: IDeviceSettingPopup) {
    super(props);
    this.audioContext = new window.AudioContext();
  }

  private refVideo = (el: HTMLVideoElement) => {
    if(this.videoEl || !el) return;
    this.videoEl = el;
  }
  private refAudio = (el: HTMLVideoElement) => {
    if(this.audioEl || !el) return;
    this.audioEl = el;

    this.audioEl.addEventListener("ended", (event) => {
      this.viewAudioPlaying = false;
    });
  }

  componentDidMount() {
    this.props.wsStore.setNotifyDevice(this.onNotifyDevice);
    // this.initDevice();
  }
  componentUnMount() {
    if(this.deviceStream) {
      this.deviceStream.getTracks().forEach( (track) => {
        track.stop();
      });
    }
    if(this.javascriptNode) {
      this.javascriptNode.onaudioprocess = null;
      this.javascriptNode.disconnect();
    }
    if(this.microphone) this.microphone.disconnect();
    this.props.wsStore.setNotifyDevice(null);
  }

  onNotifyDevice = (msg: any) => {
    if(msg.soundid &&  msg.soundid !== '') this.deviceInfo.soundid = msg.soundid;
    if(msg.videoid &&  msg.videoid !== '') this.deviceInfo.videoid = msg.videoid;
    if(msg.speakerid &&  msg.speakerid !== '') this.deviceInfo.speakerid = msg.speakerid;
    this.initDevice();
  }

  onClickClose = () => {
    if(this.deviceStream) {
      this.deviceStream.getTracks().forEach( (track) => {
        track.stop();
      });
    }
    if(this.javascriptNode) {
      this.javascriptNode.onaudioprocess = null;
      this.javascriptNode.disconnect();
    }
    if(this.microphone) this.microphone.disconnect();
    this.hidePopup();
  };

  onClickApply = () => {
    let data = { type: 'setDevice', from: "content", srcFrame: 'navi', msg: {
      soundid: this.deviceInfo.soundid,
      videoid: this.deviceInfo.videoid,
      speakerid: this.deviceInfo.speakerid
    }};
    this.props.wsStore.sendPostMessage(data);

    this.onClickClose();
  };

  hidePopup() {
    if (this.props.onClose) this.props.onClose();
  }

  async initDevice() {
    if(this.deviceStream) {
      this.deviceStream.getTracks().forEach( (track) => {
        track.stop();
      });
    }
    // const constraints = {
    //   'video': true,
    //   'audio': true
    // }
    const constraints = {
      audio: {deviceId: this.deviceInfo.soundid ? {exact: this.deviceInfo.soundid} : undefined},
      video: {deviceId: this.deviceInfo.videoid ? {exact: this.deviceInfo.videoid} : undefined}
    };
    console.log('constraints:', constraints);
    await navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        // console.log('Got MediaStream:', stream);

        this.deviceStream = stream;
        if(!this.gotDeviceList) this.getDevices();
        this.playVideo(stream);
        this.playMicrophone(stream);
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });
  }

  async getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices().then(deviceInfos => {
      console.log('=====> getDevices deviceInfos', deviceInfos);
      for (let i = 0; i  < deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        if (deviceInfo.kind === 'audioinput') {
          if(this.deviceInfo.soundid === deviceInfo.deviceId) this.selectedMicName = deviceInfo.label;
          this.audioInputOptions.push({
            value: deviceInfo.deviceId,
            label: deviceInfo.label
          });
        } else if (deviceInfo.kind === 'audiooutput') {
          if(this.deviceInfo.speakerid === deviceInfo.deviceId) this.selectedSpeakerName = deviceInfo.label;
          this.audioOutputOptions.push({
            value: deviceInfo.deviceId,
            label: deviceInfo.label
          });
        } else if (deviceInfo.kind === 'videoinput') {
          if(this.deviceInfo.videoid === deviceInfo.deviceId) this.selectedCameraName = deviceInfo.label;
          this.videoOptions.push({
            value: deviceInfo.deviceId,
            label: deviceInfo.label
          });
        } else {
          console.log('Some other kind of source/device: ', deviceInfo);
        }
      }
      if(this.selectedMicName === '' && this.audioInputOptions.length > 0) {
        this.selectedMicName = this.audioInputOptions[0].label;
        this.deviceInfo.soundid = this.audioInputOptions[0].value;
      }
      if(this.selectedSpeakerName === '' && this.audioOutputOptions.length > 0) {
        this.selectedSpeakerName = this.audioOutputOptions[0].label;
        this.deviceInfo.speakerid = this.audioOutputOptions[0].value;
      }
      if(this.selectedCameraName === '' && this.videoOptions.length > 0) {
        this.selectedCameraName = this.videoOptions[0].label;
        this.deviceInfo.videoid = this.videoOptions[0].value;
      }
      console.log('=====> getDevices this.deviceInfo', this.deviceInfo);
      this.gotDeviceList = true;
    });
  }

  playVideo(stream: MediaStream) {
    // console.log('playVideo', this.videoEl && stream)
    if(this.videoEl && stream) this.videoEl.srcObject = stream;
  }

  playMicrophone(stream: MediaStream) {
    if(!this.audioContext) return;
    this.microphone = this.audioContext.createMediaStreamSource(stream);
    this.javascriptNode = this.audioContext.createScriptProcessor(2048, 1, 1);
    
    this.microphone.connect(this.audioContext.destination);
    this.microphone.connect(this.javascriptNode);
    this.javascriptNode.connect(this.audioContext.destination);
    const that = this;
    this.javascriptNode.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      let total = 0;

      for (var i = 0; i < input.length; i++) {
          total += Math.abs(input[i++]);
      }
      let rms = Math.sqrt(total / input.length);
      // console.log(rms * 400);
      if(rms * 400 > 20) this.displayVolume(rms * 400);
    }
  }

  displayVolume(vol: number) {
    let elements = document.querySelectorAll(".vol");
    let volumnSize = Math.floor((vol - 20)/elements.length);
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i] as HTMLDivElement;
     if(el) {
       if( i < volumnSize) el.style.backgroundColor="#14eccc";
       else el.style.backgroundColor="#e6e7e8";
     }
    }
  }

  playTestAudio = () => {
    if(this.audioEl) {
      // this.viewAudioPlaying = !this.viewAudioPlaying;
      // if(this.viewAudioPlaying) this.audioEl.play();
      // else this.audioEl.pause();
      this.viewAudioPlaying = true;
      this.audioEl.play();
    }
  }

  toggleCamerList = () => {
    this.viewCameraList = !this.viewCameraList;
  }

  toggleMicList = () => {
    this.viewMicList = !this.viewMicList;
  }

  toggleSpeakerList = () => {
    this.viewSpeakerList = !this.viewSpeakerList;
  }

  selectCamera = (idx: number) => {
    this.selectedCameraName = this.videoOptions[idx].label;
    this.deviceInfo.videoid = this.videoOptions[idx].value;
    this.viewCameraList = false;
    this.initDevice();
  }

  selectMic = (idx: number) => {
    this.selectedMicName = this.audioInputOptions[idx].label;
    this.deviceInfo.soundid = this.audioInputOptions[idx].value;
    this.viewMicList = false;
    this.initDevice();
  }

  selectSpeaker = (idx: number) => {
    this.selectedSpeakerName = this.audioOutputOptions[idx].label;
    this.deviceInfo.speakerid = this.audioOutputOptions[idx].value;
    this.viewSpeakerList = false;
  }

  render() {
    const { classList, account } = this.props.wsStore;
    const teacherDisplayName = account ? account.name : '';

    return (
      <div id="deviceSettingContainer">
        <div id="pageMask" style={{ zIndex: Z_INDEX_LESSON_COMPLETE_POPUP }}>
          <div className="stu_popup h0">
            <div className="stu_popup_title">
              <b>{CAPTION[LANG].DEVICE_CHECK}</b>
              <span className="close" onClick={this.onClickClose} />
            </div>
            <div className="dvBox">
              <div className="content">
                <div className="cnt_l">
                  <dl>
                    <dt>
                        <img src="images/ico_camera.png"/>
                        Camera
                    </dt>
                    <dd>
                      <div className="select">
                        <button type="button" className="btn_sel" onClick={this.toggleCamerList}>
                          <p>{this.selectedCameraName}</p>
                        </button>
                        <ul className="sel_list" style={{display: this.gotDeviceList && this.viewCameraList ? '' : 'none'}}>
                          {this.gotDeviceList && this.videoOptions.map((option, idx) => {
                            return <li key={'m_'+idx} onClick={this.selectCamera.bind(this, idx)}>{option.label}</li>
                          })}
                        </ul>
                      </div>
                      <div className="t_screen"><video ref={this.refVideo} autoPlay muted={true}></video></div>
                    </dd>
                  </dl>
                </div>
                <div className="cnt_r">
                  <dl>
                      <dt>
                          <img src="images/ico_mic.png"/>
                          Microphone
                      </dt>
                      <dd>
                        <div className="select">
                          <button type="button" className="btn_sel" onClick={this.toggleMicList}>
                          <p>{this.selectedMicName}</p>
                          </button>
                          <ul className="sel_list" style={{display: this.gotDeviceList && this.viewMicList ? 'block' : 'none'}}>
                          {this.gotDeviceList && this.audioInputOptions.map((option, idx) => {
                            return <li key={'s_'+idx} onClick={this.selectMic.bind(this, idx)}>{option.label}</li>
                          })}
                          </ul>
                        </div>
                        <div className="volume">
                          <div>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                            <div className="vol"/>
                          </div>
                        </div>
                      </dd>
                  </dl>
                  <dl>
                      <dt>
                          <img src="images/ico_speaker.png"/>
                          Speakers
                      </dt>
                      <dd>
                        <div className="select">
                          <button type="button" className="btn_sel" onClick={this.toggleSpeakerList}>
                          <p>{this.selectedSpeakerName}</p>
                          </button>
                          <ul className="sel_list" style={{display: this.gotDeviceList && this.viewSpeakerList ? 'block' : 'none'}}>
                          {this.gotDeviceList && this.audioOutputOptions.map((option, idx) => {
                            return <li key={'c_'+idx} onClick={this.selectSpeaker.bind(this, idx)}>{option.label}</li>
                          })}
                          </ul>
                        </div>
                        <audio ref={this.refAudio}>
                          <source src="sounds/common_arrow_down.mp3" type="audio/mp3"/>
                        </audio>
                        <button id="" type="button" className={'btn_test_sound' + (this.viewAudioPlaying ? ' on' : '')} onClick={this.playTestAudio}/>
                      </dd>
                  </dl>
                </div>
                <button type="button" className="btn_apply" onClick={this.onClickApply}>{CAPTION[LANG].APPLY.toUpperCase()}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
