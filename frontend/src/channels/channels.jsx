import React, { Component } from 'react';
import style from './channels.module.css';
import Modal from '../sidePanelModal/modal';

import { connect } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import { setCurrentChannel } from '../redux/actions/currentChannelAction';

class Channels extends Component {

  state = {
    showModal: false,
    modalInputName: '',
  }

  toggleModal = () => {
    this.setState(prev => ({
      showModal: !prev.showModal,
      modalInputName: '',
      modalInputDescription: ''
    }))
  }

  handleChange = ({ target }) => {
    this.setState({
      [target.name]: target.value,
    });
  };

  isFormFilled = ({ modalInputName, modalInputDescription }) => modalInputName && modalInputDescription;

  changeCurrentChannel = (el) => {
    this.props.setCurrentChannel(el)
  };

  createChannel = () => {
    let obj = {
        channelName: this.state.modalInputName,  
        author: this.props.currentUser.email, 
        type: 'public',
    }
    this.props.setActiveItemId(this.state.modalInputName)
    this.setState({
        showModal: false,
        modalInputName: '',
    })
    window.socket.emit('create-channel', obj)
}

  render() {
    let { showModal, modalInputName} = this.state;
    const {allChannels} = this.props

    return (
      <div className={style.channelsWrapper}>
        <div className={style.channelTitle}>
          <h3>Channels</h3>
          <FaPlus onClick={this.toggleModal} className={style.channelIcon}/>
        </div>
        <div className={style.line}></div>
        {showModal && <Modal toggleModal={this.toggleModal} name={'Add new channel'} func={this.createChannel}>
          <input className={style.modalInput} value={modalInputName} onChange={this.handleChange} type="text" name='modalInputName' placeholder='Enter a channel name' />
          {/* <input className={style.modalInput} value={modalInputDescription} onChange={this.handleChange} type="text" name='modalInputDescription' placeholder='Enter a channel description' /> */}
        </Modal>}
        <ul className={style.channelList}>
          {allChannels.sort((a, b) => a.channelName !== b.channelName ? a.channelName < b.channelName ? -1 : 1 : 0).sort((a, b) => a.channelName !== b.channelName ? a.channelName === 'General' ? -1 : 1 : 0).map(el => el.type === 'public' ? <li onClick={() => {this.changeCurrentChannel(el); this.props.setActiveItemId(el.channelName); }}
            className={this.props.getActiveItemId() !== el.channelName ? style.channelItem : `${style.channelItem} ${style.activeItem}`} key={el._id}>{`# ${el.channelName}`}</li> : null)}
        </ul>
      </div>
    )
  }
}
function MSTP (state) {
  return {
      allChannels: state.allChannels,
      currentChannel: state.currentChannel,
      currentUser : state.currentUser,
  }
}

const MDTP = dispatch => ({
    setCurrentChannel: function (data){
      dispatch(setCurrentChannel(data))
  },
});

export default connect(MSTP, MDTP)(Channels);
