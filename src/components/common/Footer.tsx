import React, { Component } from "react";
import './styles/style.css'
import { Container, Row, Col } from 'react-bootstrap';

export default class Footer extends Component {
  render() {
    return (
      <>
        <Container className="site-footer" fluid>
          <Row className="mx-2">
            <Col xs={12} sm={12} md={3} className="my-auto quick-link-col">
              <ul className="list-inline">
                <li className="list-inline-item mr-3"><a href="/create">Create</a></li>
                <li className="list-inline-item mr-3"><a href="https://github.com/byteblock-labs/ByteBlockNFT-Doc/wiki" target="_blank" rel="noopener noreferrer">Doc</a></li>
                <li className="list-inline-item"><a href="https://github.com/byteblock-labs/ByteBlockNFT-Doc/wiki/FAQ" target="_blank" rel="noopener noreferrer">FAQ</a></li>
              </ul>
            </Col>

            <Col xs={12} sm={12} md={6} className="text-center my-auto copyright-col">
              <div className="footer-copyright text-center">© 2021 Copyright:
               <a href="/" className="ml-2">ByteBlock</a>
              </div>
            </Col>

            <Col xs={12} sm={12} md={3} className="my-auto social-icon-col">
              <ul className="social-icons">
                <li><a className="Twitter" href="https://twitter.com/ByteBlockNFT" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a></li>
                <li><a className="Telegram" href="https://t.me/ByteBlockNFT" target="_blank" rel="noopener noreferrer"><i className="fab fa-telegram"></i></a></li>
                <li><a className="YouTube" href="https://www.youtube.com/channel/UCUH-7UlKvbRK4oF_-oiH18w" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i></a></li>
                <li><a className="Google Group" href="https://groups.google.com/g/byteblock-nft" target="_blank" rel="noopener noreferrer"><i className="fab fa-google"></i></a></li>
                <li><a className="Medium" href="https://byteblock-nft.medium.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-medium"></i></a></li>
              </ul>
            </Col>

          </Row>
        </Container>
      </>

    );
  }
}