import React, { Component } from 'react';
import style from './Messages.module.css';
import { FaRegSmile, FaSistrix, FaBars, FaChevronCircleLeft } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
import Message from '../Message/Message';
import uuidv4 from 'uuid';
import {setAllChannels} from '../redux/actions/allChannelsAction';
import {connect} from 'react-redux';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

// import {setAllUsers, removeAllUsers,updateAllUsers} from '../redux/actions/allUsersAction';
// import {setCurrentChannel} from '../redux/actions/currentChannelAction';
// import {setCurrentUser} from '../redux/actions/currentUserAction';


class Messages extends Component {

  state = {
    message: '',
    search: '',
    newMessage:true,
    editMessage:'',
    showEmoji: false,
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount () {
    this.scrollToBottom();
  }

  componentDidUpdate () {
    this.scrollToBottom();
  }

  deleteMessage = (e) => {
    //не срабатывает при нажатии на иконку, не считывает id
    let id = e.target.id
    console.log(id);
    let obj={
        messageId:id ,
        currentChannel: this.props.currentChannel._id,
    }
    console.log(obj)
     window.socket.emit('deleteChannelMessage', obj)
  }

  editMessage = (e) => {
      let id = e.target.id
      // let message = this.state.messages.find(el => el.messageId === id)
      let edit = this.props.currentChannel.messages.find(el => el.messageId === id)
      this.setState({
          message: edit.content,
          newMessage: false,
          editMessage: edit,
      })
  }

  sendMessageToChannel=(e)=> {
    e.preventDefault();
    if (this.state.newMessage) {
        let message = {
            time: Date.now(),
            content: this.state.message,
            author: this.props.currentUser.email,
            messageId: uuidv4(),
            edited: false,
            }
        let obj = {
            message: message,
            currentChannel: this.props.currentChannel._id
        }
        console.log(obj)
        this.setState({
            message: '',
            // showEmoji: false,
        })
        window.socket.emit("channel-message", obj); 
    } else {
        let editMess = {...this.state.editMessage, content: this.state.message, edited: true}
        console.log(editMess)
        this.setState(prev =>({
            newMessage: true,
            editMessage: {},
            message: '',
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


  handlerChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  uniqueNames=(arr)=> {
    let  obj = {};
      for (let i = 0; i < arr.length; i++) {
      let str = arr[i].author;
      obj[str] = true; // запомнить строку в виде свойства объекта
    }
    let result = [...Object.keys(obj)];
    let usersCount = result.length;

     return usersCount;
  }

  getChannelName=()=> {
    if(this.props.currentChannel) {
           let arr = this.props.currentChannel.channelName.split('/')
           let arr2 = []
          for(let el of this.props.allUsers) {
              for(let ell of arr) {
                 if(el.email === ell){
                     arr2.push(el.username) 
                  }
              }
          }
          let arr3 = arr2.filter(el => el !== this.props.currentUser.username)
          if(arr3.length !== 0) {
              return arr3[0]
          } else {
              return `${this.props.currentUser.username} (you)`
          }
    }
  }

  showEmoji = (e) => {
		e.preventDefault();
		this.setState(prev => ({
			showEmoji: !prev.showEmoji,
		}))
  }
  
  addEmoji = (e) => {
		//console.log(e.unified)
		if (e.unified.length <= 5) {
			let emojiPic = String.fromCodePoint(`0x${e.unified}`)
			this.setState(prev => ({
				message: prev.message + emojiPic
			}))
		} else {
			let sym = e.unified.split('-')
			let codesArray = []
			sym.forEach(el => codesArray.push('0x' + el))
			//console.log(codesArray.length)
			//console.log(codesArray)  // ["0x1f3f3", "0xfe0f"]
			let emojiPic = String.fromCodePoint(...codesArray)
			this.setState(prev => ({
				message: prev.message + emojiPic
			}))
		}
	}

  render() {

    let showMessages = this.props.currentChannel.messages.filter(el=>el.content.toLowerCase().includes(this.state.search)?el:null)
    
    return (
      <div className={style.main}>
        <div className={style.headerMain}>
          <FaBars onClick={this.props.showSidePanel} className={style.additionalButton}/>
          <div className={style.header}>
            <div className={style.headerName}>
              <h2 className={style.name}>{this.props.currentChannel.type === 'public' ? this.props.currentChannel.channelName : this.getChannelName()}  </h2>
              <p className={style.members}>{this.props.currentChannel.type === 'public' ? this.uniqueNames(this.props.currentChannel.messages) : 2} members</p>
            </div>
            <form className={style.headerForm} onSubmit={this.formSubmit}>
              <FaSistrix className={style.searchImg} />
              <input name='search' type="text" placeholder='Search...' className={style.search} value={this.state.search} onChange={this.handlerChange} />
            </form>
          </div>
          <FaChevronCircleLeft onClick={this.props.showLinkPanel} className={style.additionalButton}/>
        </div>
        <div className={style.messages}>
          <div className={style.messagesArea}>
          {/*отрисовываем сообщения */}
            <Message  editMessage = {this.editMessage} deleteMessage={this.deleteMessage} allUsers = {this.props.allUsers} currentUser={this.props.currentUser} messages={showMessages}/>
            <div ref={(el) => { this.messagesEnd = el; }}>
                </div>
          </div>
          <form className={style.messageForm} onSubmit={this.sendMessageToChannel}>
            {/* <MdAttachFile className={style.addFile} /> */}
            <input required type="text" placeholder='Enter the message' name='message' value={this.state.message} onChange={this.handlerChange} className={style.messageInput}  onKeyDown = {this.handleKeyDown}/>
            <FaRegSmile onClick={this.showEmoji} className={style.smile} />
            {this.state.showEmoji && 
              <span className={style.emoji}> 
                <Picker set='emojione' style={{ width: '20rem', showPreview: 'false', position: 'absolute', bottom: '20px', right: '20px' }} i18n={{ categories: { search: 'Résultats de recherche', recent: 'Récents' } }} onSelect={this.addEmoji} />
              </span>}
            <MdSend className={style.send} onClick={this.sendMessageToChannel} />
          </form>
        </div>
      </div>
    );
  }
}

function MSTP (state) {
  return {
      allChannels: state.allChannels,
      allUsers: state.allUsers,
      currentChannel:state.currentChannel,
      currentUser : state.currentUser,
  }
}
function MDTP (dispatch) {
  return {
      setAllChannels: function (data){
          dispatch(setAllChannels(data))
      },
    }
}

export default connect(MSTP, MDTP) (Messages);