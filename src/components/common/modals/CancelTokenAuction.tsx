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

interface ResolveTokenAuctionModalProps extends BaseModalProps {
  contract: string;
  tokenId: number;
  id: number;
}

export function ResolveTokenAuctionModal(props: ResolveTokenAuctionModalProps) {
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
      initialRef={initialRef}
      pendingMessage="Cancelling token auction !"
      completeMessage="Token auction resolved !"
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

interface ResolveTokenAuctionButtonProps extends BaseModalButtonProps {
  contract: string;
  tokenId: number;
  id: number
}

export default function ResolveTokenAuctionButton(props: ResolveTokenAuctionButtonProps) {
  const disclosure = useDisclosure();
  const { status } = useSelector(s => s.status.cancelTokenAuction)
  
  return (
    <>
      <MinterButton variant="cancelTokenAuction" onClick={disclosure.onOpen} disabled={status === 'in_transit'}>
        Cancel Auction
      </MinterButton>

      <ResolveTokenAuctionModal
        {...props}
        disclosure={disclosure}
        sync={props.sync}
      />
    </>
  );
}
