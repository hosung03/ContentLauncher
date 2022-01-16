import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { WSStore } from '../stores/wsStore';
import LoadingSpinner from '../spinner/LoadingSpinner';
import { SubjectType } from '../types'
import { observable } from 'mobx';
import EngTeacherHome from '../components_eng/TeacherHome/EngTeacherHome';
import ErrorBoundary from '../utils/ErrorBoundary';
import { LANG } from '../constants/Caption';

const queryString = require('query-string');

interface ITeacherHomeContainer {
  wsStore: WSStore;
  history: any;
  gotoUnit?: () => void;
  gotoHome?: () => void;
}

@inject('wsStore')
@observer
class HomeContainer extends React.Component<ITeacherHomeContainer> {
  constructor(props: ITeacherHomeContainer) {
    super(props);
  }

  public componentDidMount() {
    let param = queryString.parse(location.search);
    // console.log('queryString', param);

    if(param.isDvlp) this.props.wsStore.isDvlp = param.isDvlp;
    if(param.userDiv) this.props.wsStore.userDiv = param.userDiv;
    console.log('this.props.wsStore.isDvlp', this.props.wsStore.isDvlp);
    console.log('this.props.wsStore.userDiv', this.props.wsStore.userDiv);

    console.log('lang', LANG);
    this.props.wsStore.subject = SubjectType.ENGLISH;
    this.props.wsStore.studentCnt = 0;
    this.props.wsStore.entryCnt = 0;

    if(this.props.wsStore.isDvlp && !this.props.wsStore.account) {
      let data = { type: 'getMyProfile', from: "content", srcFrame: 'navi', msg: '' }
      this.props.wsStore.sendPostMessage(data);
    }
  }

  public render() {
    const { account, subject} = this.props.wsStore;

    return (
      <>
      {!account && (<LoadingSpinner />)}
      {account && subject === SubjectType.ENGLISH && (
        <ErrorBoundary>
          <EngTeacherHome 
            wsStore={this.props.wsStore} 
            history={this.props.history} 
            gotoUnit={this.props.gotoUnit} 
            gotoHome={this.props.gotoHome}/>
        </ErrorBoundary>
      )}
      </>
    )
  }
}

export default HomeContainer
