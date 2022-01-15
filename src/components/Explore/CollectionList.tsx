import React from 'react';
import {  Row, Col, } from 'react-bootstrap';
import './style.css';

export default function ArtistList(props: any) {
  const artists = props.collections;
  return (
    <>    
        <div className="one mt-4 mb-3">
            <h1>Collections</h1>
        </div>
        <Row xs={1} md={2} lg={3} xl={3} >
        {
          artists.length>0?
          artists.map((item: any) => (
            <Col>
              <div className="card profile-card-1 mb-5"
              >
                <img  alt="background" src="https://images.pexels.com/photos/946351/pexels-photo-946351.jpeg?w=500&h=650&auto=compress&cs=tinysrgb" className="background" 
                  onClick={
                    () => {props.setCollection(item.contract)}
                }/>
                <img alt={`${item.name}`} src={item.image} className="profile" />
                <div className="card-content" >
                  <h2 onClick={
                  () => {props.setCollection(item.contract)}
                }>
                    {item.name}
                  </h2>
                  <ul className="mt-2" style={{justifyContent: 'center', display:'flex', zIndex: 1}} >
                    {(item.twt) !==""? <a className="twitter" href={item.twt} target="_blank" id="twt" rel="noopener noreferrer" style={{color:'red'}}><i className="fab fa-twitter " ></i></a>:""}
                    {(item.fb) !==undefined && (item.fb) !==""? <a className="facebook" href={item.fb} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook "></i></a>:""}
                    {(item.website) !==""? <a className="" href={item.website} target="_blank" rel="noopener noreferrer"><i className="fas fa-link "  id="insta-color"></i></a>:""}
                    {(item.discord) !=="" && item.discord!==undefined? <a className="" href={item.discord} target="_blank" rel="noopener noreferrer"><i className="fab fa-discord"></i></a>:""}
                  </ul>
                </div>
              </div>
            </Col>
          ))
          :<></>
        }
      </Row >
    </>
  );

}