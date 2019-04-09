import React, {Component} from 'react';

import Comment from './Comment.js';
import PostComment from './PostComment.js';
import {Route} from 'react-router-dom';
// import Cookies from 'js-cookie';

import withAuth from './withAuth';

import $ from 'jquery';
import axios from 'axios';

// this component shows all the information in a thread including the discution that happens in it (comments)
export default class ThreadExpanded extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.location.params;
    this.submitComment = this.submitComment.bind(this);
    this.handleVote = this.handleVote.bind(this);
  }

  handleVote(e) {
    // console.log(e.target.value);
    if(e.target.name === 'upvote') {
      this.setState({disableUpvote:true, disableDownvote:false});
    } else {
      this.setState({disableUpvote:false, disableDownvote:true});
    }
    axios.put(`/api/ratethread/${this.props.match.params.id}`, {
      rate:e.target.value
    })
      .then(res=>{
        // console.log(res);
      })
      .catch(err => {
        // error do something
        // console.log(err);
      });
  }

  getComments() {
    let commentsList = [];
    axios.get(`/api/comment/${this.props.match.params.id}`)
      .then(res=>{

        commentsList = res.data.map(c=><Comment key={c._id} name={c.name} comment={c.comment}/>);
        this.setState({commentsList:commentsList.reverse()});
      }).catch(err=>console.log(err));
  }

  componentDidMount() {
    const commentsList = this.getComments();
    if(this.getLoginStatus()) {
      this.setState({loggedIn: true});
      axios.get(`/api/checkVote/${this.props.match.params.id}`)
        .then(res=>{
          if(res.data.voted === true) {
            if(res.data.vote === 1) {
              this.setState({disableUpvote:true});
            } else {
              this.setState({disableDownvote:true});
            }
          }

        })
        .catch(err=>{

        });
    }
  }

  getLoginStatus() {
    if(localStorage.getItem('loggedIn') === 'false' || localStorage.getItem('loggedIn') === null)
      return false;
    return true;
  }

  submitComment() {
    if($('#comment').val() === '' || $('#comment').val() === null) {
      alert('You can\'t comment an empty string ');
    }  else {
      axios.post('/api/comment', {
        threadId: this.props.match.params.id,
        comment: $('#comment').val()
      }).then(res=>{
        if(res.data.success === true) {
          // might need to edit this to make to improve performance, works for now

          this.getComments();
        }
      }).catch(err => console.log(err));
    }
  }

  getThread() {
    axios.get(`/api/thread/${this.props.match.params.id}`)
      .then(res=>{
        // populate the state
        this.setState(res.data);
        axios.get(`/api/user/${res.data.created_by}`)
          .then(res=>{
            this.setState({createdByUser:res.data});
          })
          .catch(err=> {
            // do something
          });

      })
      .catch(err =>console.log(err));
  }
  render() {
    // get the comments
    // const commentsList = this.getComments();
    if(this.state === null) {
      // get the data from the api
      return <div>Loading</div>;
    } else if(!this.state.hasOwnProperty('title')) {
      this.getThread();
      return <div>Loading</div>;
    } else {
      return(
        <div>
          <h3> {this.state.title}</h3>
          <small className='text-secondary'> {this.state.subtitle} </small>
          {this.state.createdByUser && <p className='text-right float-right text-primary font-italic'> {this.state.createdByUser} </p>}<p className='text-right float-right' style={{marginRight:'3px'}}>Created by:</p>
          <hr />
          <div className="row">
            <div className="col-6" style={{borderRight:'1px solid', borderColor:'rgba(0,0,0,.1)'}}>
              {this.state.body}
            </div>
            <div className="col-6">
              <img src={this.state.image} style={{maxHeight:'500px', maxWidth:'650px'}}/>
            </div>
          </div>
          <hr/>
          <div className='row'>
            <div className='col-6'>

              {<PostComment submitComment={this.submitComment} />}
            </div>
            <div className='col-6'>
              {this.state.rate && <p className='text-right'>Rating: {this.state.rate}</p>}
              {this.state.loggedIn  && <button className='btn btn-danger float-right'name='downvote' id='downvote' disabled={this.state.disableDownvote} value={-1} onClick={this.handleVote}>Downvote</button> }
              {this.state.loggedIn  && <button className='btn btn-success float-right' name='upvote' id='upvote' disabled={this.state.disableUpvote} style={{marginRight:'10px'}} value={1} onClick={this.handleVote}>Upvote</button>}
            </div>
          </div>
          {this.state.commentsList}
        </div>
      );
    }
  }
}
