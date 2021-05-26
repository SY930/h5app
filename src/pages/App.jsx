import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import * as dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
// import(/* webpackPreload: true, webpackChunkName: "dependencies/lodash" */ 'lodash')
import Spin from '../components/Spin';

dayjs.locale('zh-cn')
const Home = React.lazy(() => import(/*webpackPreload:true, webpackChunkName: "home" */'./Home'));

class App extends Component {
  constructor() { // Component should be written as a pure functioneslint(react/prefer-stateless-function)
    super();
    this.state = {};
  }

  render() {
    return (
      <ConfigProvider
        locale={zh_CN} // eslint-disable-line
      >
        <Router>
          <React.Suspense fallback={<Spin />}>
            <Switch>
              <Route path="/" exact component={Home} />
            </Switch>
          </React.Suspense>
        </Router>
      </ConfigProvider>
    );
  }
}

export default App;
