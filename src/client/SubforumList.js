import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';

import SubForum from './SubForum.js';
import ThreadExpanded from './ThreadExpanded';

import axios from 'axios';


class SubforumList extends Component {
  constructor(props) {
    super(props);
    this.state = {subforums:[]};
    this.updateSubforums = this.updateSubforums.bind(this);

  }

  componentDidMount() {
    this.updateSubforums();
  }

  updateSubforums() {
    axios.get('/api/subforums')
      .then( response => {
        // console.log(response.data);
        this.setState({subforums:response.data});
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    // create a subforum component for each subforum
    const subForumList = this.state.subforums.map(sF => (
      <SubForum
        key={sF._id}
        id={sF._id}
        name={sF.name}
        logo={sF.logo}
      />
    ));
    // console.log(this.props.match.path);
    return(
      <div className='row'>
        <div className='card-deck'>
          {subForumList}
        </div>
      </div>

    );
  }
};

export default SubforumList;
