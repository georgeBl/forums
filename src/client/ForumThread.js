import React, {Component} from 'react';

import {Link, Route} from 'react-router-dom';
import ThreadExpanded from './ThreadExpanded.js';

import axios from 'axios';

class ForumThread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.getLoginStatus(),
      created_by:'Hidden',
      createdByUser: false
    };
  }

  deleteThread() {
    axios.delete(`api/thread/${this.props.id}`)
      .then(res=>{
        if(res.status === 200) {
          this.props.updateThreads();
        }
      })
      .catch(err => {

      });
  }

  componentDidMount() {
    // get the user who created the thread using the id
    axios.get(`/api/user/${this.props.created_by}`)
      .then(res=>{
        this.setState({created_by:res.data});
      })
      .catch(err => {
        // do something with the error
      });
    if(this.state.loggedIn) {
      axios.get('/api/user')
        .then(res=>{
          if(res.data._id === this.props.created_by) {
            this.setState({createdByUser:true});
          }
        })
        .catch(err =>{
          // do something
        });
    }


  }

  getLoginStatus() {
    if(localStorage.getItem('loggedIn') === 'false' || localStorage.getItem('loggedIn') === null)
      return false;
    return true;
  }

  render() {
    return(
      <div className="row" style={{marginTop:'20px'}}>
        <div className="col-12">
          <div className="card">
            <h5 className="card-header"  style={{textAlign:'left'}}>{this.props.title}</h5>
            <div className="card-body">
              <p className="card-text "  style={{textAlign:'left'}}>{this.props.subtitle}</p>
              <p className="card-text "  style={{textAlign:'left'}}>Rate: {this.props.rate}</p>
              <p className="card-text "  style={{textAlign:'left'}}>Created by: {this.state.created_by}</p>
              <Link
                className='btn btn-primary float-left'
                to={{
                  pathname: `/${this.props.subforumName}/${this.props.id}`,
                  params: {
                    title: this.props.title,
                    subtitle: this.props.subtitle,
                    body: this.props.body,
                    image: this.props.image,
                    createdByUser:this.props.createdByUser
                  }
                }}>
                View thread
              </Link>
              {this.state.loggedIn && this.state.createdByUser &&
              <Link
                className='btn btn-success float-left'
                style={{marginLeft:'10px'}}
                to={{
                  pathname: `/edit-thread/${this.props.id}`,
                  params: {
                    title: this.props.title,
                    subtitle: this.props.subtitle,
                    body: this.props.body,
                    image: this.props.image
                  }
                }}>
                Edit thread
              </Link>}
              {this.state.loggedIn && this.state.createdByUser && <button
                className='btn btn-danger float-left' style={{marginLeft:'10px'}}
                onClick={this.deleteThread.bind(this)}
              > Delete thread
              </button>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ForumThread;
