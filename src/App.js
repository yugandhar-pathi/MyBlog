import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Menu,Modal,Button,Form } from 'semantic-ui-react'


import {
  Route,
  NavLink,
  BrowserRouter
} from "react-router-dom";

import RegisterUser from './RegisterUser.js'
import Login from './Login.js'
import HomePage from './HomePage.js'
import PostBlog from './PostBlog.js'
import DisplayBlog from './DisplayBlog.js'


class App extends Component {
	
	constructor(props){
		super(props);
		console.log("====props"+JSON.stringify(props));
	}

	render() {		
		return (
			<BrowserRouter>
				<div>
					<Menu className="NavBar">
						<Menu.Item name='TechBlogs'><NavLink to="/">Pathi Yugandhar's Tech Blogs</NavLink></Menu.Item>
						<Menu.Menu position='right'>
							<Menu.Item><NavLink to="/">Home</NavLink></Menu.Item>
						</Menu.Menu>
					</Menu>
					<div className="content">
						<Route exact path="/" component={HomePage}/>
						<Route path="/RegisterUser" component={RegisterUser}/>
						<Route path="/PostBlog" component={PostBlog}/>
						<Route path="/Login" component={Login}/>
						<Route path="/DisplayBlog/:id" component={DisplayBlog}/>
					</div>
				</div>
			</BrowserRouter>

			);
	}
}

export default App;
