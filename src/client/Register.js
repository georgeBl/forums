import React, { Component } from 'react';
import axios from 'axios';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : '',
      password: '',
      name:''
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
    axios.post('/api/register', this.state)
      .then(res => {
        if (res.status === 200) {
          this.props.history.push('/');
          this.props.handleLogin();
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error registering in please try again');
      });
  }

  render() {
    return (
      <form method='POST' onSubmit={this.onSubmit}>
        <h3 style={{marginBottom:'20px'}}>Register below</h3>
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
            required
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
            placeholder="Enter name"
            value={this.state.name}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="passwordInput">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="passwordInput"
            placeholder="Enter password"
            onChange={this.handleInputChange}
            value={this.state.password}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    );
  }
}
