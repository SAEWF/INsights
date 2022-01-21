import React from "react";
import './styles/footer.css'
// import { Container, Row, Col } from 'react-bootstrap';
import mediumLogo from './assets/medium-white.png';

const Footer = () => {

  return (
    <div className="footer">
      <div className="row">
        <div className="socialMedia">
          <p className = "followUs">Follow us </p>
          <ul className="social-icons">
            <li><a className="twitter" href="https://twitter.com/ByteBlockNFT" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter icon"></i></a></li>
            <li><a className="telegram" href="https://t.me/ByteBlockNFT" target="_blank" rel="noopener noreferrer"><i className="fab fa-telegram icon"></i></a></li>
            <li><a className="youtube" href="https://www.youtube.com/channel/UCUH-7UlKvbRK4oF_-oiH18w" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-youtube icon"></i></a></li>
            <li><a className="medium" href="https://byteblock-nft.medium.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-medium icon"></i></a></li>
            <li><a className="medium" href="https://byteblock-nft.medium.com/" target="_blank" rel="noopener noreferrer"><img className="fab fa-discord icon" src={mediumLogo} alt=""></img></a></li>
            <li><a className="discord" href="https://discord.gg/sVPjEyWyGQ" target="_blank" rel="noopener noreferrer"><i className="fab fa-discord icon"></i></a></li>
          </ul>
        </div>
        <div className="websiteLinks">
          <a className = "link" href="https://github.com/byteblock-labs/ByteBlockNFT-Doc/wiki" target="_blank" rel="noopener noreferrer">Doc</a>
          <a className = "link" href="https://docs.google.com/forms/d/e/1FAIpQLSeMkFGYr4SrTYRHC17z-6zzXBAS9nCQ-NNwitwS6eYo3S8SUA/viewform" target="_blank" rel="noopener noreferrer">Report</a>
          <a className = "link" href="https://github.com/byteblock-labs/ByteBlockNFT-Doc/wiki/FAQ" target="_blank" rel="noopener noreferrer">FAQ</a>

        </div>
      </div>
      <hr className = "line" />

      <div className="copyright">
        <p>© 2022 Copyright : ByteBlock</p>
      </div>
    </div>
  );
}

export default Footer;