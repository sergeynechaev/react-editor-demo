import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Editor } from 'app/containers/editor';
import { hot } from 'react-hot-loader';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

export const App = hot(module)(() => (
  <MuiThemeProvider theme={theme}>
    <Switch>
      <Route path="/" component={Editor} />
    </Switch>
  </MuiThemeProvider>
));
