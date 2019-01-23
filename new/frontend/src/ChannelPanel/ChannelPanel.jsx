import React, { Component } from 'react'
import { List, Image, Container,Segment, Divider, Item } from 'semantic-ui-react';

export default class ChannelPanel extends Component {

    state = {
        channels: ['general', 'random']
    }

  render() {
    return (
        <Container fluid>
             <Segment>
                 <div>Channels</div>
                <List divided verticalAlign='middle'>
                     {this.state.channels.map(el=>
                     <List.Item>
                         <List.Content>
                             <List.Header as='a'>#{el}</List.Header>
                         </List.Content>
                     </List.Item>
                     )}
                 </List>
            </Segment>
         </Container>
    )
  }
}
