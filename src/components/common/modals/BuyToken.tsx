import React from 'react';
import {
  Box,
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
import { buyTokenAction } from '../../../reducer/async/actions';
import { Nft } from '../../../lib/nfts/decoders';
import FormModal, { BaseModalProps, BaseModalButtonProps } from './FormModal';
import tz from '../assets/tezos-sym.svg'

interface BuyTokenModalProps extends BaseModalProps {
  token: Nft;
}

// change for cases when minter is not present 
const ADMIN_WALLET = 'tz1c3U4UUB59WssxJ1XJ7fibn6vwT7jDwRoV';
const DEFAULT_ROYALTY_PERCENT = 10;

export function BuyTokenModal(props: BuyTokenModalProps) {
  const dispatch = useDispatch();
  const initialRef = React.useRef(null);
  const royalty = props.token.metadata!.attributes?.filter(it => it.name==='Royalty');
  const royaltyArray = props.token.metadata!.attributes?.filter(it => it.name==='Royalty');
  const royaltyPercentage = (royaltyArray!==undefined && royaltyArray!.length > 0) ? parseInt(royaltyArray[0].value) : 10;
  const royaltyAmount = (props.token.sale !== undefined && props.token.sale.seller!==props.token.metadata.minter) ?  royaltyPercentage*props.token.sale!.price / 100.0 : 0;
  const totalAmount = (props.token.sale !== undefined) ?  props.token.sale!.price + royaltyAmount : 0;
  // console.log(royalty);
  return (
    <FormModal
      disclosure={props.disclosure}
      sync={props.sync}
      method="buyToken"
      dispatchThunk={() =>
        dispatch(
          buyTokenAction({
            contract: props.token.sale?.saleToken.address || '',
            tokenId: props.token.sale?.saleToken.tokenId || 0,
            tokenSeller: props.token.sale?.seller || '',
            salePrice: props.token.sale?.price || 0,
            saleId: props.token.sale?.saleId || 0,
            saleType: props.token.sale?.type || '',
            minter: props.token.metadata.minter || ADMIN_WALLET,
            royalty: (royalty!==undefined && royalty!.length > 0) ? parseInt(royalty[0].value) : DEFAULT_ROYALTY_PERCENT,
          })
        )
      }
      initialRef={initialRef}
      pendingMessage="Purchasing token..."
      completeMessage="Token purchased"
      body={onSubmit => (
        <>
          <ModalHeader>Checkout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              You are about to purchase
              <Box as="span" fontWeight="bold">
                {' '}
                {props.token.title} (<img src={tz} alt="" width={10} height="auto" style={{display: 'inline-block'}}/> {totalAmount})
              </Box>
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="primaryAction"
              onClick={() => onSubmit()}
              isFullWidth={true}
            >
              Buy now
            </Button>
          </ModalFooter>
        </>
      )}
    />
  );
}

interface BuyTokenButtonProps extends BaseModalButtonProps {
  token: Nft;
}

export function BuyTokenButton(props: BuyTokenButtonProps) {
  const disclosure = useDisclosure();
  const { status } = useSelector(s => s.status.buyToken)

  return (
    <>
      <MinterButton variant="primaryAction" onClick={disclosure.onOpen} disabled={status === 'in_transit'}>
        Buy now
      </MinterButton>

      <BuyTokenModal {...props} disclosure={disclosure} sync={props.sync} />
    </>
  );
}
