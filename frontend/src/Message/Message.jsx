import React, { Component } from 'react';
import styles from './Message.module.css'
import Card from '../Card/Card';
import Card2 from '../Card/Card2';
import md5 from 'md5';

class Message extends Component {

    // avatarSrcFunction = (email) => {
    //     let a = this.props.allUsers.find(item => item.email === email)
    //     console.log(a)
    //     if (a !== undefined) {
    //         if(a.avatar) {
    //             console.log(a.avatar);
    //                 return <img src={a.avatar} alt='user avatar'/>
    //             } else {
    //                 let b = a.username
    //                 return <img src={`https://gravatar.com/avatar/${md5(`${b}`)}?d=identicon`} width='46px' height='auto' alt='user avatar'/>
    //         }
    //       } else {
    //         let b = a.username
    //         return <img src={`https://gravatar.com/avatar/${md5(`${b}`)}?d=identicon`}  width='46px' height='auto' alt='user avatar'/>
    //       }   
    //   }

    avatarSrcFunction=(email)=>{
        let user = this.props.allUsers.find(item=>item.email===email)
        // console.log(user)
        if (user.avatar) {
            console.log(user.avatar );
            return <img className={styles.message_avatar} src={user.avatar} alt='user avatar'/>
        }
        else {
           
            let userSrc = `http://gravatar.com/avatar/${md5(`${user.username}`)}?d=identicon`
            return <img className={styles.message_avatar} src={userSrc} alt='user avatar'/>
        }

    }
   
    render() {
        return (
            <div>
                {/* {this.props.messages.map(el => 
                    <div className={styles.cardLeft} key={el.messageId}>
                        <Card  author={el.author} time={el.time} content={el.content}/>
                    </div>
                    )}
                {this.props.messages2.map(el =>
                    <div className={styles.cardRight} key={el.messageId}>
                    <Card2  author={el.author} time={el.time} content={el.content}/>
                </div>
                )} */}


                {this.props.messages.map(el => 
                    // <div className={el.author===this.props.currentUser.email?styles.cardRight:styles.cardLeft} >
                        <Card  
                        allUsers = {this.props.allUsers} 
                        currentUser={this.props.currentUser} 
                        deleteMessage = {this.props.deleteMessage}
                        editMessage = {this.props.editMessage}
                        avatarSrcFunction ={this.avatarSrcFunction} 
                        key={el._id}
                        messageId={el.messageId}
                        edited = {el.edited} 
                        email={el.author} 
                        time={el.time} 
                        content={el.content}/>
                    // </div>
                    )}
                {/* {this.props.messages2.map(el =>
                    <div className={styles.cardRight} >
                    <Card2 key={el.messageId}  author={el.author} time={el.time} content={el.content}/>
                    </div>
                )} */}

            </div>
        );
    }
}

export default Message;