import React, { Component } from 'react';
import { Container,List } from 'semantic-ui-react'
import {
  BrowserRouter,
  NavLink
} from "react-router-dom";

export default class HomePage extends Component {

	constructor(props){
		super(props)
		
		this.state = {
		  error: null,
		  isLoaded: false,
		  items: []
		};
	}
	
	componentDidMount() {
		fetch("/fetchBlogList")
		  .then(res => res.json())
		  .then(
			(result) => {
			  this.setState({
				isLoaded: true,
				items: result.items
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
					<List>
						{items.map(item => (
							<List.Item id={item._id}>
								<NavLink to={"/DisplayBlog/"+item._id}>
									<List.Content>
										<List.Header as='a'>{item.title}</List.Header>
										<List.Description as='a'> by ..{item.author} on {item.date}</List.Description>
									</List.Content>
								</NavLink>
							</List.Item>
						  ))}
					</List>
				</Container>
			</BrowserRouter>
		  );
		}
	}


}