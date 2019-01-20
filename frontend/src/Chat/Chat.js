import React, { Component } from 'react';
import { Container, MessageHeader, Segment, Comment, Input, Button, Header, Icon} from 'semantic-ui-react';
import moment from 'moment';
import socket from "socket.io-client";
import uuidv4 from 'uuid'
// import axios from 'axios'
// import * as Scroll from 'react-scroll';
// import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
 

window.socket = socket(window.location.origin, {
    path: "/chat/"
}, {transports: ['websocket']});

class Chat extends Component {
    state = {
        online: this.props.online,
        input:'',
        messages: this.props.messages,
        author: this.props.user,
        newMessage: true,
        editMessage: {},
    }

    componentDidMount(){        
        // window.socket.on("all-messages", (docs) => {
        //     console.log('aaaaaaaaaaaaaa2')
        //     this.setState(prev => ({
        //         messages: [...docs],
        //     }))
        // })

        // axios.get('http://localhost:3003/')
        //     .then( data => this.setState({messages: data.data}))
        //     .catch( err => console.log(err))

        window.socket.on("change-online", (online) => {
            this.setState({
                online: online
            })
        })

        this.scrollToBottom()
        // scroll.scrollToBottom();

        window.socket.on("new-message", (message) => {
            // console.log('bbbbbb')
            this.setState (prev => ({
                messages: [...prev.messages, message],
            }))
        });

        window.socket.on("message-was-deleted", (id) => {
            this.setState(prev =>({
                messages: prev.messages.filter(el => el.messageId !== id)
            }))
        });
        window.socket.on("message-was-edited", (editMess) => {
            this.setState(prev =>({
                messages: prev.messages.map(el => el.messageId === editMess.messageId ? editMess : el)
            }))
        });
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }
      
    componentDidUpdate() {
        this.scrollToBottom();
      }

    handlerChange=(e)=>{
      this.setState({
          input:e.target.value
      })
    }

    sendMessage=()=>{
        if (this.state.newMessage) {
           let message = {
            time: moment().format('LTS'),
            content: this.state.input,
            author: this.state.author,
            messageId: uuidv4(),
            }
            this.setState(prev =>({
                messages:[...prev.messages, message],
                input: '',
            }))
            window.socket.emit("message", message);      
        } else {
            let editMess = {...this.state.editMessage, content: this.state.input}
            // console.log(mess)
            this.setState(prev =>({
                messages: prev.messages.map(el => el.messageId === editMess.messageId ? editMess : el),
                newMessage: true,
                editMessage: {},
                input: '',
            }))
            window.socket.emit("editMessage", editMess.messageId, editMess);    
        }
    }

    deleteMessage = (e) => {
        let id = e.target.id
        // console.log(id)
        
        window.socket.emit('deleteMessage', id)
        this.setState(prev =>({
            messages: prev.messages.filter(el => el.messageId !== id)
        }))
    }

    editMessage = (e) => {
        let id = e.target.id
        // console.log(id)
        let message = this.state.messages.find(el => el.messageId === id)
        // console.log(message)
        this.setState({
            input: message.content,
            newMessage: false,
            editMessage: message,
        })
    }




  render() {
      const {input, messages}= this.state;
      if (messages.length !== 0) {
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
            {/* className={this.state.author===el.author ? 'right' : null} 
        ref={node =>{this.messageEnd = node}}
        */}

             <Comment.Group className='messages'>
            {/* <div ref={node =>{this.messageEnd = node}}> */}
            {/* </div> */}
             {messages.length !== 0 ? messages.map( el =>
              <div ref={node =>{this.messageEnd = node}} key={el.messageId+el.content} className='single-mes'>
                 <Comment id={el.messageId}  >
                 <Comment.Avatar/>
                 <Comment.Content className={this.state.author === el.author ? 'message__self' : null}>
                     <Comment.Author as='a'>
                        {el.author}
                     </Comment.Author>
                     <Comment.Metadata>
                        {el.time}
                     </Comment.Metadata>
                    {/* <Button icon='edit'/>
                    <Button icon='delete'/> */}
                  <Comment.Text>{el.content}</Comment.Text>
                  {this.state.author === el.author ?  
                        <Comment.Actions>
                            <Comment.Action id={el.messageId} onClick={this.editMessage}> 
                                <Icon name='edit' id={el.messageId}/> Edit
                            </Comment.Action>
                            <Comment.Action id={el.messageId} onClick={this.deleteMessage}> 
                                <Icon name='delete' id={el.messageId}/> Delete
                            </Comment.Action>         
                        </Comment.Actions> : null}
                   
                 </Comment.Content>

             </Comment>
                </div>
              ) : <div> Waiting</div>}
             <div 
            //  style={{ float:"left", clear: "both" }}
                ref={(el) => { this.messagesEnd = el; }}>
            </div>
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
      } else {
          return (
              <div>loooo</div>
          )
      }
  }
}

export default Chat