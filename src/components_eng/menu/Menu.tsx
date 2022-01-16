import * as React from 'react';
import { CAPTION, LANG } from '../../constants/Caption';

export interface IMenu {
  onClickHome: () => void;
  onClickLogout: () => void;
  onClickExit: () => void;
  onClickHide: () => void;
}

export default class Menu extends React.Component<IMenu> {
  render() {
    const { onClickHide, onClickLogout, onClickExit, onClickHome } = this.props;
    const style: React.CSSProperties = {
      display: 'block',
    };

    return (
      <div className="HMenu" style={style}>
        <div>
          <ul>
            <li onClick={onClickHome}>{CAPTION[LANG].HOME}</li>
            <li onClick={onClickLogout}>{CAPTION[LANG].LOGOUT}</li>
            <li onClick={onClickExit}>{CAPTION[LANG].EXIT}</li>
          </ul>
          <span className="close" onClick={onClickHide} />
        </div>
      </div>
    );
  }
}
