import React, { useState } from 'react';
import {
  Box,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { Check } from 'react-feather';
import { MinterButton } from '../../common';
import { useDispatch, useSelector } from '../../../reducer';
import { bidTokenAction } from '../../../reducer/async/Auction/action';
import FormModal, { BaseModalProps, BaseModalButtonProps } from './FormModal';
import tz from '../assets/tezos-sym-white.svg'

interface ConfigureTokenModalProps extends BaseModalProps {
  auctionId: number
}

export function ConfigureTokenModal(props: ConfigureTokenModalProps) {
  const [price, setPrice] = useState('');

  const dispatch = useDispatch();
  const initialRef = React.useRef(null);

  const salePrice = Number(price);
  const validPrice = !Number.isNaN(price) && salePrice > 0;

  const handleChange = (e: any) => {
      setPrice(e.target.value);
      return;
  };

  return (
    <FormModal
      disclosure={props.disclosure}
      sync={props.sync}
      method="bidToken"
      dispatchThunk={() =>
        dispatch(
          bidTokenAction({
            auctionId: props.auctionId,
            bidPrice: salePrice
          })
        )
      }
      onComplete={() => setPrice('')}
      initialRef={initialRef}
      pendingMessage="Listing token for auction ..."
      completeMessage="Token listed for auction !!"
      body={onSubmit => (
        <>
          <ModalHeader>Set your bid</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.900"
                    fontSize="1.2em"
                    children={<img src={tz} alt="" width={10} height="auto" style={{display: 'inline-block'}}/>}
                  />
                  <Input
                    autoFocus={true}
                    ref={initialRef}
                    placeholder="Enter minimim bid"
                    value={price}
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormControl>
              <Box ml={2}>
                <MinterButton
                  variant={
                    validPrice ? 'primaryAction' : 'primaryActionInactive'
                  }
                  onClick={() => validPrice && onSubmit()}
                >
                  <Check />
                </MinterButton>
              </Box>
            </Flex>
          </ModalBody>
        </>
      )}
    />
  );
}

interface BidTokenButtonProps extends BaseModalButtonProps {
  auctionId: number;
}

export function BidTokenButton(props: BidTokenButtonProps) {
  const disclosure = useDisclosure();
  const { status } = useSelector(s => s.status.configureToken)
  return (
    <>
      <MinterButton variant="primaryAction" onClick={disclosure.onOpen} disabled={status === 'in_transit'}>
        Bid
      </MinterButton>
      <ConfigureTokenModal {...props} disclosure={disclosure} sync={props.sync} />
    </>
  );
}


