import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';




export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
        loggedIn:false
      };
    }

    componentDidMount() {
      axios.get('/api/checkToken')
        .then(res => {
          if (res.status === 200) {
            this.setState({ loading: false, loggedIn:true });
          } else {
            const error = new Error(res.error);
            localStorage.setItem('loggedIn', 'false');
            // throw error;
            // console.log('you are not logged in so you will not post stuff');
          }
        })
        .catch(err => {
          // console.error(err);
          this.setState({ loading: false, redirect: true, loggedIn:false });
          localStorage.setItem('loggedIn', 'false');
        });
    }


    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/login" />;
      }
      return (
        <React.Fragment>
          <ComponentToProtect {...this.props}  loggedIn={this.state.loggedIn}/>
        </React.Fragment>
      );
    }
  };
}
