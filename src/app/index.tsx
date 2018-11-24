import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Editor } from 'app/containers/editor';
import { hot } from 'react-hot-loader';

export const App = hot(module)(() => (
  <Switch>
    <Route path="/" component={Editor} />
  </Switch>
));
