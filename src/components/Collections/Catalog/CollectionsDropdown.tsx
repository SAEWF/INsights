import React from 'react';
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Text
} from '@chakra-ui/react';
import { useSelector, useDispatch } from '../../../reducer';
import { selectCollection } from '../../../reducer/slices/collections';
import { ChevronDown } from 'react-feather';

export default function CollectionsDropdown() {
  const state = useSelector(s => s.collections);
  const global = state.collections[state.globalCollection];
  const dispatch = useDispatch();

  return (
    <Flex width="100%" align="center">
      <Menu>
        <MenuButton
          as={Button}
          border="1px solid"
          borderColor="brand.gray"
          flex="1"
        >
          <Flex align="center">
            <Box mr={3}>
              <ChevronDown />
            </Box>
            {state.selectedCollection
              ? state.collections[state.selectedCollection].metadata.name
              : '-'}
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuOptionGroup
            type="radio"
            defaultValue={state.selectedCollection || ''}
          >
            <Text ml={4} my={2} fontWeight="600">
              Featured
            </Text>
            {
              global && global!==undefined &&
              <MenuItemOption
                key={state.globalCollection}
                selected={state.globalCollection === state.selectedCollection}
                value={state.globalCollection}
                onSelect={() =>
                  dispatch(selectCollection(state.globalCollection))
                }
              >
                {state.collections[state.globalCollection].metadata.name}
              </MenuItemOption>
            }
            <Text ml={4} my={2} fontWeight="600">
              ByteBlock Collections
            </Text>
            {Object.keys(state.collections)
              .filter(address => address !== state.globalCollection)
              .map((address, idx) => (
                <MenuItemOption
                  key={address + idx}
                  value={address}
                  selected={address === state.selectedCollection}
                  onClick={() => dispatch(selectCollection(address))}
                >
                  {state.collections[address].metadata.name}
                </MenuItemOption>
              ))}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </Flex>
  );
}
