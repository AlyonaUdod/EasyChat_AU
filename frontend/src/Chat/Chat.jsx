import React, { Component } from 'react'
import { Container, MessageHeader, Segment, Comment, Input, Button, Header} from 'semantic-ui-react'
import moment from 'moment'
import socket from 'socket.io-client'
import axios from 'axios'

window.socket = socket(window.location.origin, {
    path: "/chat/"
});


class Chat extends Component {

    state = {
        author: 'Kitty',
        input: '',
        messages: [],
        online: 1,
        AllM: [],
    }
    handlerChange = (e) => {
        this.setState({
            input: e.target.value
        })
    }

    sendMessage = () => {
        let message = {
            time: moment().format('LTS'),
            content: this.state.input,
            author: this.state.author
        } 

        this.setState(prev => ({
            messages: [...prev.messages, message],
            input: ''
        }))

        window.socket.emit("message", message);
    }
    

    // getFirstMessages = () => {
    //     axios.get('http://localhost:3003/')
    //         .then( data => this.setState({messages: data.data}))
    //         .catch( err => console.log(err))
    // }

    componentDidMount(){

        axios.get('http://localhost:3003/')
            .then( data => this.setState({messages: data.data}))
            .catch( err => console.log(err))

        window.socket.on("change-online", (online) => {
            console.log(online)
                this.setState({
                    online: online
                })
            })

        window.socket.on("new-message", (message) => {
            this.setState(prev =>({
                messages: [...prev.messages, message],
            }))
        });
        
        // window.socket.on("somebody-typing", (is) => {
        //     this.setState({
        //         typing: is
        //     })
        // })
    }


  render() {
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
                    Users Online/ {this.state.online}
                </Header.Subheader>
                </Header>
            </Segment>

             <Comment.Group className='messages'>

                {this.state.messages.map(el =>  
                <Comment key={el.time+el.content}>
                    <Comment.Avatar/>
                    <Comment.Content>
                        <Comment.Author as='a'>
                          {this.state.author}
                        </Comment.Author>
                        <Comment.Metadata>
                           {el.time}
                        </Comment.Metadata>

                     <Comment.Text>{el.content}</Comment.Text>
                    </Comment.Content>
                </Comment>
                    )}

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
                    value={this.state.input}
                    onChange={this.handlerChange}
                   />
                <Button.Group icon widths='2'>
                    <Button color='orange' content='Add Reply' labelPosition='left' icon='edit' onClick={this.sendMessage} />
                    {/* <Button color='teal' content='Upload media' labelPosition='right' icon='cloud upload' onClick={this.toggleModal}/> */}
                </Button.Group>
            </Segment>



        </Container>
      </div>
    )
  }
}

export default Chat
