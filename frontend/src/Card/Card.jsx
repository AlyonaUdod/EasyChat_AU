import React, { Component } from 'react';
import styles from './Card.module.css';
import moment from 'moment';
import edit from '../img/edit.svg';
import delIcon from '../img/delete.svg';

class Card extends Component {
state={
    userObj:this.props.allUsers.find(el=>el.email===this.props.email),
}
        
  render() {
    
    return (
        <div className={this.props.email===this.props.currentUser.email?styles.cardRight:styles.cardLeft}>
            <p className={styles.icon}>
            {this.props.avatarSrcFunction(this.props.email)}
             </p>
            <div className={styles.message_wrapper}>
                <ul className={this.props.email===this.props.currentUser.email?styles.message_infoRight:styles.message_infoLeft}>
                    <li className={styles.name}>{this.state.userObj.username}</li>
                    <li className={styles.time}>{moment(this.props.time).format('LLLL')}</li>
                </ul>
                {this.props.edited?
                 <p className={this.props.email===this.props.currentUser.email?styles.editedRight:styles.editedLeft}>edited</p>
                :null}
                
                <p className={this.props.email===this.props.currentUser.email?styles.textRight:styles.text}>
                    {this.props.content}
                </p>
                {this.props.email===this.props.currentUser.email?
                <p className={styles.text_icon}>
                    <span id={this.props.messageId} 
                    className={styles.text_icon_span}
                    onClick={this.props.editMessage}> 
                    <img src={edit} className={styles.text_image_span} alt='edit' id={this.props.messageId}/>
                    edit
                    </span>
                    <span id={this.props.messageId} className={styles.text_icon_span} onClick={this.props.deleteMessage}>
                    <img src={delIcon} className={styles.text_image_span}  alt='delete' id={this.props.messageId}/>
                    delete</span>
                </p>:null}
                
            </div>
        </div>
    );
  }
}

export default Card;