import React from 'react';
import {
  Button,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { MinterButton } from '../../common';
import { useDispatch, useSelector } from '../../../reducer';
import { cancelTokenAction } from '../../../reducer/async/Auction/action';
import FormModal, { BaseModalProps, BaseModalButtonProps } from './FormModal';

interface CancelTokenAuctionModalProps extends BaseModalProps {
  refresh: () => void;
  id: number;
}

export function CancelTokenAuctionModal(props: CancelTokenAuctionModalProps) {
  const dispatch = useDispatch();
  const initialRef = React.useRef(null);
  return (
    <FormModal
      disclosure={props.disclosure}
      sync={props.sync}
      method="cancelTokenAuction"
      dispatchThunk={() =>
        dispatch(
          cancelTokenAction({
              auctionId: props.id
          })
        )
      }
      onComplete={() => { props.refresh(); }}
      initialRef={initialRef}
      pendingMessage="Cancelling token auction !"
      completeMessage="Token auction Canceld !"
      body={onSubmit => (
        <>
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to cancel the auction?</Text>
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

interface CancelTokenAuctionButtonProps extends BaseModalButtonProps {
  refresh: () => void;
  id: number;
}

export function CancelTokenAuctionButton(props: CancelTokenAuctionButtonProps) {
  const disclosure = useDisclosure();
  const { status } = useSelector(s => s.status.cancelTokenAuction)
  
  return (
    <>
      <MinterButton variant="cancelTokenAuction" onClick={disclosure.onOpen} disabled={status === 'in_transit'}>
        Cancel Auction
      </MinterButton>

      <CancelTokenAuctionModal
        {...props}
        disclosure={disclosure}
        sync={props.sync}
      />
    </>
  );
}
