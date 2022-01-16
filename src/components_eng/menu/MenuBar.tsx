import * as React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Menu from './Menu';
import './MenuBar.scss';

export interface IMenuBar {
  requestMoveHome?: () => void;
  requestLogout?: () => void;
  requestExit?: () => void;
}

@observer
export default class MenuBar extends React.Component<IMenuBar> {
  @observable isVisibleMenuBar: boolean = false;

  constructor(props: IMenuBar) {
    super(props);
  }

  onClickShow = () => this.isVisibleMenuBar = true;
  onClickHide = () => this.isVisibleMenuBar = false;

  handleClickHome = () => {
    if(this.props.requestMoveHome) this.props.requestMoveHome();
  }
  handleClickExit = () => {
    if(this.props.requestExit) this.props.requestExit();
  }
  handleClickLogout = () => {
    this.props.requestLogout!();
  }
  
  render() {
    return (
      <div className="classModule">
        <span className="Hbtn" onClick={this.onClickShow}/>
        {this.isVisibleMenuBar && (
          <Menu
            onClickHome={this.handleClickHome}
            onClickLogout={this.handleClickLogout}
            onClickExit={this.handleClickExit}
            onClickHide={this.onClickHide}
          />
        )}
      </div>
    );
  }
}
