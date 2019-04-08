import React, {Component} from 'react';

import ForumThread from './ForumThread.js';
import {Route, Link} from 'react-router-dom';

import axios from 'axios';

export default class ThreadList extends Component {

  constructor(props) {
    super(props);
    this.state = {threadList:[], loggedIn: this.getLoginStatus()};
    this.updateThreadList = this.updateThreadList.bind(this);
  }
  componentDidMount() {
    this.updateThreadList();
  }

  getLoginStatus() {
    if(localStorage.getItem('loggedIn') === 'false' || localStorage.getItem('loggedIn') === null)
      return false;
    return true;
  }

  updateThreadList() {
    // get the path might be needed -- old new version works better
    // console.log(this.props.location.pathname);
    // const pathName = this.props.location.pathname.slice(1);
    // this.setState({subforumName: pathName});
    // console.log(pathName);
    // console.log(pathName);
    // request all the threads from the specific subforum
    axios.get('/api/threads/' + this.props.subforumName)
      .then( response => {
        this.setState({threadList: response.data});
        // console.log(response.data);
        // might be usefull in future development
        // console.log(this.props.match.url);
      })
      .catch( err => {
        console.log(err);
      });
  }

  render() {
    // create a list with all the threads
    const threadList = this.state.threadList.map(t => (
      <ForumThread
        key={t._id}
        id={t._id}
        subforumName={this.props.subforumName}
        title={t.title}
        subtitle={t.subtitle}
        image={t.image}
        upvotes={t.upvotes}
        body = {t.body}
        rate = {t.rate}
        created_by = {t.created_by}
        updateThreads = {this.updateThreadList.bind(this)}
      />
    ));
    threadList.reverse();
    return(
      <div>
        <div className='row'>
          <div className='col-6'>
            <h3 style={{textAlign:'left'}}><img src={this.props.logo} style={{width:'25px', height:'auto', paddingBottom:'5px', marginRight:'10px'}}/>Welcome to {this.props.subforumName.charAt(0).toUpperCase() + this.props.subforumName.slice(1)} </h3>
          </div>
          <div className='col-6'>
            {this.state.loggedIn && <Link className='btn btn-primary btn-lg float-right' to={`/create-thread/${this.props.subforumName}`}>Create thread</Link>}
          </div>
        </div>
        {
          threadList.length !== 0 ? <div>{threadList}</div> : <div>Wow, such emptyness, create a thread yourself and start the discussion!</div>
        }
      </div>
    );
  }

}
