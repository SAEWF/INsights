import React, { useState } from 'react';
import {
  Box,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { Check } from 'react-feather';
import { MinterButton } from '../../common';
import { useDispatch, useSelector } from '../../../reducer';
import { listTokenAction } from '../../../reducer/async/actions';
import FormModal, { BaseModalProps, BaseModalButtonProps } from './FormModal';
import tz from '../assets/tezos-sym-white.svg'

interface SellTokenModalProps extends BaseModalProps {
  contract: string;
  tokenId: number;
  royaltyPercent: number;
}

export function SellTokenModal(props: SellTokenModalProps) {
  const [price, setPrice] = useState('');
  const [total, setTotal] = useState('0');
  const dispatch = useDispatch();
  const initialRef = React.useRef(null);

  const salePrice = Math.floor(Number(price) * 1000000);
  const validPrice = !Number.isNaN(price) && salePrice > 0;

  const handleChange = (e: any) => {
      const totalP: number = Number((Number(e.target.value) + (Number(e.target.value) * props.royaltyPercent)/100.0).toFixed(2));
      setPrice(e.target.value);
      setTotal(totalP+'');
      return;
  };

  return (
    <FormModal
      disclosure={props.disclosure}
      sync={props.sync}
      method="listToken"
      dispatchThunk={() =>
        dispatch(
          listTokenAction({
            contract: props.contract,
            tokenId: props.tokenId,
            salePrice: salePrice
          })
        )
      }
      onComplete={() => setPrice('')}
      initialRef={initialRef}
      pendingMessage="Listing token for sale..."
      completeMessage="Token listed for sale"
      body={onSubmit => (
        <>
          <ModalHeader>Set your price</ModalHeader>
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
                    placeholder="Enter sale amount"
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
          <ModalFooter >
          Final listing price [ {total} ], including royalty 
          </ModalFooter>
        </>
      )}
    />
  );
}

interface SellTokenButtonProps extends BaseModalButtonProps {
  contract: string;
  tokenId: number;
  royaltyPercent: number;
}

export function SellTokenButton(props: SellTokenButtonProps) {
  const disclosure = useDisclosure();
  const { status } = useSelector(s => s.status.listToken)
  
  return (
    <>
      <MinterButton variant="primaryAction" onClick={disclosure.onOpen} disabled={status === 'in_transit'}>
        Sell
      </MinterButton>
      <SellTokenModal {...props} disclosure={disclosure} sync={props.sync} />
    </>
  );
}
