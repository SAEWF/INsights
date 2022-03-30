import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import {
  Box,
  Flex,
  Image,
  Link,
  Text,
  Menu,
  MenuButton,
  MenuList,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Heading
} from '@chakra-ui/react';
import { Menu as HamburgerIcon } from 'react-feather'; //Plus
// import { RiStore2Line } from 'react-icons/ri';
import { MdCollections } from 'react-icons/md';
// import headerLogo from './assets/header-logo.svg';
import { useSelector, useDispatch } from '../../reducer';
import { connectWallet, disconnectWallet } from '../../reducer/async/wallet';
import { MinterButton } from '.';
// import wallet_icon from './assets/wallet.svg';
import logo_trans from './assets/logo_bb-transparent.png';
import Navbar from 'react-bootstrap/Navbar';
import { Icon, IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { FaSun, FaMoon, FaWallet } from 'react-icons/fa';
import firebase from '../../../src/lib/firebase/firebase';
import BasicUsage from '../Wert/Modal';



interface MobileHeaderLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function MobileHeaderLink(props: MobileHeaderLinkProps) {
  const [location, setLocation] = useLocation();
  const selected = location === props.to;
  return (
    <Link
      href={props.to}
      onClick={e => {
        e.preventDefault();
        setLocation(props.to);
        if (props.onClick) {
          props.onClick();
        }
      }}
      textDecor="none"
    >
      <Heading
        fontWeight={selected ? '600' : 'normal'}
        // color="brand.background"
        mb={4}
        pl={selected ? 4 : 0}
        borderLeft={selected ? '5px solid' : 'none'}
        borderColor="brand.blue"
      >
        {props.children}
      </Heading>
    </Link>
  );
}

interface DesktopHeaderLinkProps {
  to: string;
  children: React.ReactNode;
}

function DesktopHeaderLink(props: DesktopHeaderLinkProps) {
  const [location, setLocation] = useLocation();
  const selected = location === props.to;
  return (
    <Link
      href={props.to}
      onClick={e => {
        e.preventDefault();
        setLocation(props.to);
      }}
      textDecor="none"
      borderRadius="10px"
      alignItems="center"
      fontWeight="600"
      px={3}
      py={2}
      ml={4}
      bg={selected ? 'gray.700' : 'none'}
      // color={selected ? 'gray.400' : 'gray.200'}
      display="flex"
      transition="none"
      _hover={{
        textDecor: 'none',
        bg: 'gray.700',
        color: selected ? 'gray.400' : 'gray.100'
      }}
    >
      {props.children}
    </Link>
  );
}

function WalletInfo(props: { tzPublicKey: string }) {
  return (
    <Flex flexDir="row" align="center" my={4}>
      <Box borderRadius="100%" width={10} height={10} bg="brand.darkGray" p={1}>
        <Image
          src={`https://services.tzkt.io/v1/avatars2/${props.tzPublicKey}`}
        />
      </Box>
      <Text fontFamily="mono" ml={2}>
        {props.tzPublicKey}
      </Text>
    </Flex>
  );
}

function WalletDisplay() {
  const [, setLocation] = useLocation();
  const system = useSelector(s => s.system);
  const dispatch = useDispatch();
  return (
    <>
      {system.status === 'WalletConnected' ? (
        <Menu placement="bottom-end" offset={[4, 24]}>
          <MenuButton
            padding={2}
            _hover={{
              textDecoration: 'none',
              background: '#2D3748',
              color: '#EDF2F7'
            }}
          >
            <Icon ml={2} as={FaWallet} style={{ color: "#00FFBE" }}></Icon>
          </MenuButton>
          <MenuList color="brand.black">
            <Flex flexDir="column" px={4} py={2}>
              <Text fontSize={16} fontWeight="600">
                Network: {system.config.network}
              </Text>
              <WalletInfo tzPublicKey={system.tzPublicKey} />
              <MinterButton
                alignSelf="flex-start"
                variant="cancelAction"
                onClick={async () => {
                  await dispatch(disconnectWallet());
                  setLocation('/');
                }}
              >
                Disconnect
              </MinterButton>
            </Flex>
          </MenuList>
        </Menu>
      ) : (
        <MinterButton
          variant="secondaryAction"
          onClick={e => {
            e.preventDefault();
            dispatch(connectWallet());
          }}

          _hover={{
            textDecoration: 'none',
            background: '#2D3748',
            color: '#EDF2F7'
          }}
        >
          Wallet <Icon ml={2} as={FaWallet} style={{ color: "#00FFBE" }}></Icon>
          
        </MinterButton>
      )}
    </>
  );
}

function NavItems() {
  const system = useSelector(s => s.system);
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const { colorMode, toggleColorMode } = useColorMode();

  const [isRegistered , setIsRegistered] = useState('');

  useEffect(() => {
    if (system.status === 'WalletConnected') {
      const wallet = system.tzPublicKey;
      const db = firebase.firestore();
      db.collection('artists').doc(wallet).onSnapshot(function(doc) {
        if (doc.exists) {
          var data = doc.data();
          if(data===undefined) return;
          if(data.display!==undefined && data.display){
            setIsRegistered(data.name.replaceAll(' ', ''));
          }
        }
      });
    }
  }, [system.status, system.tzPublicKey]);

  return (
    <>
      {/* Mobile */}
      <Flex
        flex="1"
        justify="flex-end"
        display={{
          base: 'flex',
          md: 'none'
        }}
      >
        <Box
          color="brand.lightGray"
          ref={btnRef}
          cursor="pointer"
          onClick={onOpen}
        >
          <HamburgerIcon />
        </Box>
        <Drawer
          isOpen={isOpen}
          onClose={onClose}
          placement="right"
          finalFocusRef={btnRef}
        >
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerBody mt={12}>
                <Flex
                  flexDir="column"
                  justifyContent="space-between"
                  height="100%"
                >
                  <Flex flexDir="column">
                    {
                      system.status === 'WalletConnected' ? (
                      isRegistered!=='' ? (
                          <MobileHeaderLink to={`/artistprofile/${isRegistered}`} onClick={onClose}>
                            My profile
                          </MobileHeaderLink>
                        ) :      
                        <MobileHeaderLink to="/register" onClick={onClose}>
                          Register
                        </MobileHeaderLink>
                        ) : (
                          <></>
                      )
                    }
                    <MobileHeaderLink to="/explore" onClick={onClose}>
                      Explore
                    </MobileHeaderLink>
                    <MobileHeaderLink to="/artists" onClick={onClose}>
                      Artists
                    </MobileHeaderLink>
                    <MobileHeaderLink to="/collections" onClick={onClose}>
                      Collections
                    </MobileHeaderLink>
                    {system.status === 'WalletConnected' ? (
                      <MobileHeaderLink to="/create" onClick={onClose}>
                        {/* Create */}
                        Mint
                      </MobileHeaderLink>
                    ) : null}
                    
                  </Flex>
                  {system.status === 'WalletConnected' ? (
                    <MinterButton
                      variant="cancelAction"
                      onClick={async () => {
                        await dispatch(disconnectWallet());
                        setLocation('/');
                      }}
                      mb={4}
                    >
                      Disconnect Wallet
                    </MinterButton>
                  ) : (
                    <MinterButton
                      variant="secondaryAction"
                      onClick={e => {
                        e.preventDefault();
                        dispatch(connectWallet());
                      }}
                      mb={4}
                    >
                      Wallet <Icon ml={2} as={FaWallet} style={{ color: "#00FFBE" }}></Icon>
                    </MinterButton>
                  )}
                </Flex>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      </Flex>
      {/* Desktop */}
      <Flex
        flex="1"
        justify="flex-end"
        display={{
          base: 'none',
          md: 'flex'
        }}
      >
        {/* <DesktopHeaderLink to="/marketplace">
          <Box color="brand.turquoise">
            <RiStore2Line size={16} />
          </Box>
          <Text ml={2} >Marketplace</Text>
        </DesktopHeaderLink> */}

          <DesktopHeaderLink to={`/explore`}>
              <Text><i className="fas fa-star mr-2" style={{ color: "#00FFBE" }}></i>Explore</Text>
          </DesktopHeaderLink>

        {
          system.status === 'WalletConnected' ? (
          isRegistered==='' ? (
            <DesktopHeaderLink to="/register">
              <Text><i className="fas fa-user mr-2" style={{ color: "#00FFBE" }}></i>Register</Text>
            </DesktopHeaderLink>
          ) : (
            <DesktopHeaderLink to={`/artistprofile/${isRegistered}`}>
              <Text><i className="fas fa-user mr-2" style={{ color: "#00FFBE" }}></i>My profile</Text>
            </DesktopHeaderLink>
          )) : (
            <></>
          )
        }

        <DesktopHeaderLink to="/artists">
          <Text><i className="fas fa-users mr-2" style={{ color: "#00FFBE" }}></i>Artists</Text>
        </DesktopHeaderLink>
        {system.status === 'WalletConnected' ? (
          <>
            <DesktopHeaderLink to="/collections">
              <Box color="brand.turquoise">
                <MdCollections size={16} style={{ color: "#00FFBE" }}/>
              </Box>
              <Text ml={2}>Collections</Text>
            </DesktopHeaderLink>
            <DesktopHeaderLink to="/create">
              {/* <Box color="brand.blue">
                <Plus size={16} strokeWidth="3" />
              </Box> 
              <Text ml={2}>Create</Text> */}
              <Text>Mint</Text>
            </DesktopHeaderLink>
          </>
        ) : null}
        <Flex
          alignItems="center"
          color="brand.gray"
          paddingLeft={4}
          marginLeft={4}
          borderLeft="2px solid"
          borderColor="brand.darkGray"
        >
          <WalletDisplay />
          
          <IconButton 
            icon = { colorMode==='light' ? <FaSun/> : <FaMoon/>} 
            aria-label='toggle dark mode'
            isround = 'true'
            size = 'lg'
            borderRadius='5'
            onClick={toggleColorMode}
          />

            <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<HamburgerIcon />}
               variant='outline'
             />
            <MenuList >
              <BasicUsage/>  
            </MenuList>
            </Menu>
        </Flex>
      </Flex>
    </>
  );
}

export function Header() {
  // const [, setLocation] = useLocation();
  const bg = useColorModeValue('gray.100', 'black');
  const color = useColorModeValue('black', 'white');
  return (
    <>
      <Flex
        width="100%"
        bg={bg} color={color}
        paddingX={4}
        paddingY={3}
        alignItems="center"
        justifyContent="space-between"
      >

        <Navbar.Brand href="/">
          <img
            alt="ByteBlock"
            src={logo_trans}
            className="d-inline-block "
            style={{ verticalAlign: "middle", height: "46px" }}
          />{' '}
          {/* <h2 className="d-inline-block text-white font-weight-bold" style={{ letterSpacing: "0.1em", verticalAlign: "middle" }}>ByteBlock NFT </h2> */}

        <div className="d-inline-block font-weight-bold" style={{ letterSpacing: "0.1em", verticalAlign: "middle" }}>
          <h2>ByteBlock</h2>
          <p className="mx-auto" style={{  fontSize: "10.5px" }}>Beta Version</p>
          {/* #9c9fa3 */}
        </div>
        </Navbar.Brand>

        {/* <Image
        display={{
          base: 'none',
          md: 'block'
        }}
        maxH="28px"
        marginTop="4px"
        src={logo}
        onClick={e => {
          e.preventDefault();
          setLocation('/marketplace');
        }}
        cursor="pointer"
      /> */}
        {/* <Image
        display={{
          base: 'block',
          md: 'none'
        }}
        maxW="38px"
        src={headerLogo}
        onClick={e => {
          e.preventDefault();
          setLocation('/marketplace');
        }}
        cursor="pointer"
      /> */}
        <NavItems />
      </Flex >
    </>

  );
}

export default Header;


//hidden marketplace button at 2 places desktop & mobile