import React, { Component } from 'react';
import style from './LinkPanel.module.css';
import Modal from '../ModalLinkPanel/ModalLinkPanel';
import linkPanel_figure from '../img/linkPanel_figure.png';
import linkPanel_add from '../img/linkPanel_add.png';
import { FaGoogle, FaLinkedinIn, FaFacebookSquare, FaTrello, FaGoogleDrive, FaCalendarAlt, FaEnvelope, FaMusic, FaFileImage, FaTimes } from 'react-icons/fa';
import {connect} from 'react-redux';
import { MdStar } from "react-icons/md";
import uuidv4 from 'uuid/v4';
import deleteIcon from '../img/delete_blue.svg';
import { updateCurrentUser } from '../redux/actions/currentUserAction';
// import { IconContext } from "react-icons";

class LinkPanel extends Component {

  state = {
    showModal: false,
    imgActive: '',
    modalInputName: '',
    modalInputLink: '',
    iconName: '',
    links: this.props.currentUser.links,
    iconPack: [
      {
        url: <FaGoogle className={style.global}/>,
        id: 1,
        iconName: 'FaGoogle',
      },
      {
        url: <FaLinkedinIn className={style.global}/>,
        id: 2,
        iconName: 'FaLinkedinIn',
      },
      {
        url: <FaFacebookSquare className={style.global}/>,
        id: 3,
        iconName: 'FaFacebookSquare',
      },
      {
        url: <FaTrello className={style.global}/>,
        id: 4,
        iconName: 'FaTrello',
      },
      {
        url: <FaGoogleDrive className={style.global}/>,
        id: 5,
        iconName: 'FaGoogleDrive',
      },
      {
        url: <FaCalendarAlt className={style.global}/>,
        id: 6,
        iconName: 'FaCalendarAlt',
      },
      {
        url: <FaEnvelope className={style.global}/>,
        id: 7,
        iconName: 'FaEnvelope',
      },
      {
        url: <MdStar className={style.global}/>,
        id: 8,
        iconName: 'MdStar',
      },
      {
        url: <FaMusic className={style.global}/>,
        id: 9,
        iconName: 'FaMusic',
      },
      {
        url: <FaFileImage className={style.global}/>,
        id: 10,
        iconName: 'FaFileImage',
      }
    ]
  }

  handleChange = ({ target }) => {
    this.setState({
      [target.name]: target.value,
    });
  };

  activeSvg = (x) => {
    let image = this.state.iconPack.find(el => el.id === x);
    this.setState(({
      imgActive: x,
      iconName: image.iconName,
    }))
  };

  toggleModal = () => {
    this.setState(prev => ({
      showModal: !prev.showModal,
      modalInputName: '',
      modalInputLink: '',
      iconName: '',
      imgActive: '',
    }))
  };

  // addLinkToArr = () => {
  //   let linksAdd = {
  //     linkName: this.state.modalInputName,
  //     url: this.state.modalInputLink,
  //     iconName: this.state.iconName,
  //     linkId: uuidv4(),
  //   }
  //   this.setState(prev =>({
  //     links: [...prev.links, linksAdd]
  //   }));
  // };

  // deleteLinkFromArr = (e) =>{
  //   let linkId = e.target.id;
  //   this.setState(prev =>({
  //     links: [...prev.links.filter(el => el.linkId !== linkId)],
  //   }));
  // };

  isFormEmpty = ({modalInputName, modalInputLink, iconName}) => {
    return !modalInputName.length || !modalInputLink.length || !iconName.length;
  }

  addUserLink = () => {
    let link = {
      linkName: this.state.modalInputName,
      url: this.state.modalInputLink,
      iconName: this.state.iconName,
      linkId: uuidv4(),
    }
    let newLinks = [];

    if (this.props.currentUser.links) {
        let userLinks = this.props.currentUser.links;
        newLinks= [...userLinks, link]
    } else {
      newLinks=[link];
    }
    let sendToDB = {
      userEmail: this.props.currentUser.email,
      link: newLinks,
    }
    console.log(sendToDB);
    this.props.updateCurrentUser(newLinks);
    window.socket.emit("user-change-link", (sendToDB)); 
  }

  deleteUserLink =(e)=>{
    let linkId = e.target.id;
    let userLinks = this.props.currentUser.links;
    let filterUserLinks = userLinks.filter(el=>el.linkId!==linkId);
    let sendToDB = {
      userEmail: this.props.currentUser.email,
      link: filterUserLinks,
    }
    this.props.updateCurrentUser(filterUserLinks);
    window.socket.emit("user-change-link", (sendToDB))    
  }

  changeFunction = () => {
    if (!this.isFormEmpty(this.state)) {
      this.addUserLink();
      this.toggleModal();
    }
  };

  render() {
    const { showModal, modalInputName, modalInputLink, imgActive, links, iconPack } = this.state
    return (
      <div className={this.props.toggleLinkPanel ? style.linkPanel_container : style.linkPanel_container_none}>
        <div className={style.link_height}>
          <div className={style.icons}>
            {this.props.currentUser.links.map(el => 
              <div key={el.linkId} className={style.link_place}>
               <a className={style.link} title={el.linkName} href={el.url} target='_blank' rel="noopener noreferrer">
                {iconPack.find(item => item.iconName === el.iconName).url}
                </a>
                <img id={el.linkId} onClick={this.deleteUserLink} className={style.delete} src={deleteIcon} alt="deleteIcon"/>
                <img className={style.panel_line} src={linkPanel_figure} alt="figure" />
              </div>
            )}

          </div>
          <div className={style.panel_add} onClick={this.toggleModal}>
            <img src={linkPanel_add} alt="add" className={style.button}/>
          </div>
        </div>
        {showModal && <Modal toggleModal={this.toggleModal} changeFunction={this.changeFunction} name={'Add new channel'} imgActive={imgActive} modalInputLink={modalInputLink} modalInputName={modalInputName}>
            <input required className={style.modalInput} value={modalInputName} onChange={this.handleChange} type="text" name='modalInputName' placeholder='Enter name of link url ' />
            <input required className={style.modalInput} value={modalInputLink} onChange={this.handleChange} type="text" name='modalInputLink' placeholder='Enter link url' />
            <h4>Choose the icon:</h4>
            <ul className={style.card}>
              {this.state.iconPack.map( el => 
              <li onClick={() => this.activeSvg(el.id)} key={el.id} className={imgActive === el.id ? `${style.svgLink}` : `${style.svgFalse}`}>{el.url}
              </li>)}
            </ul>
        </Modal>}
      </div>
    );
  }
}

function MSTP (state) {
  return {
      // allChannels: state.allChannels,
      // allUsers: state.allUsers,
      // currentChannel: state.currentChannel,
      currentUser : state.currentUser,
      // clientId : state.clientId,
  }
}

function MDTP (dispatch) {
  return {
    updateCurrentUser: function (data){
          dispatch(updateCurrentUser(data))
      }
  }
}

export default connect(MSTP, MDTP)(LinkPanel);