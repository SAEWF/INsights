import React from 'react';
import {
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
  Button
} from '@chakra-ui/react';
import { MinterButton } from '../../common/index';
import { useDispatch } from '../../../reducer';
import { transferTokenAction } from '../../../reducer/async/actions';
import FormModal, { BaseModalProps, BaseModalButtonProps } from './FormModal';

interface BurnTokenModalProps extends BaseModalProps {
  contractAddress: string;
  tokenId: number;
}

export function BurnTokenModal(props: BurnTokenModalProps) {
  // const [toAddress, setToAddress] = useState('');
  const burnAddress = "tz1XSt11sjven54ju5Jjfc41iZs1bfbzSksx"
  const dispatch = useDispatch();
  const initialRef = React.useRef(null);
  return (
    <FormModal
    disclosure={props.disclosure}
    sync={props.sync}
    method="transferToken"
          dispatchThunk={() =>
        dispatch(
          transferTokenAction({
            contract: props.contractAddress,
            tokenId: props.tokenId,
            to: burnAddress
          })
        )
      }
    initialRef={initialRef}
    pendingMessage="Burning token sale..."
    completeMessage="Token successfully burned"
    body={onSubmit => (
      <>
        <ModalHeader>Are you sure?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure you want to burn the token?</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="primaryAction" mr={3} onClick={() => onSubmit()}>
            Yes
          </Button>
          <Button
            variant="cancelAction"
            onClick={() => props.disclosure.onClose()}
          >
            No
          </Button>
        </ModalFooter>
      </>
    )}
  />
  );
}

interface BurnTokenButtonProps extends BaseModalButtonProps {
  contractAddress: string;
  tokenId: number;
}

export function BurnTokenButton(props: BurnTokenButtonProps) {
  const disclosure = useDisclosure();
  return (
    <>
      <MinterButton variant="cancelAction" onClick={disclosure.onOpen}>
        <Text >Burn</Text>
      </MinterButton>
      <BurnTokenModal
        {...props}
        disclosure={disclosure}
        sync={props.sync}
      />
    </>
  );
}
