import React from 'react'
import { Container } from 'semantic-ui-react'

import {
  Route,
  NavLink,
  BrowserRouter,
  Redirect
} from "react-router-dom";

export default class DisplayBlog extends React.Component {

	constructor(props){
		super(props);
		console.log(props);
		this.state = {
		  error: null,
		  isLoaded: false,
		  blog: ''
		};
	}
	
	componentDidMount() {
		fetch("/fetchBlog")
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
		  )
	}
	
	render(){
		const { error, isLoaded, items } = this.state;
		if (error) {
		  return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
		  return <div>Loading...</div>;
		} else {
		  return (
			<BrowserRouter>
				<Container textAlign="justified">
					<h1></h1>
					<p></p>
				</Container>
			</BrowserRouter>
		  );
		}
	}
}