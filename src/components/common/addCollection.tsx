import React, {useState } from 'react';
import {Form, FormGroup, Container} from 'react-bootstrap';

import firebase from '../../lib/firebase/firebase'
import './styles/style.css';
import { Flex, Input, Box, Textarea, InputGroup, InputLeftAddon, Button} from '@chakra-ui/react';
import { verifyContract } from '../../lib/nfts/queries';
import uploadImage from './uploadImage';
import { useLocation } from 'wouter';
// import { MinterButton } from '.';
import {  useSelector } from '../../reducer';
// import { FaWallet } from 'react-icons/fa';
// import { connectWallet, disconnectWallet } from '../../reducer/async/wallet';


function RegistrationPage(props: any) {
    const { system } = useSelector(s => s);
    const [ , setLocation] = useLocation();
    // const dispatch = useDispatch();
    const [formData, setFormData] = useState({"display":false});
    const [name, setName] = useState('');
    const [contract, setContract] = useState('');
    const [desc, setDesc] = useState('');
    const [walletID, setWalletID] = useState('');
    const [twt, setTwt] = useState('');
    const [disable, setDisable] = useState(false);
    const [file, setFile] = useState(null);
    const [website, setWebsite] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [discord, setDiscord] = useState('');

    // useEffect(() => {
    //   if(system.status==='WalletConnected'){
    //     setWalletID(system.tzPublicKey);
    //   }
    // }, [system]);

    const isValid = (contract: string) =>{
      if(contract.length<3){
        return false;
      }
      if(contract[0]!=='K' || contract[1]!=='T' || contract[2]!=='1'){
        return false;
      }
      return true;
    }

    const RegisterUser = async () => {
      document.querySelector('.registrationError')!.innerHTML = "";
      document.querySelector('.successMessage')!.innerHTML = "";
      document.querySelector('.twtcheck')!.innerHTML = "";
      document.querySelector('.utubecheck')!.innerHTML = "";
      document.querySelector('.igcheck')!.innerHTML = "";

      const db = firebase.firestore();
      var url="";
      const docRef = db.collection('collections').doc(contract);
      await docRef.get().then(async (doc)=>{
        if(doc.exists){
            document.querySelector('.successMessage')!.innerHTML = "This request already exist . ";
        }
        else{

            try{
                if(!walletID){
                    document.querySelector('.registrationError')!.innerHTML = "Please connect your wallet as contract creator .";
                    return;
                }
                if(!isValid(contract)){
                    document.querySelector('.registrationError')!.innerHTML = "Please enter a valid contract address .";
                    return;
                }
                if(file!==null){
                    url = await uploadImage(file);
                }
                docRef.set({
                    name: name,
                    description: desc,
                    twt: twt,
                    website: website,
                    contract: contract,
                    owner: walletID,
                    display: false,
                    image: url,
                    discord: discord
                });
                setSuccess(true);
                setDisable(true);
            }
            catch(err){
                console.log(err);
            }
        }
      });
    }
        
    const handleChange = (e: any) =>{
        if(e.target.name==="twt"){
          setTwt(e.target.value);
        }
        if(e.target.name==="name"){
          setName(e.target.value);
        }
        if(e.target.name==="website"){
          setWebsite(e.target.value);
          document.querySelector('.utubecheck')!.innerHTML = "";
        }
        if(e.target.name==="contract"){
          setContract(e.target.value);
        }
        if(e.target.name==="discord"){
            setDiscord(e.target.value);
        }
        if(e.target.name==="description"){
          if(desc.length>500){
            document.querySelector('.desccheck')!.innerHTML = "Description should be less than 500 characters.";
            setDesc(e.target.value.substring(0,500));
            return;
          }
          else{
            document.querySelector('.desccheck')!.innerHTML = "";
            setDesc(e.target.value);
          }
          setDesc(e.target.value);
        }
        if(e.target.name==='walletAddress'){
          setWalletID(e.target.value);
        }
        if(e.target.name==='avatar'){
          if(!e.target.files[0].name.match(/\.(jpg|jpeg|png)$/i)){
            document.querySelector('.avatarcheck')!.innerHTML = "Image should be jpg, jpeg or png";
            e.target.value = null;
            return false;
          }
          else if(e.target.files[0].size>300000){
            document.querySelector('.avatarcheck')!.innerHTML = "Image should be less than 300KB.";
            e.target.value = null;
            return false;
          }
          else{
            document.querySelector('.avatarcheck')!.innerHTML = "";
            setFile(e.target.files[0]);
          }
          // console.log(e.target.files[0]);
          return;
        }
     
        if(e.target.name==='terms'){
          setDisable(!disable);
          return;
        }
        setFormData({...formData, [e.target.name] : e.target.value});

    }

    const handleSignup = async (event: any) =>{
        event.preventDefault();
        setLoading(true); 
        setDisable(true);
        await RegisterUser();
        setDisable(false);
        setLoading(false);
    }

    if(success)
    {
      return(
        <>
          <Flex
            w="100vw"
            h="100%"
            px={10}
            pt={6}
            overflowY="scroll"
            justify="start"
            flexDir="row"
          >
          <Container>
          <div className="one mt-4 mb-3">
              <h1>Add Collection</h1>
          </div>
          <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center', color: 'cyan', fontSize: '30px', marginTop: '15%'}}>
            You request has been submitted successfully. 
          </div>
          <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center', color: 'cyan', fontSize: '30px', marginTop: '15%'}}>
            <Button mt={2} onClick={()=>{setLocation(`/explore`)}}> Explore </Button>
          </div>
          </Container>
          </Flex>
        </>
      );
    }
    else
    { 
          return (
            <>
                <Flex
              w="100vw"
              h="100%"
              px={10}
              pt={6}
              overflowY="scroll"
              justify="start"
              flexDir="row"
            >
          <Container >
          <Box p={6} maxWidth="100%" borderWidth={3} borderRadius={10} boxShadow="lg">
                <div className="one mt-4 mb-3">
                  <h1>Add Collection</h1>
                </div>
                <div className="registrationError" style={{display: 'flex',alignItems: 'center',justifyContent: 'center', color: 'red'}}></div>
                <div className="successMessage" style={{display: 'flex',alignItems: 'center',justifyContent: 'center', color: 'green'}}></div>
                <br />
                <Form id="myform" onSubmit={handleSignup} onChange={handleChange}>
                  
                  {/* NAME */}
                  <div className="row align-items-center justify-content-center">
                  <FormGroup className="col-md-8 col-12" >
                      <Input value={name} isInvalid errorBorderColor="cyan.300" 
                        variant="filled" 
                        name="name" id="name" 
                        placeholder="Contract Name" 
                        isRequired 
                        style={{margin: 'auto'}} 
                      />
                  </FormGroup>
                  </div>

      
                  {/* address */}
                  <div className="row align-items-center justify-content-center">
                  <FormGroup className="col-md-8 col-12">
                      <Input value={contract} isInvalid type="text" errorBorderColor="cyan.300" name="contract" id="instagram" variant="filled" placeholder="Contract Address * ( KT1.. )" style={{margin: 'auto'}} />
                      <div className="igcheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
                  </FormGroup>
                  </div>
      
                    {/* DESCRIPTION */}
                  <div className="row align-items-center justify-content-center">
                  <FormGroup className="col-md-8 col-12">
                      <Textarea value={desc} 
                        errorBorderColor="cyan.300" 
                        name="description" id="desc" 
                        isInvalid isRequired
                        placeholder="Description [ Max Length : 500 ]" 
                        style={{margin: 'auto'}} 
                        variant="filled"
                      />
                      <div className="desccheck col-md-7 col-12" style={{margin: 'auto 0 0 auto', color: 'red'}}>
                      </div>
                  </FormGroup>
                  </div>
      
                   {/* Social Links */}
                  <div className="row">
                  <div className="col-lg-2 col-0"></div>
                  <FormGroup className="col-lg-4 col-md-6 col-12">
                      <Input value={twt} isInvalid type="text" errorBorderColor="cyan.300" name="twt" id="twitter" variant="filled" placeholder="Twitter Handle" style={{margin: 'auto'}} />
                      <div className="twtcheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
                  </FormGroup>
                  <FormGroup className="col-lg-4 col-md-6 col-12">
                    <Input value={walletID} 
                        isInvalid type="text" 
                        errorBorderColor="cyan.300" 
                        variant="filled"
                        name="walletAddress" id="walletAddress" 
                        placeholder="Contract Owner address * ( eg., tz1...... )" 
                        isRequired 
                        style={{margin: 'auto'}} 
                    />
                    <div className="walletcheck col-md-7 col-12" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
                 </FormGroup>
                 <div className="col-lg-2 col-0"></div>
                  </div>
                  <div className="row">
                  <div className="col-lg-2 col-0"></div>
                  <FormGroup className="col-lg-4 col-md-6 col-12">
                      <Input value={website} isInvalid type="url" errorBorderColor="cyan.300" name="website" id="website" variant="filled" placeholder="Website" style={{margin: 'auto'}} />
                      <div className="utubecheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
                  </FormGroup>
                  <FormGroup className="col-lg-4 col-md-6 col-12">
                      <Input value={discord} isInvalid type="url" errorBorderColor="cyan.300" name="discord" id="discord" variant="filled" placeholder="Discord" style={{margin: 'auto'}} />
                      <div className="utubecheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
                  </FormGroup>
                  <div className="col-lg-2 col-0"></div>
                  </div>
      
      
                  {/* AVATAR AND COUNTRY */}
                  <div className="row align-items-center justify-content-center">
                  <FormGroup className="col-md-4 col-12" >
                    <InputGroup style={{margin: 'auto', border: 'cyan'}} >
                      <InputLeftAddon children="Logo" />
                      <Input 
                        style={{margin: 'auto',paddingTop: '3px'}} 
                        accept="image/*" 
                        type="file" 
                        isRequired
                        name="avatar" 
                        id="name" 
                      />
                    </InputGroup>
                    <div className="avatarcheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
                  </FormGroup>
                  
                  </div>
                
                  {/* SUBMIT BUTTON */}
                  <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
                  {/* {
                    system.status === 'WalletConnected' ? */}
                          <Button disabled={disable} isLoading={loading} loadingText="Submitting" variant="solid" colorScheme="teal" size="lg" type="submit" className="c-button-up">
                            Submit Request
                          </Button>
                  </div>
                  {/* //     :
                  //     <MinterButton
                  //     variant="secondaryAction"
                  //     onClick={e => {
                  //       e.preventDefault();
                  //       dispatch(connectWallet());
                  //     }}
            
                  //     _hover={{
                  //       textDecoration: 'none',
                  //       background: '#2D3748',
                  //       color: '#EDF2F7'
                  //     }}
                  //   >
                  //     Connect creator wallet <Icon ml={2} as={FaWallet} style={{ color: "#00FFBE" }}></Icon>
                  //   </MinterButton>
                  // }
                  // </div> */}
                  {/* <br />
                  {
                    system.status === 'WalletConnected' ?
                      <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center', fontWeight: 'bold'}}>
                          Not connected as contract creator ?&nbsp;
                        <MinterButton
                          alignSelf="flex-start"
                          variant="cancelAction"
                          onClick={async () => {
                            await dispatch(disconnectWallet());
                          }}
                        >
                          Disconnect
                        </MinterButton>
                      </div>
                      :
                      null
                  } */}
                </Form>
                </Box>
              </Container>
              </Flex>
            </>
        );
    }
}

export default RegistrationPage;