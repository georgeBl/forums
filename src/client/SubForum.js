import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';

class SubForum extends Component {
  render() {
    return(
      <div className='col-6'>
        <Link className='custom-link' to={`/${this.props.name}`}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title card-title-text">{this.props.name.charAt(0).toUpperCase() + this.props.name.slice(1)}</h5>
              <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            </div>
            <img className="card-img-bottom subforum-image" alt='Subforum Picture'   src={this.props.logo} alt="Card image cap" />
          </div>
        </Link>
      </div>

    );
  }
}

export default SubForum;
