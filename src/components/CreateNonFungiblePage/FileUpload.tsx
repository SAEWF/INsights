import React, { createRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  useDisclosure
} from '@chakra-ui/react';
import { useSelector, useDispatch } from '../../reducer';
import {
  mintCsvTokensAction,
  readFileAsDataUrlAction
} from '../../reducer/async/actions';
import {
  updateDisplayImageFile,
  SelectedFile
} from '../../reducer/slices/createNft';
import FormModal from '../common/modals/FormModal';
import { useLocation } from 'wouter';
import { MinterButton } from '../common';
import { clearSelectedCsvFile } from '../../reducer/slices/createNftCsvImport';

export function FilePreview({ file }: { file: SelectedFile }) {
  const dispatch = useDispatch();
  if (/^image\/.*/.test(file.type)) {
    return (
      <Image
        src={file.objectUrl}
        width="100%"
        height="100%"
        objectFit="scale-down"
      />
    );
  }
  if (/^video\/.*/.test(file.type)) {
    const canvasRef = createRef<HTMLCanvasElement>();
    return (
      <>
        <video
          controls
          muted
          onLoadedData={e => {
            const canvas = canvasRef.current;
            if (!canvas) {
              return console.error('`canvasRef` current element is null');
            }
            const video = e.currentTarget;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            var canvasContext = canvas.getContext('2d');
            if (!canvasContext) {
              return console.error('`2d` canvas context not supported');
            }
            canvasContext.drawImage(video, 0, 0);
            const type = 'image/png';
            canvas.toBlob(blob => {
              if (!blob) {
                return console.error('Could not convert canvas to blob');
              }
              dispatch(
                updateDisplayImageFile({
                  objectUrl: URL.createObjectURL(blob),
                  name: 'foo',
                  size: blob.size,
                  type: blob.type
                })
              );
            }, type);
          }}
        >
          <source src={file.objectUrl} type={file.type} />
        </video>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </>
    );
  }
  if (file.type === 'model/gltf+json' || file.type === 'model/gltf-binary') {
    return (
      <>
        <model-viewer
          camera-controls
          auto-rotate
          data-js-focus-visible
          src={file.objectUrl}
          class="upload-preview"
        ></model-viewer>
      </>
    );
  }
  if(/^audio\/.*/.test(file.type)){
    return (
      <>
      <audio controls src={file.objectUrl}></audio>
      </>
    )
  }
  if(file.type === 'application/pdf'){
    return (
      <>
        <iframe  height="500px" width="400px" src={file.objectUrl} title={file.name}></iframe>
      </>
    )
  }

  return null;
}

export default function FileUpload() {
  const state = useSelector(s => s.createNft);
  const dispatch = useDispatch();

  const onDrop = useCallback(
    (files: File[]) => {
      dispatch(readFileAsDataUrlAction({ ns: 'createNft', file: files[0] }));
    },
    [dispatch]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 30 * 1024 * 1024,
    accept: [
      'image/*',
      'video/*',
      'audio/*',
      'model/gltf-binary',
      'model/gltf+json',
      '.gltf',
      '.glb',
      '.pdf'
    ]
  });

  return (
    <Flex
      align="center"
      flexDir="column"
    // width="100%"
    // flex="1"
    // pt={{
    //   base: 2,
    //   md: 12
    // }}
    >
      <Heading size="lg" paddingBottom={8} textAlign="center">
        Upload Your NFT
      </Heading>
      <Text
        fontSize="xs"
        color="brand.blue"
        fontFamily="mono"
        textAlign="center"
        pb={4}
      >
        Comfortable size 30MB
      </Text>
      <Flex
        borderStyle="dashed"
        borderWidth="2px"
        borderColor="brand.lightBlue"
        borderRadius="3px"
        // width="100%"
        justify="center"
        align="center"
        marginTop={3}
        {...getRootProps()}
      >
        <Box as="input" {...getInputProps()} />
        {state.selectedFile?.objectUrl ? (
          <Box p={4}>
            <Flex
              justify="center"
              align="center"
              maxWidth="400px"
              maxHeight="400px"
              overflow="hidden"
            >
              <FilePreview file={state.selectedFile} />
            </Flex>
          </Box>
        ) : (
          <Flex
            borderColor="white"
            borderWidth="1px"
            flexDir="column"
            align="center"
            // py={24}
            marginBottom="4"
            paddingX={24}
            paddingY={8}
            flex="1"
          >
            <Text fontSize={20} textAlign="center" paddingX={4}>
              Click or Drag the File
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

export function CsvFileUpload() {
  const state = useSelector(s => s.createNftCsvImport);
  const dispatch = useDispatch();
  const disclosure = useDisclosure();
  const [, setLocation] = useLocation();

  const onDrop = useCallback(
    (files: File[]) => {
      dispatch(
        readFileAsDataUrlAction({ ns: 'createNftCsvImport', file: files[0] })
      );
    },
    [dispatch]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 30 * 1024 * 1024,
    // The type for a csv file is blank in some cases (like in windows chrome)
    // accept: ['text/csv']
  });

  return (
    <Flex flexDir="column" align="center">
      <Flex
        // bg="brand.brightGray"
        // border="1px solid"
        // borderColor="brand.lightBlue"
        // borderRadius="5px"
        borderStyle="dashed"
        borderWidth="2px"
        borderColor="brand.lightBlue"
        borderRadius="3px"
        display="inline-flex"
        marginBottom="4"
        paddingX={16}
        paddingY={12}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Text fontWeight="500" fontSize={18}>
          {state.selectedCsvFile
            ? `Selected file: ${state.selectedCsvFile.name}`
            : 'Click or drag CSV file to this area to upload'}
        </Text>
      </Flex>
      <Flex justify="center">
        <MinterButton
          variant={
            state.selectedCsvFile === null
              ? 'primaryActionInactive'
              : 'primaryAction'
          }
          onClick={() => state.selectedCsvFile && disclosure.onOpen()}
        >
          Mint from CSV
        </MinterButton>
      </Flex>
      <FormModal
        disclosure={disclosure}
        method="mintCsvTokens"
        dispatchThunk={() => dispatch(mintCsvTokensAction())}
        onComplete={() => dispatch(clearSelectedCsvFile())}
        afterClose={() => setLocation('/collections')}
        dispatchOnOpen={true}
        pendingAsyncMessage={
          <>
            Opening wallet...
            <br />
            <Text
              fontSize="1rem"
              fontWeight="normal"
              marginTop={4}
              textAlign="center"
              color="gray.500"
            >
              <span role="img" aria-label="lightbulb">
                ????
              </span>{' '}
              Minting on Tezos produces 1,500,000 times less CO2 emissions than
              Ethereum.
            </Text>
          </>
        }
      />
    </Flex>
  );
}
