import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Provider } from 'react-redux';
import '@cartologic/sdk/stylesheet/configWizard.css';
import AppHeader from '@cartologic/sdk/wizard/AppHeader';
import { defineAppMode } from '@cartologic/sdk/wizard/helper';

import store from './store';
import ContentGrid from './components/ContentGrid';

class App extends Component {

  componentWillMount() {
    defineAppMode(window.location.href, store);
  }

  render() {
    return (
      <Provider store={store}>
        <Container>
          <AppHeader appHeaderTitle="App Template" />
          <ContentGrid />
        </Container>
      </Provider>
    );
  }
}

export default App;
