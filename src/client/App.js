import React, {Component} from 'react';
import { HashRouter, Route, Switch, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import SubforumList from './SubforumList.js';
import ThreadList from './ThreadList.js';
import ThreadExpanded from './ThreadExpanded.js';
import Register from './Register.js';
import Login from './Login.js';
import Navbar from './Navbar.js';
import Details from './Details.js';
import CreateThread from './CreateThread.js';
import EditThread from './EditThread.js';
import EditUser from './EditUser.js';


import withAuth from './withAuth';
import axios from 'axios';
import $ from 'jquery';




// 'main' Component. Sets up the routers and auth logic
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {routeList:[], loggedIn: this.getLoginStatus()};
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
  }

  logout(props) {


    localStorage.setItem('loggedIn', 'false');
    axios.get('/api/logout')
      .then(res => {
        this.setState({loggedIn:false});
        props.history.push('/');
      })
      .catch( error => {
        // if(error.response) {
        //   console.log(error.response.status);
        // } else if(error.request) {
        //   console.log(error.request);
        // } else {
        //   console.log('Error', error.message);
        console.clear();
        // }
        return null;
      });
    return null;
  }

  login() {
    // can set the header using this as well;
    // const AUTH_TOKEN = Cookies.get('token');
    // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    this.setState({loggedIn:true});
    localStorage.setItem('loggedIn', 'true');
  }

  getLoginStatus() {
    if(localStorage.getItem('loggedIn') === 'false' || localStorage.getItem('loggedIn') === null)
      return false;
    return true;
  }

  componentDidMount() {
    // get all the subforums and make a route for each
    axios.get('/api/subforums')
      .then( response =>{

        this.setState({routeList:response.data});
      })
      .catch( error => {
        console.log(error);
      });

    // check if the user is logged in and set the state
    axios.get('/api/checkToken')
      .then(res => {
        if (res.status === 200) {
          if(!this.state.loggedIn) {
            this.setState({ loggedIn:true });
            // console.log('i set log in to true');
          }
        } else {
          const error = new Error(res.error);
          // throw error;
          // console.log('you are not logged in so you will not post stuff');
        }
      })
      .catch(err => {
        // console.error(err);
        this.setState({  loggedIn:false });
      });
  }
  render() {
    const routeList = this.state.routeList.map(r=>(
      // <Route path={`/${r.name}`} key={r._id} component={ThreadList} name={r.name} id={r._id}/>
      // <Route path={`/${r.name}`} render={(props) => <ThreadList {...props} key={r._id} />} />
      <Route
        key={r._id}
        exact path={`/${r.name}`}
        render={(props) => <ThreadList {...props} key={r._id} subforumName={r.name} logo={r.logo} />}
      />
    ));
    const expandedThreadsRouteList = this.state.routeList.map(r=>(
      <Route
        key={Math.random()}
        path={`/${r.name}/:id`}
        component={ThreadExpanded}
      />
    ));
    const createThreadsRouteList = this.state.routeList.map(r => (
      <Route
        key={Math.random()}
        exact path={'/create-thread/:subforumName'}
        component={withAuth(CreateThread)}
      />
    ));
    return(
      <div>
        <Navbar loggedIn={this.state.loggedIn}/>
        <div className='container-fluid'>
          <Switch>
            <Route exact path='/' component={SubforumList}/>
            {routeList}
            {expandedThreadsRouteList}
            {createThreadsRouteList}
            <Route exact path={'/edit-thread/:id'} component={withAuth(EditThread)}/>
            <Route path="/register" component={(props) => <Register {...props} handleLogin={this.login} />} />
            <Route path="/login" render={(props) => <Login {...props} handleLogin={this.login} />} />
            <Route path="/logout" render={this.logout}/>
            <Route path="/details" component={withAuth(Details)} />
            <Route exact path={'/edit-user'} component={withAuth(EditUser)} />
          </Switch>
        </div>
        <footer className='bg-dark text-white mt-5 p-4 text-center'>
          Copyright &copy; {new Date().getFullYear()} Simple forum - George Blanaru, N00153498
        </footer>
      </div>
    );
  }
};
