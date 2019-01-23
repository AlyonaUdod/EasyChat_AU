import React, { Component } from 'react'
import { List, Image, Container,Segment, Divider, Item } from 'semantic-ui-react';
import md5 from 'md5'

export default class ChannelPanel extends Component {

    state = {
        channels: ['general', 'random']
    }

  render() {
    return (
        <Container fluid>
             <Segment>
                 {/* <div>Channels</div>
                <List divided verticalAlign='middle'>
                     {this.state.channels.map(el=>
                     <List.Item>
                         <List.Content>
                             <List.Header as='a'>#{el}</List.Header>
                         </List.Content>
                     </List.Item>
                     )}
                 </List> */}
                 <Divider/>
                 <h4 style={{fontStyle: 'italic', textAlign:'center'}}>All Users</h4>
                <List divided verticalAlign='middle'>
                    {this.props.users.map(el=>
                    <List.Item>
                        <Image avatar src= {`http://gravatar.com/avatar/${md5(el.username)}?d=identicon`}/>
                        <List.Content>
                            <List.Header as='a'>{el.username}</List.Header>
                        </List.Content>
                    </List.Item>
                    )}
                </List>
            </Segment>
            
         </Container>
    )
  }
}
