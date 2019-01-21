import React from 'react';
import { List, Image, Container,Segment, Divider, Item } from 'semantic-ui-react';
import md5 from 'md5'

const UserPanel = ({users, user}) => {

   return (


       <div className = 'userPanelContainer'>
       <Container fluid>
            <Segment>
                <div>Hello, <span style={{ color: 'rgb(255, 165, 0)', fontSize: '18px', textShadow: '1px 1px 0 black'}}>{user}</span> !</div>
                <Divider/>
               <List divided verticalAlign='middle'>
                    {users.map(el=>
                    <List.Item>
                        <Image avatar src= {`http://gravatar.com/avatar/${md5(el.userName)}?d=identicon`}/>
                        <List.Content>
                            <List.Header as='a'>{el.userName}</List.Header>
                        </List.Content>
                    </List.Item>
                    )}
                </List>
           </Segment>
        </Container>
        </div>
   );
};

export default UserPanel;