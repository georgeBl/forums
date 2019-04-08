import React, {Component} from 'react';

import axios from 'axios';

export default class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      oldPassword:'',
      newPassword:''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    axios.get('/api/user')
      .then(res=>{
        delete res.data.password;
        this.setState(res.data);
      })
      .catch(err=>{

      });
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    axios.put('/api/user', this.state)
      .then(res=>{
        // this.props.history.push('/');
      })
      .catch(err=>{
        // in case the password is wrong
        // alert(err.message);
      });
  }


  render() {
    // there is an error happening there because the inputs don't have a onChange function but they dont need cause they are disabled and user is not suppose to click on them
    return(
      <div>
        <form method='POST' onSubmit={this.handleSubmit} >
          <input type="hidden" value="something"/>
          <h3> Edit your details </h3>
          <p className='font-weight-light font-italic'>Below are your details</p>
          <div className='row'>
            <div className='col-5'>
              <div className="form-group">
                <label htmlFor="nameInput">Your name</label>
                <input
                  type="name"
                  className="form-control"
                  name="name"
                  id="name"
                  aria-describedby="nameHelp"
                  value={this.state.name}
                  onChange={this.handleChange}
                  autoComplete="name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="passwordInput">Old password</label>
                <input
                  type="password"
                  className="form-control"
                  name="oldPassword"
                  id="oldPassword"
                  value={this.state.oldPassword}
                  onChange={this.handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="passwordInput">New password</label>
                <input
                  type="password"
                  className="form-control"
                  name="newPassword"
                  id="newPassword"
                  value={this.state.newPassword}
                  onChange={this.handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          </div>
          <button className='btn btn-success' type='submit' id='submit' name='submit' >Submit changes</button>
        </form>
      </div>
    );
  }
}
