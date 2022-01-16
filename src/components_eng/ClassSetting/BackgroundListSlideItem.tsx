import { observer } from 'mobx-react'
import * as React from 'react'
import { observable } from 'mobx';
import { ClassSettingItemFile } from '../../types';

export interface IBackgroundListSlideItem {
  curBg: ClassSettingItemFile;
  selectedBgId: string;
  onClickBg: (selectedFile: ClassSettingItemFile) => void;
}

@observer
export default class BackgroundListSlideItem extends React.Component<IBackgroundListSlideItem> {
  render() {
    const { onClickBg, selectedBgId, curBg } = this.props;
    return (
      <li
        className={curBg.classSettingsIdx === selectedBgId ? 'select' : undefined}
        onClick={() => {
          onClickBg(curBg);
        }}
      >
        <div>
          <img src={curBg.filePath} />
        </div>
      </li>
    );
  }
}
