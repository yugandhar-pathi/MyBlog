import React,{Component} from 'react'
import { Form,List,Container,Button,Header,TextArea,Message } from 'semantic-ui-react'

/*
	This page displays blog posted by user.
	Fetches blog details on mount
*/


export default class DisplayBlog extends Component {

	constructor(props){
		super(props);
		console.log(props);
		this.state = {
		  error: null,
		  isLoaded: false,
		  blog: '',
		  comments:[],
		  displayCommentsForm:false,
		  commentToPost:'',
		  isCommentEmpty:false
		};

		/*this.state = {
		  error: null,
		  isLoaded: true,
		  blog: {"_id":"5a8a82076c79bb0e6cb24f05","title":"hi","body":"hello","date":"2018-02-19T00:00:00.000Z"},
		  comments:[{"_id":"5a8a82076c79bb0e6cb24f05",author:'yug.pathi',comment:'hello',date:'Feb 2018'},{"_id":"123",author:'yug.pathi',comment:'hello',date:'Feb 2018'}],
		  displayCommentsForm:false,
		  commentToPost:'',
		  isCommentEmpty:false
		};*/
		
		this.displayCommentsForm = this.displayCommentsForm.bind(this);
		this.postComment = this.postComment.bind(this);
		this.blogId = this.props.match.params.id;
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange(event){
		const target = event.target
		const value = target.value

		this.setState({
			commentToPost:value,
			isCommentEmpty:false
		})
	}
	
	componentDidMount() {
		//const blogId = this.props.match.params.id;
		console.log("Blog id is :"+this.blogId);
		fetch("/fetchBlog/"+this.blogId)
		  .then(res => res.json())
		  .then(
			(result) => {
			  this.setState({
				isLoaded: true,
				blog: result.blog,
				comments:result.comments
			  });
			},
			(error) => {
			  this.setState({
				isLoaded: true,
				error:error
			  });
			}
		  )
	}
	
	postComment(){
		var myApp = this;
		var comment = myApp.state.commentToPost;
		if(comment.length == 0){
			this.setState({
				isCommentEmpty:true
			});
			return;
		}
		
		fetch("/postComment",{
			method:'POST',
			headers:{
				'Content-Type':'application/json'
			},
			credentials: 'same-origin',
			body:JSON.stringify({ 	 
									comment : myApp.state.commentToPost,
									blogId : myApp.blogId,
									date : (new Date).toDateString()
								})	
		})
		  .then(res => res.json())
		  .then(
			(result) => {
			  this.setState({
				comments:result.comments,
				displayCommentsForm:false,
				commentToPost:'',
				isCommentEmpty:false
			  });
			},
			(error) => {

			}
		  )
	}
	
	displayCommentsForm(){
		//check if user is authenticated
		var myApp = this;
		fetch("/isAuthenticationRequired",{
			credentials: 'same-origin',
		}).then(res => res.json())
		  .then(
			(result) => {
				if(result.auth){
					//User is already authenticated
					this.setState({
					  displayCommentsForm:true
					});
				}else{
					//User is not authenticated, display login screen
					sessionStorage.setItem('onLoginSuccess', myApp.props.location.pathname );
					myApp.props.history.push("/Login");
				}
			},
			(error) => {
				//fall back case.
				myApp.props.history.push("/Login");
			}
		  )

	}
	
	render(){

		const { error, isLoaded, blog, comments, displayCommentsForm,commentToPost,isCommentEmpty} = this.state;
		
		if (error) {
		  return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
		  return <div>Loading...</div>;
		} else {
		  return (
				<Container textAlign="justified">
					<Header as='h1'>{blog.title}</Header>
					<p>{blog.body}</p>
					<Container>
						<Header as='h3'>Comments:</Header>
						{ comments.length ?
							<List>
								{comments.map(item => (
									<List.Item key={item._id}>
										<List.Content>
											<List.Header>{item.author} on {item.date} Says ..</List.Header>
											<List.Description> {item.comment} </List.Description>
										</List.Content>
									</List.Item>
								  ))}
							</List> :
							<p>Be the first one to Comment</p>
						}
					</Container>
					<Container textAlign="justified" className="Top-Margin">
						<Header as='h4'>You have some thing to say?</Header>
						<Button onClick={this.displayCommentsForm}>Go-Ahead</Button>
						<p></p>
						{ displayCommentsForm ?
						<Container textAlign="justified">
							<Form onSubmit={this.handleSubmit}>
								<Form.Field control={TextArea} name='body' onChange={this.handleChange} style={{ minHeight: 200 }} placeholder='Start writing ...' />
								{isCommentEmpty ? <Message content="Empty comment can't be posted."/>:<p></p>}
								<Form.Button onClick={this.postComment}>Post</Form.Button>
							</Form>
						</Container> : 
						<p></p>}
					</Container>
				</Container>
		  );
		}
	}
}