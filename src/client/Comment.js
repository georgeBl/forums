import React, {Component} from 'react';

export default class Comment extends Component {
  render() {
    return(
      <div className='row'>
        <div className='col'>
          <small className='text-primary font-italic'>{this.props.name}</small>
          <p>{this.props.comment}</p>
          <hr />
        </div>
      </div>
    );
  }
}
