import React from 'react';
import { Router, Route, Switch, Link} from 'react-router-dom';
import { createBrowserHistory } from 'history'
import CustomNavbar from './components/CustomNavbar'
import Home from './components/Home';
import TeamMembers from './components/TeamMembers';
import Permissions from './components/Permissions';
import 'react-bootstrap';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { withRouter } from "react-router";
import ActivityLog from './components/ActivityLog';
import NewUser from './components/NewUser';

const theme = createMuiTheme({
  palette: {
    primary:{
      main:'#263746',
      dark:"#1b2732",
      light:"#507495",
      contrastText: "#fff"
    },
    secondary: {
      main: '#77bc1f',
      light:"#a3e34f",
      dark:"#548415",

    }
  }
});
const RouterNav = withRouter(CustomNavbar);

function App(){
  const history = createBrowserHistory()
    return (
      <MuiThemeProvider theme={theme}>
      <div className="App">
            <div>
            <Router history={history}>
            <RouterNav/>
              <Switch>
                <div className="content">
                    <Route exact path={`/`} component = {Home}/>
                    <Route path={`/teammembers`} component = {TeamMembers}/>
                    <Route path={`/permissions`} component = {Permissions}/>
                    <Route path={`/newuser`} component = {NewUser}/>
                    <Route path={`/ActivityLog/:userid`} component = {ActivityLog}/>

                </div>
              </Switch>
            </Router>
            </div>
      </div>
      </MuiThemeProvider>
    );
}

export default App;
