import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
// import(/* webpackPreload: true, webpackChunkName: "dependencies/lodash" */ 'lodash')
import Spin from '../components/Spin';

const Home = React.lazy(() => import(/*webpackPreload:true*/'./Home'));

class App extends Component {
  constructor() { // Component should be written as a pure functioneslint(react/prefer-stateless-function)
    super();
    this.state = {};
  }

  render() {
    return (
      <Router>
        <React.Suspense fallback={<Spin />}>
          <Switch>
            <Route path="/" exact component={Home} />
          </Switch>
        </React.Suspense>
      </Router>
    );
  }
}

export default App;
