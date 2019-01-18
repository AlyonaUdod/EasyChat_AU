import React, { Component } from 'react';
import { Container, MessageHeader, Segment, Comment, Input, Button, Header, Icon} from 'semantic-ui-react';
import moment from 'moment';
import socket from "socket.io-client";

window.socket = socket(window.location.origin, {
    path: "/chat/"
});

class Chat extends Component {
    state = {
        online: 1,
        input:'',
        messages:[],
        author: this.props.user,
    }

    componentDidMount(){
        window.socket.on("all-messages", (docs) => {
            console.log(docs)
            this.setState({
                messages: docs,
            })
        })
        window.socket.on("change-online", (online) => {
            this.setState({
                online: online
            })
        })
        window.socket.on("new-message", (message) => {
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

    sendMessage=()=>{
        let message = {
            time: moment().format('LTS'),
            content: this.state.input,
            author: this.state.author,
        }
        this.setState(prev =>({
            messages:[...prev.messages, message],
            input: '',
        }))
        window.socket.emit("message", message);        
}


  render() {
      const {input, messages}= this.state;
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
            {/* ref={node =>{this.messageEnd = node}} */}
             <Comment.Group className='messages'>
             {messages.map( el =>
                 <Comment key={el.time+el.content}>
                 <Comment.Avatar/>
                 <Comment.Content>
                     <Comment.Author as='a'>
                        {el.author}, {el.autorId}
                     </Comment.Author>
                     <Comment.Metadata>
                        {el.time}
                     </Comment.Metadata>

                  <Comment.Text>{el.content}</Comment.Text>
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
                    value={input}
                   />
                <Button.Group icon widths='2'>
                    <Button color='orange' content='Add Reply' labelPosition='left' icon='edit' onClick={this.sendMessage} />

                </Button.Group>
            </Segment>


        </Container>
      </div>
    )
  }
}

export default Chat