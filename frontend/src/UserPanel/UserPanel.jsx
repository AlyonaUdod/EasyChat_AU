import React from 'react';
import { List,Image, Container,Segment } from 'semantic-ui-react';
import md5 from 'md5'

const UserPanel = ({users}) => {

   return (


       <div className = 'userPanelContainer'>
       <Container fluid>
            <Segment>
               <List divided verticalAlign='middle'>
                    {users.map(el=>
                    <List.Item>
                        <Image avatar src= {`http://gravatar.com/avatar/${md5(el)}?d=identicon`}/>
                        <List.Content>
                            <List.Header as='a'>{el}</List.Header>
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