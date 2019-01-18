import React, { Component } from 'react';
import { Container, MessageHeader, Segment, Comment, Input, Button, Header, Icon} from 'semantic-ui-react';
import moment from 'moment';
import socket from "socket.io-client";
import axios from "axios";
window.socket = socket(window.location.origin, {
    path: "/chat/"
});

class Chat extends Component {
    state = {
        online: 1,
        input:'',
        messages:[],
    }

    componentDidMount(){
        // axios.get('http://localhost:3003/')
        //     .then( data => this.setState({messages: data.data}))
        //     .catch( err => console.log(err))

        window.socket.on("change-online", (online) => {
            this.setState({
                online: online
            })
        })
        window.socket.on("all-masseges", (data) => {
            this.setState({
                messages: data.data
            })
        })
        window.socket.on("new-message", (message) => {
            // this.props.getMessage(message);
            this.setState (prev => ({
                messages: [...prev.messages, message],
            }))
        });
    }
    

    handlerChange=(e)=>{
      this.setState({
          input:e.target.value
      })
    }

    recMessage=()=>{
        let content = {
            time: moment().format('LTS'),
            message:this.state.input,
        }
        this.setState(prev =>({
            messages:[...prev.messages,content],
            input: '',
        }))
        window.socket.emit("message", content);        
}


  render() {
      const {input , messages}= this.state;
    return (
      <div className='container'>
        <Container fluid>

        <MessageHeader/>
           <Segment>

           <Segment clearing>
                <Header 
                fluid='true'
                as='h2'
                floated='left'
                style={{
                    marginBottom: 0
                }}>
                <Header.Subheader>
                    Our Chat / Online Users: {this.state.online}
                </Header.Subheader>
                </Header>
            </Segment>

             <Comment.Group className='messages'>
             {messages.map( el =>
                 <Comment>
                 <Comment.Avatar/>
                 <Comment.Content>
                     <Comment.Author as='a'>
                         author
                     </Comment.Author>
                     <Comment.Metadata>
                        {el.time}
                     </Comment.Metadata>

                  <Comment.Text>{el.message}</Comment.Text>
                 </Comment.Content>
             </Comment>)}

             </Comment.Group>
           </Segment>


           <Segment className='message__form'>
                <Input
                    fluid
                    name='message'
                    style={{
                        marginBottom: '.7rem'
                    }}
                    label={<Button icon='add'/>}
                    labelPosition='left'
                    placeholder='Write your message'
                    onChange={this.handlerChange}
                    value={this.state.input}
                   />
                <Button.Group icon widths='2'>
                    <Button color='orange' content='Add Reply' labelPosition='left' icon='edit' onClick={this.recMessage} />
                    {/* <Button color='teal' content='Upload media' labelPosition='right' icon='cloud upload' onClick={this.toggleModal}/> */}
                </Button.Group>
            </Segment>



        </Container>
      </div>
    )
  }
}

export default Chat
