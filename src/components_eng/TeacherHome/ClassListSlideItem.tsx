import * as React from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx';
import { ClassesType, ClassColorType } from '../../types';
import { DEFAULT_CLASS_IMAGE } from '../../constants';
import { CAPTION, LANG } from '../../constants/Caption';

export interface IClassListSlideItem {
  curClass: ClassesType;
  onClickClass: (id: number, ready: boolean) => void;
  showClassSettingPopup?: (classId: number) => void;
}

@observer
export default class ClassListSlideItem extends React.Component<IClassListSlideItem> {
  @observable private productName: string = '';
  @observable private curriculumThumbnail: string  = '';
  @observable private classDisplayName: string  = '';
  @observable private classMemberCnt: number = 0;
  @observable private description: string = '';

  constructor(props: IClassListSlideItem) {
    super(props);

    this.makeClassStateData(this.props.curClass);
  }

  componentWillReceiveProps(nextProps: IClassListSlideItem) {
    if (this.props.curClass !== nextProps.curClass) this.makeClassStateData(nextProps.curClass);
  }

  onClickClass = () => {
    this.props.onClickClass(this.props.curClass.id, false);
  };

  onClassEnter = (evt: React.SyntheticEvent<HTMLSpanElement>) => {
    this.props.onClickClass(this.props.curClass.id, true);
    evt.stopPropagation();
  };

  onClickSetting = (evt: React.SyntheticEvent<HTMLSpanElement>) => {
    if (this.props.showClassSettingPopup) this.props.showClassSettingPopup(this.props.curClass.id);
    evt.stopPropagation();
  };

  makeClassStateData(curClass: ClassesType) {
    try {
      if (curClass.product.id > 0) {
        this.curriculumThumbnail = curClass.product.curriculumImage;
        this.productName = curClass.product.name;
        this.description = curClass.product.description;
      }

      this.classMemberCnt = curClass.memberCount;
      this.classDisplayName = curClass.name;
      this.curriculumThumbnail = this.curriculumThumbnail === '' ? DEFAULT_CLASS_IMAGE : this.curriculumThumbnail;
    } catch (err) {
      console.log(`invalid class data : ${JSON.stringify(err)}`, err);
    }
  }  
   

  render() {
    return (
      <li onClick={this.onClickClass}>
        {false && <link rel="preload" href={this.curriculumThumbnail} type="image/jpg" />}
        <div className="cCnt">
          <img src={this.curriculumThumbnail} />
          <p>
            {CAPTION[LANG].STUDENTS}
            <b>{this.classMemberCnt}</b>
          </p>
        </div>
        <div className="cInfo">
          <strong>{this.classDisplayName}</strong>
          {this.productName}
          <p>
            {false && <span className="ic_t">teacher</span>}
          </p>
          {/* <span className="btn_enter" onClick={this.onClassEnter}></span> */}
        </div>
        <div className="cFunc">
          <span className="setting" onClick={this.onClickSetting}>
            setting
          </span>
        </div>
      </li>
    );
  }
}
