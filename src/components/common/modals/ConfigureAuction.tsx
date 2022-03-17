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
import { configureTokenAction } from '../../../reducer/async/Auction/action';
import FormModal, { BaseModalProps, BaseModalButtonProps } from './FormModal';
import tz from '../assets/tezos-sym-white.svg'
import { Nft } from '../../../lib/nfts/decoders';

interface ConfigureTokenModalProps extends BaseModalProps {
  token: Nft;
  contract: string;
  tokenId: number;
}

export function ConfigureTokenModal(props: ConfigureTokenModalProps) {
  const [price, setPrice] = useState('');
  const minRaisePercent = 5, minRaise = 10000;

  const dispatch = useDispatch();
  const initialRef = React.useRef(null);

  const salePrice = Math.floor(Number(price) * 1000000);
  const validPrice = !Number.isNaN(price) && salePrice > 0;

  const handleChange = (e: any) => {
      setPrice(e.target.value);
      return;
  };

  return (
    <FormModal
      disclosure={props.disclosure}
      sync={props.sync}
      method="configureToken"
      dispatchThunk={() =>
        dispatch(
          configureTokenAction({
            openingPrice: salePrice,
            // to do : set minRaise percent
            minRaisePercent: minRaisePercent,
            minRaise: minRaise,
            asset: [
                {
                  fa2_address: props.contract,
                  fa2_batch: [
                    {
                      "token_id" : props.tokenId,
                      "amount" : 1
                    }
                  ]
                }
            ]
          })
        )
      }
      onComplete={() => setPrice('')}
      initialRef={initialRef}
      pendingMessage="Listing token for auction ..."
      completeMessage="Token listed for auction !!"
      body={onSubmit => (
        <>
          <ModalHeader>Set your minimum bid</ModalHeader>
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

interface ConfigureTokenButtonProps extends BaseModalButtonProps {
  token: Nft;
  contract: string;
  tokenId: number;
}

export function ConfigureTokenButton(props: ConfigureTokenButtonProps) {
  const disclosure = useDisclosure();
  const { status } = useSelector(s => s.status.configureToken)
  return (
    <>
      <MinterButton variant="primaryAction" onClick={disclosure.onOpen} disabled={status === 'in_transit'}>
        Create Auction
      </MinterButton>
      <ConfigureTokenModal {...props} disclosure={disclosure} sync={props.sync} />
    </>
  );
}


