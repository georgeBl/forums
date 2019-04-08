import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class Navbar extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
          <div className='container'>
            <Link className='navbar-brand' to="/">Home</Link>
            <ul className='navbar-nav mr-auto'>
              <li className='nav-item'>
                {this.props.loggedIn && <Link className='navbar-brand' to="/details">View Details</Link>}
              </li>
            </ul>
          </div>

          <ul className='navbar-nav ml-auto'>
            {!this.props.loggedIn && <li className='nav-item'><Link className='nav-link' to="/login">Login</Link> </li>}
            {!this.props.loggedIn && <li className='nav-item'><Link className='nav-link' to="/register">Register</Link></li>}
            {this.props.loggedIn && <li className='nav-item'><Link className='nav-link' to="/logout">Logout</Link></li>}
          </ul>

        </nav>
      </div>
    );
  }
}
