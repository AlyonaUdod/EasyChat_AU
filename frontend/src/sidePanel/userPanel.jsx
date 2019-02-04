import React, { Component } from 'react';
import style from './userPanel.module.css';
import Modal from '../sidePanelModal/modal';
import AvatarEditor from 'react-avatar-editor';
import { FaEllipsisH } from 'react-icons/fa';
import { connect } from 'react-redux'
import { withRouter} from 'react-router-dom';
import md5 from 'md5'

import {removeAllChannels} from '../redux/actions/allChannelsAction';
import {removeAllUsers} from '../redux/actions/allUsersAction';
import {removeCurrentChannel} from '../redux/actions/currentChannelAction';
import {removeCurrentUser} from '../redux/actions/currentUserAction';


class UserPanel extends Component {

    state = {
        dropdown: false,
        showModal: false,
        previewImage: '',
        croppedImage: '',
        blob: '',
    }

    toggleDropdown = () => {
        this.setState(prev => ({
            dropdown: !prev.dropdown
        }));
    }

    toggleModal = () => {
        this.setState(prev => ({
            showModal: !prev.showModal,
            previewImage: '',
            croppedImage: '',
            blob: '',
        }));
    }

    handleChange = event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                this.setState({ previewImage: reader.result });
            })
        }
    };

    handleCropImage = () => {
        if (this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);
                this.setState({
                    croppedImage: imageUrl,
                    blob,
                })
            })
        }
    };

    funcChangeAvatar = () => {
        if (this.state.previewImage) {
          let obj = {
            id: this.props.currentUser._id,
            img: this.state.previewImage,
          }
        window.socket.emit('change-user-avatar', obj)
        this.toggleModal()
        }
    }

    signOut = () => {
        this.props.removeAllChannels()
        this.props.removeAllUsers()
        this.props.removeCurrentUser()
        this.props.removeCurrentChannel()
        this.props.history.push('/login')
        window.socket.emit('user-sign-out', this.props.clientId)
    }

    render() {

        // const imageSrc = 'https://cdn.vox-cdn.com/thumbor/TiwabydzgLgAVBjjJvAO_dnKo_o=/0x16:1103x751/1200x800/filters:focal(0x16:1103x751)/cdn.vox-cdn.com/uploads/chorus_image/image/46840054/Screenshot_2015-07-27_15.11.13.0.0.png';
        let { dropdown, showModal, previewImage, croppedImage } = this.state;
        const { currentUser } = this.props;
        return (
            <div className={style.wrapper}>
                <div className={style.avatarAndUsername}>
                    <img className={style.avatar} src={currentUser.avatar ? currentUser.avatar : `https://gravatar.com/avatar/${md5(currentUser.username)}?d=identicon`} alt='avatar' />
                    <span className={style.userName}>{currentUser.username}</span>
                </div>
                <div className={style.dropdownWrapper}>
                    <FaEllipsisH onClick={this.toggleDropdown} className={style.dropdownBtn}/>
                    {dropdown && <div className={style.dropdownList} onClick={this.toggleDropdown}>
                        <span onClick={this.signOut}><i className="fa fa-sign-out" ></i> Sign Out</span>
                        <span onClick={this.toggleModal}><i className="fa fa-image"></i> Change Avatar</span>
                    </div>}
                </div>
                {showModal && <Modal toggleModal={this.toggleModal} name={'Change avatar'} func={this.funcChangeAvatar}>
                    <input className={style.btn} type="file" onChange={this.handleChange} />
                    {previewImage && <div className={style.previewBloack}>
                        {previewImage && this.handleCropImage()}
                        <AvatarEditor
                            onLoadSuccess={this.handleCropImage}
                            ref={node => (this.avatarEditor = node)}
                            image={previewImage}
                            width={120}
                            height={120}
                            border={50}
                            scale={1.2} />
                        <span><i><i style={{ fontSize: '3rem', color: '#273247' }} className="fa fa-arrow-circle-o-right"></i></i></span>
                        {croppedImage && <img className={style.prevImg} src={croppedImage} alt='prev img' />}
                    </div>}
                </Modal>}
            </div>
        )
    }
}

function MSTP (state) {
    return {
        // allChannels: state.allChannels,
        // allUsers: state.allUsers,
        // currentChannel:state.currentChannel,
        currentUser : state.currentUser,
        clientId: state.clientId,
    }
}

function MDTP (dispatch) {
    return {
        removeAllChannels: function(){
            dispatch(removeAllChannels())
        },
        removeAllUsers: function(){
            dispatch(removeAllUsers())
        },
        removeCurrentChannel: function (){
            dispatch(removeCurrentChannel())
        },
        removeCurrentUser: function(){
            dispatch(removeCurrentUser())
        },
    }
  }

export default withRouter(connect(MSTP, MDTP)(UserPanel));
