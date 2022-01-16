import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import { WSStore } from '../stores/wsStore';
import { SubjectType } from '../types'
import EngUnitPage from '../components_eng/Unit/EngUnitPage';
import EngStudentListPage from '../components_eng/StudentList/EngStudentListPage';
import ErrorBoundary from '../utils/ErrorBoundary';
import ThreeMinActivityPopup from '../components_eng/ExtraActivity/ThreeMinActivityPopup';

interface IUnitPageContainer {
  wsStore: WSStore;
  history: any;
  gotoLesson?: () => void;
  gotoUnit?: () => void;
  gotoHome?: () => void;
}

@inject('wsStore')
@observer
class UnitPageContainer extends React.Component<IUnitPageContainer> {
  constructor(props: IUnitPageContainer) {
    super(props);
  }
  
  public render() {
    const { subject, curriculum, curClassId} = this.props.wsStore;
    return (
      <>
      {subject === SubjectType.ENGLISH && curriculum !== undefined 
      && (
        <ErrorBoundary>
        <EngUnitPage 
            wsStore={this.props.wsStore} 
            classId={curClassId} 
            history={this.props.history} 
            gotoLesson={this.props.gotoLesson} 
            gotoUnit={this.props.gotoUnit}
            gotoHome={this.props.gotoHome}
        />
        </ErrorBoundary>
      )}
      </>
    )
  }
}

export default UnitPageContainer