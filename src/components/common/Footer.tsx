import React from "react";
import './styles/footer.css'
// import { Container, Row, Col } from 'react-bootstrap';
import mediumLogo from './assets/medium-white.png';
import { Box, HStack, VStack, Spacer, Text, useColorModeValue } from '@chakra-ui/react';
import { Row } from "react-bootstrap";

const Footer = () => {
  const bg = useColorModeValue('gray.100', 'black');
  const color = useColorModeValue('black', 'white');

  return (
    <div className="footer">
      <div className="row">
        <div className="socialMedia">
          <p className = "followUs">Follow us </p>
          <hr/>
          <hr/>
          <hr/>
          <ul className="social-icons">
            <li><a className="twitter" href="https://twitter.com/ByteBlockNFT" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter icon"></i></a></li>
            <li><a className="telegram" href="https://t.me/ByteBlockNFT" target="_blank" rel="noopener noreferrer"><i className="fab fa-telegram icon"></i></a></li>
            <li><a className="youtube" href="https://www.youtube.com/channel/UCUH-7UlKvbRK4oF_-oiH18w" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-youtube icon"></i></a></li>
            <li><a className="Google Group" href="https://groups.google.com/g/byteblock-nft" target="_blank" rel="noopener noreferrer"><i className="fab fa-google icon"></i></a></li>
            <li><a className="medium" href="https://byteblock-nft.medium.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-medium icon"></i></a></li>
            <li><a className="medium" href="https://byteblock-nft.medium.com/" target="_blank" rel="noopener noreferrer"><img className="fab fa-discord icon" src={mediumLogo} alt=""></img></a></li>
            <li><a className="discord" href="https://discord.gg/sVPjEyWyGQ" target="_blank" rel="noopener noreferrer"><i className="fab fa-discord icon"></i></a></li>

          </ul>
        </div>
        <div className="websiteLinks">
          <a href="/create" className = "link">Create</a>
          <a className = "link" href="https://github.com/byteblock-labs/ByteBlockNFT-Doc/wiki" target="_blank" rel="noopener noreferrer">Doc</a>
          <a className = "link" href="https://docs.google.com/forms/d/e/1FAIpQLSeMkFGYr4SrTYRHC17z-6zzXBAS9nCQ-NNwitwS6eYo3S8SUA/viewform" target="_blank" rel="noopener noreferrer">Report</a>
          <a className = "link" href="https://github.com/byteblock-labs/ByteBlockNFT-Doc/wiki/FAQ" target="_blank" rel="noopener noreferrer">FAQ</a>

        </div>
      </div>
      <hr className = "line" />

      <div className="copyright">
        <p>© 2021 Copyright:ByteBlock</p>
      </div>

      {/* <Box bg={bg} color={color}>
          <VStack 
            spacing={4} 
            w='100%'
            maxW={{base: '100vw', md: '100vw', lg: '100vw', xl: '100vw'}}
            alignItems='stretch'
            pt={2}
          >
            <HStack spacing={4} px='4'>
              
                <a href="/create"><Text>Create</Text></a>
                <a href="https://github.com/byteblock-labs/ByteBlockNFT-Doc/wiki" target="_blank" rel="noopener noreferrer"><Text>Doc</Text></a>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSeMkFGYr4SrTYRHC17z-6zzXBAS9nCQ-NNwitwS6eYo3S8SUA/viewform" target="_blank" rel="noopener noreferrer">Report</a>
                <a href="https://github.com/byteblock-labs/ByteBlockNFT-Doc/wiki/FAQ" target="_blank" rel="noopener noreferrer">FAQ</a>

                <Spacer/>
                <Text>© 2021 Copyright:</Text><a href="/"><Text>ByteBlock</Text></a>
                <Spacer/>

                <ul className="social-icons">
                      <li><a className="twitter" href="https://twitter.com/ByteBlockNFT" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a></li>
                      <li><a className="telegram" href="https://t.me/ByteBlockNFT" target="_blank" rel="noopener noreferrer"><i className="fab fa-telegram"></i></a></li>
                      <li><a className="youtube" href="https://www.youtube.com/channel/UCUH-7UlKvbRK4oF_-oiH18w" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-youtube"></i></a></li>
                      <li><a className="Google Group" href="https://groups.google.com/g/byteblock-nft" target="_blank" rel="noopener noreferrer"><i className="fab fa-google"></i></a></li> 
                       <li><a className="medium" href="https://byteblock-nft.medium.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-medium"></i></a></li>
                      <li><a className="medium" href="https://byteblock-nft.medium.com/" target="_blank" rel="noopener noreferrer"><img className="fab fa-discord" src={mediumLogo} alt=""></img></a></li>
                      <li><a className="discord" href="https://discord.gg/sVPjEyWyGQ" target="_blank" rel="noopener noreferrer"><i className="fab fa-discord"></i></a></li>

                    </ul>
              
            </HStack>
             <HStack spacing={4}>
              <Container className="site-footer" fluid>
                <Row className="mx-2">
                  <Col xs={12} sm={12} md={3} className="my-auto quick-link-col">

                    <ul className="list-inline">
                      <li className="list-inline-item mr-3"><a href="/create"><Text>Create</Text></a></li>
                      <li className="list-inline-item mr-3"><a href="https://github.com/byteblock-labs/ByteBlockNFT-Doc/wiki" target="_blank" rel="noopener noreferrer"><Text>Doc</Text></a></li>
                      <li className="list-inline-item mr-3"><a href="https://docs.google.com/forms/d/e/1FAIpQLSeMkFGYr4SrTYRHC17z-6zzXBAS9nCQ-NNwitwS6eYo3S8SUA/viewform" target="_blank" rel="noopener noreferrer">Report</a></li>
                      <li className="list-inline-item"><a href="https://github.com/byteblock-labs/ByteBlockNFT-Doc/wiki/FAQ" target="_blank" rel="noopener noreferrer">FAQ</a></li>
                    </ul>
                  </Col>

                  <Col xs={12} sm={12} md={6} className="text-center my-auto ">
                  <div className=" text-center"><Text>© 2021 Copyright:</Text>
                    <a href="/" className="ml-2"><Text>ByteBlock</Text></a>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={3} className="my-auto social-icon-col">
                    <ul className="social-icons">
                      <li><a className="twitter" href="https://twitter.com/ByteBlockNFT" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a></li>
                      <li><a className="telegram" href="https://t.me/ByteBlockNFT" target="_blank" rel="noopener noreferrer"><i className="fab fa-telegram"></i></a></li>
                      <li><a className="youtube" href="https://www.youtube.com/channel/UCUH-7UlKvbRK4oF_-oiH18w" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-youtube"></i></a></li>
                      <li><a className="Google Group" href="https://groups.google.com/g/byteblock-nft" target="_blank" rel="noopener noreferrer"><i className="fab fa-google"></i></a></li>
                      <li><a className="medium" href="https://byteblock-nft.medium.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-medium"></i></a></li>
                      <li><a className="medium" href="https://byteblock-nft.medium.com/" target="_blank" rel="noopener noreferrer"><img className="fab fa-discord" src={mediumLogo} alt=""></img></a></li>
                      <li><a className="discord" href="https://discord.gg/sVPjEyWyGQ" target="_blank" rel="noopener noreferrer"><i className="fab fa-discord"></i></a></li>

                    </ul>
                  </Col>

                </Row>
              </Container>
            </HStack>
          </VStack>
        </Box> */}
    </div>
  );
}

export default Footer;