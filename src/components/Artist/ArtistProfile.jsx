import React, { useState, useEffect } from 'react';
// import { useLocation } from 'wouter'; 
import { Container, Row, Col, Image, Card, } from 'react-bootstrap';
import './style.css';
import defaultAvatar from '../common/assets/defaultAvatar.jpg';
import defaultBanner from '../common/assets/defaultBanner.jpg';
import firebase from '../../lib/firebase/firebase';
//  http://localhost:3000/artistprofile/12

export default function ArtistProfile(props) {
  const idForQuery = +props.address;
  // console.log(idForQuery);
  var result = [];

  const [hasError, setErrors] = useState(false);
  const [user, setuser] = useState({});
  async function fetchData() {
    firebase.database().ref("data")
      .orderByChild("id")
      .equalTo(idForQuery)
      .on('value', function (snapshot) {
        if (snapshot.val() === null) {
          console.log('id is not present in firebase');
          setErrors(true)
        } else {
          console.log('id is present in firebase');
          var childData = snapshot.val();
          // console.log('childData');
          // console.log(childData);
          setuser(childData)
        }
      });
  }

  useEffect(() => {
    fetchData();
  });


  Object.keys(user).forEach(item => {
    Object.keys(user[item]).forEach(innerItem => {
      // console.log(innerItem + ': ' + user[item][innerItem])
      result.push([innerItem, user[item][innerItem]]);
    })
  })


  console.log("result");
  console.log(result);



  return (
    <Container>
      {/* {
        document.write(result)
      } */}

      {document.write(result.length)}
      <br />
      {
        hasError
          ? <div>hasError true erroe occured. id is not present in firebase</div>
          : <div>hasError false ok</div>
      }

      <div className="user-profile-block">
        <div className="user-profile-banner">
          <div className="user-profile-banner-wrapper">
            <Image
              alt="Banner"
              className="user-profile-banner-img"
              src={defaultBanner}
            />
          </div>
          <div className="user-profile-avatar-wrapper">
            <Image
              alt="Avatar"
              className="user-profile-img"
              src={defaultAvatar}
              thumbnail
            />
          </div>
          {/* <button
            className="button button-small user-profile-edit"
            // onClick={() => props.history.push(ACCOUNT_EDIT)}
            type="button"
          >
            Edit Account
          </button> */}

          <Container>
            <Row>
              {/* sidebar */}
              <Col sm={12} md={3}>
                <div className="user-profile-details">
                  <h2 className="user-profile-name font-weight-bold mb-2 pl-1">Jon Snow</h2>

                  <Card border="light" className="text-left" >
                    <Card.Header className="font-weight-bold"><i className="far fa-envelope"></i> E-mail </Card.Header>
                    <Card.Body>
                      <Card.Text>
                        email@gm.com
                  </Card.Text>
                    </Card.Body>
                  </Card>

                  <Card border="light" className="text-left" >
                    <Card.Header className="font-weight-bold"><i className="far fa-compass"></i> Wallet Address </Card.Header>
                    <Card.Body>
                      {/* <Card.Title>Light Card Title</Card.Title> */}
                      <Card.Text>
                        tz1LjLHwTghS3DU567igtZfqQCaiM7fxxxx
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
                        <li><a href='google.com' target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook mr-2"></i>Facebook</a></li>
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
          </ Container>

        </div>
      </div>
    </Container >

  );
}



// interface WalletAddress {
//   address: string
// }

// interface UserType {
//   name: string;
//   id: number;
//   avatar: string;
//   banner: string;
//   walletAddress: string;
// }

// interface ParentInterface {
//   items: ChildInterface;


// }

// interface ChildInterface {
//   avatar: string;
//   banner: string;
//   email: string;
//   id: number;
//   links: {
//     [key1: string]: SubChildInterface
//   };
//   name: string;
//   walletAddress: string;
// }

// interface SubChildInterface {
//   fb: string;
//   ig: string;
//   twt: string;
//   yt: string;
// }

// { "5": { "avatar": "https://reqres.in/img/faces/12-image.jpg", "banner": "https://via.placeholder.com/1500x500.png?text=ByteBlock- Banner", "email": "rachel.howell@reqres.in", "id": 12, "links": { "fb": "https://www.facebook.com/", "ig": "https://www.facebook.com/", "twt": "https://www.facebook.com/", "yt": "https://www.facebook.com/" }, "name": "Rachel Howell", "walletAddress": "howell111" } }

// name: "",
// avatar: "",
// banner: "",
// walletAddress: "",
// id: "",
// links: {}




// avatar,https://reqres.in/img/faces/12-image.jpg,
// banner,https://via.placeholder.com/1500x500.png?text=ByteBlock- Banner,
// email,rachel.howell@reqres.in,
// id,12,
// links,[object Object],
// name,Rachel Howell,
// walletAddress,howell111