import React, {Component} from 'react';

import {Redirect} from 'react-router-dom';
import axios from 'axios';

export default class EditThread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title:'',
      subtitle:'',
      body:'',
      image:'',
      titleError:false,
      bodyError:false,
      imageError:false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  editThread(e) {
    e.preventDefault();
    let submit = true;
    // validation
    // title cant be empty / body can't be empty / image has to be a link to an image
    // console.log(this.state);
    if(this.state.title === '' || this.state.title === null) {
      this.setState({titleError: true});
      // return null;
      submit = false;
    } else {
      this.setState({titleError: false});
    }
    if(this.state.body === '' || this.state.body === null) {
      this.setState({bodyError: true});
      submit = false;
      // return null;
    } else {
      this.setState({bodyError: false});
    }
    if(!this.isUriImage(this.state.image) && this.state.image !== '') {
      this.setState({imageError: true});
      submit = false;
    } else {
      this.setState({imageError: false});
    }
    if(submit) {
      axios.put(`/api/thread/${this.props.match.params.id}`, this.state)
        .then( res=> {
          this.props.history.push('/');
        })
        .catch( err => {
          // do something
        });
    }

  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  // link validation to be sure is picture; taken from sofv/questions/19395458
  isUriImage(uri) {
    uri = uri.split('?')[0];
    const parts = uri.split('.');
    const extension = parts[parts.length - 1];
    const imageTypes = ['jpg', 'jpeg', 'tiff', 'png', 'gif', 'bmp'];
    if(imageTypes.indexOf(extension) !== -1)
      return true;
    return false;
  }
  
  componentDidMount() {

    axios.get(`/api/thread/${this.props.match.params.id}`)
      .then(res =>{
        this.setState(res.data);
      })
      .catch(err=> {
        // do something
      });
  }

  render() {
    return(
      <div>
        <h5 className='text-left'>Edit your thread</h5>
        <form className='forum' method='POST' onSubmit={this.editThread.bind(this)}>
          <div className="form-group">
            <label htmlFor="titleInput">Title</label>
            <input type="text" className="form-control" name="title" id="title" value={this.state.title} aria-describedby="titleHelp" placeholder="Enter title" onChange={this.handleChange} required/>
            {this.state.titleError && <small id="titleError" className="form-text text-danger">Title can't be empty</small>}
          </div>
          <div className="form-group">
            <label htmlFor="subtitleInput">Subtitle</label>
            <input type="text" className="form-control" name="subtitle" id="subtitle"  value={this.state.subtitle} placeholder="Enter subtitle" onChange={this.handleChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="imageInput">Image</label>
            <input type="text" className="form-control" name="image" id="image"  value={this.state.image} placeholder="Enter image link" onChange={this.handleChange}/>
            {this.state.imageError && <small id="imageError" className="form-text text-danger">Image link is invalid</small>}
          </div>
          <div className="form-group">
            <label htmlFor="bodyInput">Body</label>
            <textarea className="form-control" name="body" id="body" value={this.state.body} onChange={this.handleChange} rows="5"></textarea>
            {this.state.bodyError && <small id="bodyError" className="form-text text-danger">Body can't be empty</small>}
          </div>

          <button type="submit" className="btn btn-success">Edit thread</button>
        </form>
      </div>
    );
  }
}
