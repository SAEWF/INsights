import React, { useState, useEffect } from 'react';
import { Container, Row, Col, } from 'react-bootstrap';
import './style.css';
import firebase from '../../lib/firebase/firebase';
import { useLocation } from 'wouter';
import {Flex} from '@chakra-ui/react';

const useItems = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const ref = firebase
      .database()
      .ref("data");
    const listener = ref.on('value', snapshot => {
      const fetchedTasks: any[] = [];
      snapshot.forEach(childSnapshot => {
        const key = childSnapshot.key;
        const data = childSnapshot.val();
        console.log("key");
        console.log(key + "  " + data);
        fetchedTasks.push({ id: key, ...data });
      });
      setTasks(fetchedTasks);
    });
    return () => ref.off('value', listener);
  }, []);
  return tasks;
}

export default function ArtistList() {
  const listItem = useItems();
  const [, setLocation] = useLocation();

  console.log("listItem");
  console.log(listItem);

  return (
    <Flex
        w="100vw"
        h="100%"
        px={10}
        pt={6}
        overflowY="scroll"
        justify="start"
        flexDir="row"
      >
    <Container>
    
<div className="one mt-4 mb-3">
  <h1>Our Artists</h1>
</div>

      <Row xs={1} md={2} lg={3} xl={3} >
        {listItem.map(item => (
          <Col>
            <div className="card profile-card-1 mb-5"
              onClick={
                () => setLocation(`/artistprofile/${item.username}`)
              }
            >
              <img src="https://images.pexels.com/photos/946351/pexels-photo-946351.jpeg?w=500&h=650&auto=compress&cs=tinysrgb" className="background" />
              <img src={item.avatar} className="profile" />
              <div className="card-content">
                <h2>{item.name}
                  {/* <small>Artist</small> */}
                </h2>

                {/* <div className="pt-2">
                  <Button variant="outline-light" onClick={() =>
                    setLocation(`/artistprofile/${item.id}`)}>
                  View Profile</Button>
                </div> */}
              </div>
            </div>
          </Col>
        ))
        }

      </Row >
    </Container >
    </Flex>
  );

}

interface Task {
  [index: string]: string
};