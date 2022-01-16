import * as React from 'react';
import { Provider, observer } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { createBrowserHistory } from 'history';
import { BrowserRouter, Switch, Route, Link, Redirect, HashRouter } from 'react-router-dom';
import { WSStore } from './stores/wsStore';
import Home from './containers/Home';
import UnitPage from './containers/UnitPage';
import LessonPage from './containers/LessonPage';
import { observable } from 'mobx';
import Sound from './components_eng/Sound';

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();

const history = syncHistoryWithStore(browserHistory, routingStore);
const wsStore = new WSStore();

const stores = {
    routing: routingStore,
    wsStore: wsStore,
};

@observer
export default class App extends React.Component<{}> {
    @observable _curView: 0|1|2 = 0;
    @observable _changeLesson: boolean = false;
    public gotoHome = () => {
        wsStore.gotoClass = false;
        wsStore.curClassId = 0;
        wsStore.curUnitId = 0;
        wsStore.curLessonId = 0;
        wsStore.studentCnt = 0;
        wsStore.entryCnt = 0;
        wsStore.classOpen = false;
        this._curView = 0;

        wsStore.classSettings = undefined;
        wsStore.access_key_id = "";
        wsStore.secret_access_key = "";
    }
    public gotoUnit = () => this._curView = 1;
    public gotoLesson = () => this._curView = 2;
    public onChangeLesson = () => this._changeLesson != this._changeLesson;

    render() {
        console.log('this._curView', this._curView, this._changeLesson);
        return (
            <div className="App">
             {this._curView === 0 && (<Home 
                                        wsStore={wsStore} 
                                        history={history} 
                                        gotoUnit={this.gotoUnit} 
                                        gotoHome={this.gotoHome}/>)}
             {this._curView === 1 && (<UnitPage 
                                        wsStore={wsStore} 
                                        history={history} 
                                        gotoLesson={this.gotoLesson} 
                                        gotoUnit={this.gotoUnit} 
                                        gotoHome={this.gotoHome}/>)}
             {this._curView === 2 && (<LessonPage 
                                        wsStore={wsStore} 
                                        history={history} 
                                        changeLesson={this._changeLesson}
                                        gotoLesson={this.gotoLesson} 
                                        gotoUnit={this.gotoUnit} 
                                        gotoHome={this.gotoHome}
                                        onChangeLesson={this.onChangeLesson}/>)}
            <Sound />
            </div>
        );
    }
}