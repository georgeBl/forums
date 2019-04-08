import React, {Component} from 'react';

import axios from 'axios';

export default class PostComment extends Component {
  constructor(props) {
    super(props);
    this.state = {loggedIn:false};
  }

  componentDidMount() {
    // TODO:
    // check if the user is logged in, if there is any token or if the token is not expired
    // we check in the cookies first to see if there is a cookie set with the token value, if not we won't do any api check to improve the performance
    // const token = Cookies.get('token');
    // console.log(Cookies.get());
    axios.get('/api/checkToken')
      .then(res => {
        if (res.status === 200) {
          // might move the loggedIn value into the App component if needed
          this.setState({ loggedIn: true });
        } else {
          const error = new Error(res.error);
          // throw error;
          // console.log('you are not logged in so you will not post stuff');
        }
      })
      .catch(err => {
        // console.error(err);
        this.setState({ loggedIn:false });
      });
  }


  render() {
    if(this.state.loggedIn) {
      return(
        <div>
          <textarea className="form-control" name='commentInput'  id='comment' rows="3"></textarea>
          <button className='btn  btn-primary float-right' style={{marginTop:'10px'}} onClick={this.props.submitComment}>Submit comment </button>
        </div>
      );
    }
    else {
      // might be good to add a component with a link to the login page in case it wants to add comments

      return (<div>Login to post comments.</div>);
    }
  }
}
