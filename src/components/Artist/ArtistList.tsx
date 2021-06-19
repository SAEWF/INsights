import React, { useState, useEffect } from 'react';
import { Container, Row, Col, } from 'react-bootstrap';
import './style.css';
import firebase from '../../lib/firebase/firebase';
import { useLocation } from 'wouter';

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
    <Container>
      {/* {listItem.map(item => (
        <p className="tg-ycr8">{item.name}</p>
      ))} */}

      <div className="text-center font-weight-bold p-5" style={{
        fontSize: "36px",
        lineHeight: "40px",
      }}>
        <h1>Our Artists</h1>
      </div>

      <Row xs={1} md={2} lg={3} xl={3} >
        {listItem.map(item => (
          <Col>
            <div className="card profile-card-1 mb-5"
              onClick={
                () => setLocation(`/artistprofile/${item.id}`)
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
  );

}

interface Task {
  [index: string]: string
};