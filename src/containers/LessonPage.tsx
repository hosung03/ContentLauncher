import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import { WSStore } from '../stores/wsStore';
import { SubjectType } from '../types'
import EngLessonPage from '../components_eng/Lesson/EngLessonPage';
import ErrorBoundary from '../utils/ErrorBoundary';

interface ILessonPageContainer {
  wsStore: WSStore;
  history: any;
  changeLesson?: boolean;
  gotoLesson?: () => void;
  gotoUnit?: () => void;
  gotoHome?: () => void;
  onChangeLesson?: () => void;
}

@inject('wsStore')
@observer
class LessonPageContainer extends React.Component<ILessonPageContainer> {
  constructor(props: ILessonPageContainer) {
    super(props);
  }

  public render() {
    const { subject, curriculum, curClassId, curUnitId, curLessonId } = this.props.wsStore;
    return (
      <>
      {subject === SubjectType.ENGLISH && curriculum !== undefined
      && (
        <ErrorBoundary>
        <EngLessonPage 
          wsStore={this.props.wsStore} 
          classId={curClassId}
          unitId={curUnitId}
          lessonId={curLessonId} 
          history={this.props.history}
          gotoLesson={this.props.gotoLesson}
          gotoUnit={this.props.gotoUnit}
          gotoHome={this.props.gotoHome}/>
        </ErrorBoundary>
      )}
      </> 
    )
  }
}

export default LessonPageContainer