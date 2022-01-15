import React, {useState, useEffect} from 'react'
import CollectionDisplay from '../Collections/Catalog/CollectionDisplay';
import { Row } from 'react-bootstrap';
import { Button } from '@chakra-ui/react';
import { useLocation } from 'wouter';
import firebase from '../../lib/firebase/firebase';
import CollectionList from './CollectionList';
import { Wind } from 'react-feather'
import {Flex, Text } from '@chakra-ui/react';
import CollectionSelect from './CollectionSelect';

export default function Explore(){
    const [collection, setCollection] = useState('');
    const [collections, setCollections] = useState([]);
    const [,setLocation] = useLocation();
      const HandleClick = () =>{
      setLocation(`/addCollection`);
    }

    useEffect(() => {
      const db = firebase.firestore();
      db.collection('collections').onSnapshot((snapshot: any) => {
        const newCollections = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        }));
        setCollections(newCollections);
      });
    }, []);

    return (
      <Flex
      w="100%"
      h="100%"
      px={10}
      pt={6}
      overflowY="scroll"
      justify="start"
      flexDir="row"
    >
        <div style={{width: 'inherit'}}>
        <Row>
        <div style={{padding: '10px'}}>
            <Button onClick={HandleClick}>Add Collection</Button>
        </div>
        <div className="sortSelect" style={{ marginRight: '0px', marginLeft: 'auto', display: 'flex',justifyContent: 'space-between', padding: '10px' }}>
          <CollectionSelect collections={collections} setCollection={setCollection} collection={collection} />
        </div>
        </Row>
        <div>
          
          {
            collection !== '' ?
            <CollectionDisplay address={collection} ownedOnly={false} metadata={collections.filter((collectionK: any) => collectionK.contract===collection)} DropdownProp={null}/>
            :
            collections.length>0 ?
            <CollectionList collections={collections} setCollection={setCollection} />
            :
            <Flex w="100%" flex="1" flexDir="column" align="center">
              <Flex
                px={20}
                py={10}
                bg="gray.200"
                textAlign="center"
                align="center"
                borderRadius="5px"
                flexDir="column"
                fontSize="xl"
                color="gray.400"
                mt={28}
              >
                <Wind />
                <Text fontWeight="600" pt={5}>
                  Loading collections ...
                </Text>
              </Flex>
            </Flex>
          }
        
        </div>
        </div>
    </Flex>
    )
}
