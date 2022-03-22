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
import { resolveTokenAction } from '../../../reducer/async/Auction/action';
import FormModal, { BaseModalProps, BaseModalButtonProps } from './FormModal';

interface ResolveTokenAuctionModalProps extends BaseModalProps {
  id: number;
}

export function ResolveTokenAuctionModal(props: ResolveTokenAuctionModalProps) {
  const dispatch = useDispatch();
  const initialRef = React.useRef(null);
  return (
    <FormModal
      disclosure={props.disclosure}
      sync={props.sync}
      method="resolveToken"
      dispatchThunk={() =>
        dispatch(
          resolveTokenAction({
              auctionId: props.id
          })
        )
      }
      initialRef={initialRef}
      pendingMessage="Resolving token auction !"
      completeMessage="Token auction resolved !"
      body={onSubmit => (
        <>
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to resolve the auction?</Text>
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
  id: number
}

export function ResolveTokenAuctionButton(props: ResolveTokenAuctionButtonProps) {
  const disclosure = useDisclosure();
  const { status } = useSelector(s => s.status.resolveToken)
  
  return (
    <>
      <MinterButton variant="resolveToken" onClick={disclosure.onOpen} disabled={status === 'in_transit'}>
        Resolve Auction
      </MinterButton>

      <ResolveTokenAuctionModal
        {...props}
        disclosure={disclosure}
        sync={props.sync}
      />
    </>
  );
}
