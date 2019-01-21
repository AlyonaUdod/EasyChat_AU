import React, { Component } from 'react';
import { Container, MessageHeader, Segment, Comment, Input, Button, Header, Icon} from 'semantic-ui-react';
import moment from 'moment';
import uuidv4 from 'uuid'
import md5 from 'md5'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'



class Chat extends Component {
    state = {
        online: this.props.online,
        input:'',
        messages: this.props.messages,
        author: {
            name: this.props.user,
            avatar: `https://gravatar.com/avatar/${md5(this.props.user)}?d=identicon`},
        newMessage: true,
        editMessage: {},
        typingUser: '',
        showEmoji: false,
    }

    componentDidMount(){        

        window.socket.on("change-online", (online) => {
            this.setState({
                online: online
            })
        })

        this.scrollToBottom()

        window.socket.on("new-message", (message) => {
            this.setState (prev => ({
                messages: [...prev.messages, message],
                typingUser: '',
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
        window.socket.on('somebody-typing',(data) => {
            this.setState({
                typingUser: data,
            })
        })
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
         window.socket.emit('typing', this.state.author)  
    }   

    handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            this.sendMessage();
        }
    }

    sendMessage=()=>{

        if (this.state.newMessage) {
            if (this.state.input) {
                let message = {
                time: moment().format('LTS'),
                content: this.state.input,
                author: this.state.author.name,
                messageId: uuidv4(),
                }
                this.setState(prev =>({
                    messages:[...prev.messages, message],
                    input: '',
                    showEmoji: false,
                }))
                window.socket.emit("message", message);   
            }    
        } else {
            let editMess = {...this.state.editMessage, content: this.state.input}
            this.setState(prev =>({
                messages: prev.messages.map(el => el.messageId === editMess.messageId ? editMess : el),
                newMessage: true,
                editMessage: {},
                input: '',
                showEmoji: false,
            }))
            window.socket.emit("editMessage", editMess.messageId, editMess);    
        }
    }

    showEmoji = () => {
        this.setState(prev=>({
            showEmoji: !prev.showEmoji,
        }))
    }

    deleteMessage = (e) => {
        let id = e.target.id
        
        window.socket.emit('deleteMessage', id)
        this.setState(prev =>({
            messages: prev.messages.filter(el => el.messageId !== id)
        }))
    }

    editMessage = (e) => {
        let id = e.target.id
        let message = this.state.messages.find(el => el.messageId === id)
        this.setState({
            input: message.content,
            newMessage: false,
            editMessage: message,
        })
    }

    addEmoji = (e) => {
        //console.log(e.unified)
        if (e.unified.length <= 5){
          let emojiPic = String.fromCodePoint(`0x${e.unified}`)
          this.setState(prev=> ({
            input: prev.input + emojiPic
          }))
        }else {
          let sym = e.unified.split('-')
          let codesArray = []
          sym.forEach(el => codesArray.push('0x' + el))
          //console.log(codesArray.length)
          //console.log(codesArray)  // ["0x1f3f3", "0xfe0f"]
          let emojiPic = String.fromCodePoint(...codesArray)
          this.setState(prev=> ({
            input: prev.input + emojiPic
          }))
        }
      }

  render() {
      const {input, messages, typingUser}= this.state;
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
                    Online Users: {this.state.online}
                </Header.Subheader>
                </Header>
            </Segment>

             <Comment.Group className='messages'>
            {/* <div ref={node =>{this.messageEnd = node}}> */}
            {/* </div> */}
             {messages.length !== 0 ? messages.map( el =>
              <div ref={node =>{this.messageEnd = node}} key={el.messageId+el.content} className='single-mes'>
                 <Comment id={el.messageId}  >
                 <Comment.Avatar src={`https://gravatar.com/avatar/${md5(el.author)}?d=identicon`}/>
                 <Comment.Content className={this.state.author.name === el.author ? 'message__self' : null}>
                     <Comment.Author as='a'>
                        {el.author}
                     </Comment.Author>
                     <Comment.Metadata>
                        {el.time}
                     </Comment.Metadata>
                    {/* <Button icon='edit'/>
                    <Button icon='delete'/> */}
                  <Comment.Text>{el.content}</Comment.Text>
                  {this.state.author.name === el.author ?  
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
            <div ref={(el) => { this.messagesEnd = el; }}>
            </div>

            <div style={{fontStyle: 'italic', marginLeft: 10}}>{typingUser && `${typingUser.name} typing a message...`}</div>
             </Comment.Group>
           </Segment>


           <Segment className='message__form'>
                <Input
                    fluid
                    name='message'
                    style={{
                        marginBottom: '.7rem'
                    }}
                    label={<Button icon='smile outline' onClick={this.showEmoji}/>}
                    labelPosition='left'
                    placeholder='Write your message'
                    onChange={this.handlerChange}
                    onKeyDown = {this.handleKeyDown}
                    value={input}
                    data-emojiable="true"
                    autofocus
                   />
                
                  { this.state.showEmoji && <span className='emoji'> <Picker  style={{width: '205px'}} onSelect={this.addEmoji}/> </span>}
                
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