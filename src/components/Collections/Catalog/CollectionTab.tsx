import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import {
    Collection
} from '../../../reducer/slices/collections';

interface CollectionTabProps extends Collection {
    selected: boolean;
    onSelect: (address: string) => void;
}

export default function CollectionTab({
    address,
    metadata,
    selected,
    onSelect
}: CollectionTabProps) {
    return (
        <Flex
            align="center"
            py={2}
            px={4}
            bg={selected ? 'gray.100' : 'white'}
            color={selected ? 'black' : 'gray.600'}
            _hover={{
                cursor: 'pointer',
                color: selected ? 'black' : 'gray.800'
            }}
            onClick={() => onSelect(address)}
            role="group"
        >
            <Flex
                align="center"
                justify="center"
                w={8}
                h={8}
                bg={selected ? 'brand.blue' : 'gray.100'}
                color={selected ? 'white' : 'gray.400'}
                borderRadius="100%"
                fontWeight="600"
                _groupHover={{
                    bg: selected ? 'brand.blue' : 'gray.200'
                }}
            >
                {
                    metadata.name==="Kraznik" ?
                    <img src={require('../../common/assets/Kraznik.jpg')} alt="Kraznik" width="100%" height="100%" />
                    :
                    metadata.name==="Hicetnunc" ?
                    <img src={require('../../common/assets/HEN.jpg')} alt="Hen" width="100%" height="100%" />
                    :
                    metadata.name==="Kalamint" ?
                    <img src={require('../../common/assets/kalamint.jpg')} alt="Kalamint" width="100%" height="100%" />
                    :
                    metadata.name==="hash3points" ?
                    <img src={require('../../common/assets/hash3.png')} alt="hash3points" width="100%" height="100%" />
                    :
                    metadata.name==="ByteBlock" ?
                    <img src={require('../../common/assets/logo_bb.png')} alt="ByteBlock" width="100%" height="100%" />
                    :
                    <Text>{metadata?.name ? metadata.name[0] : '?'}</Text>
                }
            </Flex>
            <Text pl={4} fontWeight={selected ? '600' : '600'}>
                {metadata?.name || address}
            </Text>
        </Flex>
    );
}