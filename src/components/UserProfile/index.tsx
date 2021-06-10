import React from 'react';
// import { useLocation } from 'wouter';
import { Container, Row, Col, Image, Card, } from 'react-bootstrap';
import './style.css';
import defaultAvatar from '../common/assets/defaultAvatar.jpg';
import defaultBanner from '../common/assets/defaultBanner.jpg';
// import firebase from '../../lib/firebase/firebase';

export default function UserProfile(props: WalletAddress) {

  return (
    // <h1>hello {props.address}</h1>
    <div className="user-profile">
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
        </div>
        <Container>
          <Row>
            {/* sidebar */}

            <Col sm={12} md={3}>
              <div className="user-profile-details">
                <h2 className="user-profile-name">{props.address}</h2>
                <span>Email</span>
                <br />
                <h5>email</h5>
                <span>Address</span>
                <br />
                <h5>profile.address</h5>

                <span>Mobile</span>
                <br />
                <h5>profile.mobile.value  </h5>

                <span>Date Joined</span>
                <br />
                <h5>displayDate(profile.dateJoined)</h5>

                <br />
                <span>Links</span>
                <ul className="list-group">
                  <li className="list-group-item">@fb</li>
                  <li className="list-group-item">@insta</li>
                  <li className="list-group-item">@twitter</li>
                  <li className="list-group-item">@github</li>

                </ul>
              </div>
            </Col>
            {/* sidebar */}

            {/* column 2 start */}
            <Col sm={12} md={9}>
              <div className="user-profile-details">
                <h1>Created</h1>
              </div>


              <Row xs={1} md={3} className="g-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Col>
                    {console.log("idx" + idx)

                    }
                    <Card className=" mr-3">
                      <Card.Img variant="top" src="https://via.placeholder.com/250x160.png?text=ByteBlock" />
                      <Card.Body>
                        <Card.Title className="font-weight-bold">ByteBlock</Card.Title>
                        <Card.Text>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

            </Col>
            {/* column 2 end */}

          </Row>
        </ Container>

      </div>
    </div>
  );
}



interface WalletAddress {
  address: string;
}




