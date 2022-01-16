import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import '../styles/app.global.scss';

import App from './App';

ReactDOM.render(
    <AppContainer>
        <App/>
    </AppContainer>,
    document.getElementById('root')
);

if ((module as any).hot) {
    (module as any).hot.accept('./App', () => {
        ReactDOM.render(
            <AppContainer>
                <App/>
            </AppContainer>,
            document.getElementById('root')
        );
    })
}