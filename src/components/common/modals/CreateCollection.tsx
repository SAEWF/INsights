import React, { useState } from 'react';
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { Plus } from 'react-feather';
import { MinterButton } from '../../common';
import { useDispatch } from '../../../reducer';
import { createAssetContractAction, addObjktCollectionAction } from '../../../reducer/async/actions';
import FormModal, { BaseModalProps, BaseModalButtonProps } from './FormModal';

interface CreateCollectionModalProps extends BaseModalProps {}

function CreateCollectionModal(props: CreateCollectionModalProps) {
  const [contractName, setContractName] = useState('');
  const dispatch = useDispatch();
  const initialRef = React.useRef(null);
  return (
    <FormModal
      disclosure={props.disclosure}
      sync={props.sync}
      method="createAssetContract"
      dispatchThunk={() => dispatch(createAssetContractAction(contractName))}
      onComplete={() => setContractName('')}
      initialRef={initialRef}
      pendingMessage="Creating collection..."
      completeMessage="Collection created"
      body={onSubmit => (
        <>
          <ModalHeader>New Collection</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel fontFamily="mono">Collection Name</FormLabel>
              <Input
                autoFocus={true}
                ref={initialRef}
                placeholder="Input your collection name"
                value={contractName}
                onChange={e => setContractName(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <MinterButton variant="primaryAction" onClick={() => onSubmit()}>
              Create Collection
            </MinterButton>
          </ModalFooter>
        </>
      )}
    />
  );
}

function AddObjktCollectionModal(props: CreateCollectionModalProps) {
  const [contractName, setContractName] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const dispatch = useDispatch();
  const initialRef = React.useRef(null);
  return (
    <FormModal
      disclosure={props.disclosure}
      sync={props.sync}
      method="createAssetContract"
      dispatchThunk={() => dispatch(addObjktCollectionAction({name: contractName, address: contractAddress}))}
      onComplete={() => setContractName('')}
      initialRef={initialRef}
      pendingMessage="Adding collection..."
      completeMessage="Collection added"
      body={onSubmit => (
        <>
          <ModalHeader>Objkt Collection</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel fontFamily="mono">Collection Name</FormLabel>
              <Input
                autoFocus={true}
                ref={initialRef}
                placeholder="Input your collection Name"
                value={contractName}
                onChange={e => setContractName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontFamily="mono">Collection Address</FormLabel>
              <Input
                autoFocus={true}
                ref={initialRef}
                placeholder="Input your collection Address (KT1...)"
                value={contractAddress}
                onChange={e => setContractAddress(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <MinterButton variant="primaryAction" onClick={() => onSubmit()}>
              Add Collection
            </MinterButton>
          </ModalFooter>
        </>
      )}
    />
  );
}

interface CreateCollectionButtonProps extends BaseModalButtonProps {}

export function CreateCollectionButton(props: CreateCollectionButtonProps) {
  const disclosure = useDisclosure();
  return (
    <>
      <MinterButton variant="primaryActionInverted" onClick={disclosure.onOpen}>
        <Box color="currentcolor">
          <Plus size={16} strokeWidth="3" />
        </Box>
        <Text ml={2}>New Collection</Text>
      </MinterButton>
      <CreateCollectionModal disclosure={disclosure} sync={props.sync} />
    </>
  );
}

export function AddObjktCollectionButton(props: CreateCollectionButtonProps) {
  const disclosure = useDisclosure();
  return (
    <>
      <MinterButton variant="primaryActionInverted" onClick={disclosure.onOpen}>
        <Box color="currentcolor">
          <Plus size={16} strokeWidth="3" />
        </Box>
        <Text ml={2}>Add Objkt Collection</Text>
      </MinterButton>
      <AddObjktCollectionModal disclosure={disclosure} sync={props.sync} />
    </>
  );
}
