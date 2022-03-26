import React from 'react'
import { Select } from '@chakra-ui/react';
import { useLocation } from 'wouter';

export default function CollectionSelect(props: any) {
    const [,setLocation] = useLocation();
    const HandleChangeCollection = (e: any) =>{
        props.setCollection(e.target.value);
        if(props.onSelect){
          props.onSelect(e.target.value);
        }
        setLocation(`/explore/${e.target.value}`);
    }

    return (
        <div>
          <Select
            bg="#00ffbe"
            borderColor="#00ffbe"
            color="black"
            onChange={HandleChangeCollection}
          >
            <option style={{color:'white', backgroundColor: 'black', borderColor: 'cyan'}} key="" value="" defaultChecked={true}>Collections</option>
            {
              props.collections.map((collectionK: any) => {
                return(
                  <option selected={collectionK.id===props.collection} style={{color:'white', backgroundColor: 'black'}} key={collectionK.id} value={collectionK.name.replaceAll(' ','_')}>{collectionK.name}</option>
                );
              })
            }
          </Select>
        </div>
    )
}
