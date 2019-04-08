import React, { Component } from 'react';
import axios from 'axios';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : '',
      password: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleInputChange(event) {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  onSubmit(event) {
    event.preventDefault();
    axios.post('/api/authenticate', this.state)
      .then(res => {
        if (res.status === 200) {
          // run the login function in the parent component
          this.props.handleLogin();
          // redirect to /
          this.props.history.push('/');
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error logging in please try again');
      });
  }

  render() {
    return (
      <form method='POST' onSubmit={this.onSubmit}>
        <h3 style={{marginBottom:'20px'}}>Login below</h3>
        <div className="form-group">
          <label htmlFor="emailInput">Email address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={this.state.email}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="passwordInput">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="exampleInputPassword1"
            placeholder="Enter password"
            onChange={this.handleInputChange}
            value={this.state.password}
          />
        </div>
        <button type="submit" className="btn btn-primary">Log in</button>
      </form>
    );
  }
}
