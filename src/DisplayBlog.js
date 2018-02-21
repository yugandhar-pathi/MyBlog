import React,{Component} from 'react'
import { Container } from 'semantic-ui-react'

import {
  Route,
  NavLink,
  BrowserRouter,
  Redirect
} from 'react-router-dom';

//{"_id":"5a8a82076c79bb0e6cb24f05","title":"hi","body":"hello","date":"2018-02-19T00:00:00.000Z"}

export default class DisplayBlog extends Component {

	constructor(props){
		super(props);
		console.log(props);
		/*this.state = {
		  error: null,
		  isLoaded: false,
		  blog: ''
		};*/
		this.state = {
		  error: null,
		  isLoaded: true,
		  blog: {"_id":"5a8a82076c79bb0e6cb24f05","title":"hi","body":"hello","date":"2018-02-19T00:00:00.000Z"}
		};
	}
	
	componentDidMount() {
		const blogId = this.props.match.params.id;
		/*console.log("Blog id is :"+blogId);
		fetch("/fetchBlog/"+blogId)
		  .then(res => res.json())
		  .then(
			(result) => {
			  this.setState({
				isLoaded: true,
				blog: result.blog
			  });
			},
			(error) => {
			  this.setState({
				isLoaded: true,
				error
			  });
			}
		  )*/
	}
	
	render(){
		const { error, isLoaded, blog } = this.state;
		if (error) {
		  return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
		  return <div>Loading...</div>;
		} else {
		  return (
			<BrowserRouter>
				<Container textAlign="justified">
					<h1>{blog.title}</h1>
					<p>{blog.body}</p>
				</Container>
			</BrowserRouter>
		  );
		}
	}
}