import React, { useState, useEffect } from 'react';
import './style.css';
import firebase from '../../lib/firebase/firebase';
import { Container, Row, Col, Image, Card, } from 'react-bootstrap';
// import defaultAvatar from '../common/assets/defaultAvatar.jpg';
// import defaultBanner from '../common/assets/defaultBanner.jpg';

const useItems = () => {
  const [tasks, setTasks] = useState([]);
  const idForQuery = "12";

  // console.log(props.address);

  useEffect(() => {
    const ref = firebase
      .database()
      .ref("data");
    const listener = ref
      .orderByChild("id")
      .equalTo(idForQuery)
      .on('value', snapshot => {
        const fetchedTasks = [];
        // if (snapshot.val() === null) {
        //   console.log('id is not present in firebase');
        // } else {
        //   console.log('id is present in firebase');
        // }
        snapshot.forEach(childSnapshot => {
          const key = childSnapshot.key;
          const data = childSnapshot.val();
          fetchedTasks.push({ id: key, ...data });
        });
        setTasks(fetchedTasks);
      });
    return () => ref.off('value', listener);
  }, []);
  return tasks;
}


export default function ArtistProfile() {
  const userData = useItems();
  // console.log("userData");
  // console.log(userData);

  return (
    <Container style={{ width: "100vw", height: "100%", display: "flex", justifyContent: "start" }}>

      {(userData.length === 0)
        ? <div className="text-center"><h1 className="mx-auto my-auto font-weight-bold">User Not Found</h1> </div>
        : userData.map(item => (
          <>
            <div className="user-profile-block">
              <div className="user-profile-banner">
                <div className="user-profile-banner-wrapper">
                  <Image
                    // alt="Banner"
                    className="user-profile-banner-img"
                    src={item.banner}
                  // {defaultBanner}
                  />
                </div>
                <div className="user-profile-avatar-wrapper">
                  <Image
                    // alt="Avatar"
                    className="user-profile-img"
                    src={item.avatar}
                    // {defaultAvatar}
                    thumbnail
                  />
                </div>

                <Row>
                  {/* sidebar */}
                  <Col sm={12} md={3}>
                    <div className="user-profile-details">
                      <h2 className="user-profile-name font-weight-bold mb-2 pl-1">{item.name}</h2>

                      <Card border="light" className="text-left" >
                        <Card.Header className="font-weight-bold"><i className="far fa-envelope"></i> E-mail </Card.Header>
                        <Card.Body>
                          <Card.Text>
                            {item.email}
                          </Card.Text>
                        </Card.Body>
                      </Card>

                      <Card border="light" className="text-left" >
                        <Card.Header className="font-weight-bold"><i className="far fa-compass"></i> Wallet Address </Card.Header>
                        <Card.Body>
                          {/* <Card.Title>Light Card Title</Card.Title> */}
                          <Card.Text>
                            {item.walletAddress}
                          </Card.Text>
                        </Card.Body>
                      </Card>

                      <Card border="light" className="text-left" >
                        <Card.Header className="font-weight-bold"><i className="fas fa-link"></i> Links </Card.Header>
                        <Card.Body>
                          {/* <Card.Title>Light Card Title</Card.Title> */}
                          {/* <Card.Text>
                      tz1LjLHwTthS3DU542igtZfqQCaiM7fz9C2C
                </Card.Text> */}
                          <ul className="list-sm">
                            <li><a href={item.fb} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook mr-2"></i>Facebook</a></li>
                            <li><a href='google.com' target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter mr-2"></i>Twitter</a></li>
                            <li><a href='google.com' target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram mr-2"></i>Instagram</a></li>
                            <li><a href='google.com' target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube mr-2"></i>Youtube</a></li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </div>
                  </Col>
                  {/* sidebar */}

                  {/* column 2 start */}
                  <Col sm={12} md={9}>
                  </Col>
                  {/* column 2 end */}

                </Row>

              </div>
            </div>
          </>
        ))}

    </Container >
  );

}
// interface WalletAddress {
//   address: string
// }
// const UserNotFoundInOurDb = () => {
//   return (
//     <h1>UserNotFoundInOurDb</h1>
//   );
// }