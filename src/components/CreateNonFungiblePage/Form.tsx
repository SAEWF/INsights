import React, { useState, useEffect } from 'react';
import {
  // Box,
  // Divider,
  // Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
// import { Plus, X } from 'react-feather';
// import { MinterButton } from '../common';
import { useSelector, useDispatch } from '../../reducer';
import {
  addMetadataRow,
  // deleteMetadataRow,
  updateField,
  updateMetadataRowName,
  updateMetadataRowValue
} from '../../reducer/slices/createNft';
import CollectionSelect from './CollectionSelect';


const DESCRIPTION_PLACEHOLDER =
  'Tell a story behing your NFT, a good description always preferred';

export default function Form() {
  const state = useSelector(s => s.createNft);
  const dispatch = useDispatch();
  const { name, description, royalty } = state.fields;
  // const [artistName, setartistName] = useState("");
  const [tags, setTags] = useState("");
  const [, setEdition] = useState("1");

  useEffect(() => {
    dispatch(addMetadataRow());
    dispatch(updateMetadataRowName({ key: 0, name: 'Artist' }));
    return;
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    dispatch(addMetadataRow());
    dispatch(updateMetadataRowName({ key: 1, name: 'Tags' }));
    return;
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    dispatch(addMetadataRow());
    dispatch(updateMetadataRowName({ key: 2, name: 'Edition' }));
    dispatch(updateMetadataRowValue({ key: 2, value: '1' }))
    return;
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    dispatch(addMetadataRow());
    dispatch(updateMetadataRowName({ key: 3, name: 'Royalty' }));
    dispatch(updateMetadataRowValue({ key: 3, value: '5' }))
    return;
    // eslint-disable-next-line
  }, []);
  // console.log("state")
  // console.log(state)

  return (
    <>
      <CollectionSelect />
      <Heading size="md" paddingBottom={6}>
        Describe your NFT
      </Heading>
      <FormControl paddingBottom={6}>
        <FormLabel fontFamily="mono">NFT Name</FormLabel>
        <Input
          autoFocus={true}
          placeholder="Input your asset name"
          value={name || ''}
          onChange={e =>
            dispatch(updateField({ name: 'name', value: e.target.value }))
          }
        />
      </FormControl>
      <FormControl paddingBottom={6}>
        <FormLabel fontFamily="mono" display="flex">
          A Very Good Description
          <Text marginLeft={2} color="brand.lightGray">
            (Must Give)
          </Text>
        </FormLabel>
        <Textarea
          minHeight="150px"
          fontFamily="mono"
          placeholder={DESCRIPTION_PLACEHOLDER}
          value={description || ''}
          onChange={e =>
            dispatch(
              updateField({ name: 'description', value: e.target.value })
            )
          }
        />
      </FormControl>
      {/* Tags */}
      <FormControl paddingBottom={6}>
        <FormLabel fontFamily="mono" display="flex">
          Tags
        </FormLabel>
        <Input
          autoFocus={true}
          placeholder="Input tags to get you discovered E.g. art masterpiece dailyart artist greatart artwork"
          value={tags || ''}
          // used before dispatch update Metadata Row Name by useEffect
          onChange={e => {
            setTags(e.target.value)
            dispatch(updateMetadataRowValue({ key: 1, value: e.target.value }))
          }
          }
        />
      </FormControl>

      {/* Royalty percentage */}
       <FormControl paddingBottom={6}>
        <FormLabel fontFamily="mono" display="flex">
          Royalty (%)
        </FormLabel>
        <NumberInput 
          placeholder="Royalty percentage"
          step={1} 
          defaultValue={5} 
          value={royalty || '5'}
          min={5}
          max={10}
          onChange={(valueString) =>{
            dispatch(
              updateField({ name: 'royalty', value: valueString })
            );
            dispatch(
              updateMetadataRowValue({ key: 3, value: valueString })
            );
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
      </NumberInput>
      </FormControl>

      {/* Editions */}
       <FormControl paddingBottom={6}>
        <FormLabel fontFamily="mono" display="flex">
          Editions
        </FormLabel>
        <NumberInput 
          placeholder="Input editions of your nft, 1-20"
          step={1} 
          defaultValue={1} 
          min={1}
          max={5}
          onChange={(valueString) =>{
            setEdition(valueString)
            dispatch(updateMetadataRowValue({ key: 2, value: valueString }))
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
      </NumberInput>
      </FormControl>
     

      {/* <Divider borderColor="brand.lightBlue" opacity="1" marginY={10} />
      <Heading size="md" paddingBottom={6}>
        Any other attribute?
      </Heading>
      {state.attributes.map(({ name, value }, key) => {
        return (
          <Flex key={key} align="center" justify="stretch">
            <FormControl paddingBottom={6} paddingRight={2} flex="1">
              <FormLabel fontFamily="mono">Name</FormLabel>
              <Input
                placeholder="e.g. City"
                value={name || ''}
                onChange={e =>
                  dispatch(updateMetadataRowName({ key, name: e.target.value }))
                }
              />
            </FormControl>
            <FormControl paddingBottom={6} paddingLeft={2} flex="1">
              <FormLabel fontFamily="mono">Value</FormLabel>
              <Input
                placeholder="e.g. Bengaluru"
                value={value || ''}
                onChange={e =>
                  dispatch(
                    updateMetadataRowValue({ key, value: e.target.value })
                  )
                }
              />
            </FormControl>
            <Box
              color="gray.400"
              ml={4}
              mt={1}
              cursor="pointer"
              onClick={() => dispatch(deleteMetadataRow({ key }))}
              _hover={{
                color: 'brand.red'
              }}
            >
              <X size={30} />
            </Box>
          </Flex>
        );
      })}
      <MinterButton
        variant="primaryActionInverted"
        onClick={() => dispatch(addMetadataRow())}
        pl={3}
        pr={3}
        pt={2}
        pb={2}
      >
        <Box color="currentcolor">
          <Plus size={16} strokeWidth="3" />
        </Box>
        <Text ml={2}>Add field</Text>
      </MinterButton> */}
    </>
  );
}