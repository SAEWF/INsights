import React from 'react';
import {
  // Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea
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
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const DESCRIPTION_PLACEHOLDER =
  'Tell a story behing your NFT, a good description always preferred';

export default function Form() {
  const state = useSelector(s => s.createNft);
  const dispatch = useDispatch();
  const { name, description } = state.fields;
  const [show, toggleShow] = React.useState(false);
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
      <Divider borderColor="brand.lightBlue" opacity="1" marginY={10} />

      <Heading size="md"
        onClick={() => {
          toggleShow(!show);
          dispatch(addMetadataRow());
        }}
        _hover={{
          cursor: 'pointer',
        }}
        paddingBottom={6}
      >
        Additional Information(s) {show ? <i className="fas fa-chevron-down ml-2"></i> : <i className="fas fa-chevron-up ml-2"></i>}
      </Heading>

      {console.log(state)}
      {!show ? '' : <>
        { state.attributes.filter((_, idx) => idx < 1).map(({ name, value }, key) => {

          return (
            <Flex key={key} >
              <Row>
                <Col xs={12} md={12} lg={12} xl={12}>
                  <FormControl paddingBottom={6} paddingLeft={2} >
                    <FormLabel fontFamily="mono">Artist Name</FormLabel>
                    <Input
                      autoFocus={true}
                      placeholder="Input artist name"
                      value={value || ''}
                      onChange={e => {
                        dispatch(updateMetadataRowName({ key: 0, name: 'artist' }));
                        dispatch(updateMetadataRowValue({ key: 0, value: e.target.value }));
                        // dispatch(addMetadataRow());
                      }
                      }
                    />
                  </FormControl>
                </Col>
                {/* <Col xs={12} md={12} lg={12} xl={12}>
                  <FormControl paddingBottom={6} paddingLeft={2} >
                    <FormLabel fontFamily="mono">Tags</FormLabel>
                    <Input
                      placeholder="Input all your tags"
                      value={value || ''}
                      onChange={e => {
                        dispatch(updateMetadataRowName({ key: 1, name: 'tags' }));
                        dispatch(updateMetadataRowValue({ key: 1, value: e.target.value }));
                      }
                      }
                    />
                  </FormControl>
                </Col> */}
              </Row>



              {/* <FormControl paddingBottom={6} paddingRight={2} flex="1">
              <FormLabel fontFamily="mono">Key</FormLabel>
              <Input
                placeholder="e.g. Country"
                value={name || ''}
                onChange={e =>
                  dispatch(updateMetadataRowName({ key, name: e.target.value }))
                }
              />
            </FormControl>
            <FormControl paddingBottom={6} paddingLeft={2} flex="1">
              <FormLabel fontFamily="mono">Value</FormLabel>
              <Input
                placeholder="e.g. India"
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
            </Box> */}
            </Flex>

          );
        })}</>}
      {/* <MinterButton
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
