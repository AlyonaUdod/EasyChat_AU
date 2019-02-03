import React, { Component } from 'react';
import { Container, MessageHeader, Segment, Comment, Input, Button, Header, Icon} from 'semantic-ui-react';
import moment from 'moment';
import uuidv4 from 'uuid'
// import uuid from 'uuid';
import md5 from 'md5'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'



class Chat extends Component {
    state = {
        online: this.props.online,
        input:'',
        author: {
            name: this.props.user,
            avatar: this.props.currentUser.avatar, 
            email: this.props.currentUser.email, 
        },
        newMessage: true,
        editMessage: {},
        typingUser: '',
        showEmoji: false,
        users: this.props.allUsers,
        currentChannel: this.props.currentChannel,
    }

    componentDidMount(){        
        window.socket.on("change-online", (online) => {
            this.setState({
                online: online,
                typingUser: '',
            })
        })

        this.scrollToBottom()

        window.socket.on("new-message", (message) => {
            this.setState (prev => ({
                messages: [...prev.messages, message],
                typingUser: '',
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
            this.sendMessageToChannel();
        }
    }

    sendMessageToChannel=()=> {
        if (this.state.newMessage) {
            let message = {
                time: Date.now(),
                content: this.state.input,
                author: this.state.author.email,
                messageId: uuidv4(),
                edited: false,
                }
            let obj = {
                message: message,
                currentChannel: this.props.currentChannel._id
            }
            // console.log(obj)
            this.setState({
                input: '',
                showEmoji: false,

            })
            window.socket.emit("channel-message", obj); 
        } else {
            let editMess = {...this.state.editMessage, content: this.state.input, edited: true}
            console.log(editMess)
            this.setState(prev =>({
                newMessage: true,
                editMessage: {},
                input: '',
                showEmoji: false,
                // currentChannel: prev.currentChannel.messages.map(el => el.messageId === editMess.messageId ? editMess : el)
            }))

            let obj={
                message: editMess,
                currentChannel: this.props.currentChannel._id,
            }

            console.log(obj)
            window.socket.emit("editChannelMessage", obj);    
        }
    }

    

    showEmoji = () => {
        this.setState(prev=>({
            showEmoji: !prev.showEmoji,
        }))
    }

    deleteMessage = (e) => {
        let id = e.target.id
        let obj={
            messageId:id ,
            currentChannel: this.props.currentChannel._id,
        }
        window.socket.emit('deleteChannelMessage', obj)
        // this.setState(prev =>({
        //     messages: prev.messages.filter(el => el.messageId !== id)
        // }))
    }

    editMessage = (e) => {
        let id = e.target.id
        // let message = this.state.messages.find(el => el.messageId === id)
        let message = this.props.currentChannel.messages.find(el => el.messageId === id)
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

      messageUserAvatar = (email) => {
        let a = this.props.allUsers.find(item => item.email === email)
        // console.log(a)
        if (a !== undefined) {
            if(a.avatar) {
                    return <Comment.Avatar src={a.avatar}/>
                } else {
                    let b = a.username
                    return <Comment.Avatar src={`https://gravatar.com/avatar/${md5(`${b}`)}?d=identicon`}/>
            }
          } else {
            let b = a.username
            return <Comment.Avatar src={`https://gravatar.com/avatar/${md5(`${b}`)}?d=identicon`}/>
          }   
      }

      messageUserName = (email) => {
        let a = this.props.allUsers.find(item => item.email === email) 
        return a.username
      }
      getChannelName=()=> {
          if(this.props.currentChannel) {
                console.log('rrrr')
                let arr = this.props.currentChannel.channelName.split('/')
                // console.log(arr)
                let arr2 = []
                for(let el of this.props.allUsers) {
                    for(let ell of arr) {
                        console.log(ell)
                       if(el.email === ell){
                           arr2.push(el.username) 
                        }
                    }
                }
                // let arr3 = this.props.allUsers.filter(el => arr.map(ell => el.email === ell))
                console.log(arr2)
                let arr3 = arr2.filter(el => el !== this.props.currentUser.username)
                console.log(arr3)
                if(arr3.length !== 0) {
                    return arr3[0]
                } else {
                    return `${this.props.currentUser.username} (you)`
                }
               
          }
      
      }
      
  render() {

      const {input, messages, typingUser}= this.state;   
      const { currentChannel} = this.props;
  

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
                  <Header.Subheader style={{color:'black', fontWeight: '700'}}>
                     {currentChannel && currentChannel.type === 'public' ? `${currentChannel.channelName}/Online Users:${this.state.online}` : this.getChannelName()}  
                     {/* / Online Users: {this.state.online} */}
                  </Header.Subheader>
                  </Header>
              </Segment>
  
               <Comment.Group className='messages'>
              {/* <div ref={node =>{this.messageEnd = node}}> */}
              {/* </div> */}
               {this.props.currentChannel && this.props.currentChannel.messages.map( el =>
                <div ref={node =>{this.messageEnd = node}} key={el.messageId+el.content} className='single-mes'>
                   <Comment id={el.messageId} key={el.messageId+el.time}>
  
                  {this.props.allUsers && this.messageUserAvatar(el.author)}
                  
                   <Comment.Content className={this.state.author.name === el.author ? 'message__self' : null}>
                       <Comment.Author as='a'>
                       {this.props.allUsers && this.messageUserName(el.author)}
                       </Comment.Author>
                       <Comment.Metadata>
                           {moment(el.time).format('LLLL')}
                       </Comment.Metadata>
                    <Comment.Text>{el.content}</Comment.Text>
                    {this.state.author.email === el.author ?  
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
                ) }
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
                      autoFocus
                     />
                  
                    { this.state.showEmoji && <span className='emoji'> <Picker  style={{width: '205px'}} onSelect={this.addEmoji}/> </span>}
                  
                  <Button.Group icon widths='2'>
                      <Button color='orange' content='Add Reply' labelPosition='left' icon='edit' onClick={this.sendMessageToChannel} />
                  </Button.Group>
              </Segment>
  
          </Container>
        </div>
      ) 
  }
}

export default Chat