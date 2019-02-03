import React, { Component } from 'react';
import Messages from '../Messages/Messages';
import SidePanel from '../sidePanel/sidePanel';
import style from './Chat.module.css';
import LinkPanel from '../LinkPanel/LinkPanel.jsx'
import Loader from 'react-loader-spinner';
import style2 from '../App.module.css';

import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {setCurrentChannel} from '../redux/actions/currentChannelAction';


class Chat extends Component {

    state = {
        toggleSidePanel: false,
        toggleLinkPanel: false,
        isLoading: true,
        error: '',
    }

    showSidePanel = (e) => {
        this.setState({
            toggleSidePanel: true,
        })
    }

    closeSidePanel = (e) => {
        this.setState({
            toggleSidePanel: false,
        })
    }

    showLinkPanel = (e) => {
        this.setState({
            toggleLinkPanel: true,
        })
    }

    closeLinkPanel = (e) => {
        this.setState({
            toggleLinkPanel: false,
        })
    }

    componentDidMount() {
        window.socket.on("channel-created", (obj) => {
            // console.log(obj)
           this.props.setCurrentChannel(obj)
        })
    }

   componentDidUpdate(prevProps){   
        if (prevProps !== this.props) {
            if (this.props.allChannels.length && this.props.allUsers.length && this.props.currentUser.username && this.props.currentChannel.channelName) {
                this.setState({
                    isLoading: false
                })
            }
        }  
        window.socket.on("channel-created", (obj) => {
            console.log(obj)
           this.props.setCurrentChannel(obj)
        })
    }

    render() {
        const { isLoading } = this.state

        return (
            <div> {isLoading ?  
                    <div className={style2.loader}>
                        <Loader type="Watch" color="#1f8efa" height='100' width='100' />
                    </div> 
                    :   
                <div className={style.chat}>

                    <SidePanel toggleSidePanel={this.state.toggleSidePanel}/>
                    <div onClick={this.closeSidePanel} className={this.state.toggleSidePanel ?style.divCloseSidePanel : null}></div>

                    <Messages showSidePanel={this.showSidePanel} showLinkPanel={this.showLinkPanel}/>

                    <LinkPanel toggleLinkPanel={this.state.toggleLinkPanel}/>
                    <div onClick={this.closeLinkPanel} className={this.state.toggleLinkPanel ? style.divCloseLinkPanel : null}></div>
                    
                </div> 
        }
            </div>
        );
    }
}

function MSTP (state) {
  return {
      allChannels: state.allChannels,
      allUsers: state.allUsers,
      currentChannel: state.currentChannel,
      currentUser : state.currentUser,
  }
}

function MDTP (dispatch) {
  return {
        setCurrentChannel: function (data){
          dispatch(setCurrentChannel(data))
      },
  }
}

export default withRouter(connect(MSTP, MDTP)(Chat));

