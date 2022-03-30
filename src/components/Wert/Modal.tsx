import { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    MenuItem,
  } from '@chakra-ui/react'
import React from 'react';
import Widget from './Widget';
import './style.css';


function BasicUsage() {
    const [isOpen, setIsOpen] = useState(false);
    const onOpen = () => {
        setIsOpen(!isOpen);
    }
    return (
      <>
        <MenuItem onClick={onOpen}>Buy XTZ</MenuItem>
  
        <Modal isOpen={isOpen} onClose={onOpen}>
          <ModalOverlay />
          <ModalContent style={{backgroundColor: '#2d3748'}} className = 'container wertDiv'>
              <Widget />
            </ModalContent>
        </Modal>
      </>
    )
  }

  export default BasicUsage;