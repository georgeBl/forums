import React, {Component} from 'react';

import {Link} from 'react-router-dom';
import axios from 'axios';

export default class Details extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      created_on:'',
      admin:false
    };
  }
  componentDidMount() {
    axios.get('/api/user')
      .then(res=>{
        this.setState(res.data);
      })
      .catch(err=>{

      });
  }
  render() {
    // there is an error happening there because the inputs don't have a onChange function but they dont need cause they are disabled and user is not suppose to click on them
    return(
      <div>
        <h3> Welcome, {this.state.name} </h3>
        <p className='font-weight-light font-italic'>Below are your details</p>
        <div className='row'>
          <div className='col-5'>
            <div className="form-group">
              <label htmlFor="emailInput">Email address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                aria-describedby="emailHelp"
                value={this.state.email}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="nameInput">Your name</label>
              <input
                type="name"
                className="form-control"
                name="name"
                id="name"
                aria-describedby="nameHelp"
                value={this.state.name}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="passwordInput">Member since:</label>
              <input
                type="text"
                className="form-control"
                name="memberSince"
                id="createdOn"
                value={this.state.created_on}
                disabled
              />
            </div>
            <div className="form-group">
              {this.state.admin && <label htmlFor='admin'>You have admin rights! Do whatever you want!</label>}
            </div>
          </div>
        </div>
        <Link className="btn btn-success" to='/edit-user'>Edit your details</Link>
      </div>
    );
  }
}
