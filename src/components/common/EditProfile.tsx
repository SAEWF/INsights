import React, {useState, useEffect} from 'react';
import {Form, FormGroup, Container} from 'react-bootstrap';

import firebase from '../../lib/firebase/firebase'
import './styles/style.css';
import { Flex, Input, Box, Textarea, InputGroup, InputLeftAddon, Button} from '@chakra-ui/react';
import { useSelector } from '../../reducer';
import uploadImage from './uploadImage';
import { useLocation } from 'wouter';


function RegistrationPage(props: any) {
    const { system } = useSelector(s => s);
    const [ , setLocation] = useLocation();
    const [username, setUsername] = useState('');
    const [formData, setFormData] = useState({"ig":"","lt":"","yt":"","display":false});
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [twt, setTwt] = useState('');
    const [walletID, setWalletID] = useState('');
    const [email, setEmail] = useState('');
    const [disable, setDisable] = useState(false);
    const [file, setFile] = useState(null);
    const [utube, setUtube] = useState('');
    const [instagram, setInstagram] = useState('');
    const [linktr, setlinkTree] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState<TasksType[]>([]);



    // const handlePassState = () => setShow(!show);
    useEffect(() => {
      const db = firebase.firestore();
      var docRef = db.collection('artists');
      let temp: any[] = [];

      docRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          let data = doc.data();
          let walletAddress = data.walletAddress;
          if(walletAddress===undefined) return;
          // console.log(data);
          //username = username.replaceAll(" ","");
          if(walletAddress===system.tzPublicKey && doc.data().display!==undefined && doc.data().display){
            temp.push({id: doc.id, ...data});
          }
        });

        if(temp.length===0) return;
        setTasks(temp);
        console.log("temp = ",temp);
        setFormData({...formData, ig: temp[0].ig, lt: temp[0].lt, yt: temp[0].yt, display: temp[0].display});
        setName(temp[0].name);
        setDesc(temp[0].description);
        setTwt(temp[0].twt);
        setWalletID(temp[0].walletAddress);
        setEmail(temp[0].email);
        setUtube(temp[0].yt);
        setInstagram(temp[0].ig);
        setlinkTree(temp[0].lt);
      }, (error) => {
        console.log("Error getting documents: ", error);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [system])

    const RegisterUser = async () => {
      document.querySelector('.registrationError')!.innerHTML = "";
      document.querySelector('.successMessage')!.innerHTML = "";
      document.querySelector('.twtcheck')!.innerHTML = "";
      document.querySelector('.utubecheck')!.innerHTML = "";
      document.querySelector('.igcheck')!.innerHTML = "";
      document.querySelector('.ltcheck')!.innerHTML = "";

      const db = firebase.firestore();
      var url="";
      const docRef = db.collection('artists').doc(walletID);
      await docRef.get().then(async (doc)=>{
        console.log("doc exists = ",doc.exists);
        if(doc.exists){
          let data:any = doc.data();
          console.log("doc.data() = ",data.display);
          if(data.display !== undefined){
            if(file){
              url = await uploadImage(file);
            }
              
            if( (url===undefined || url==="") && file){
              document.querySelector('.registrationError')!.innerHTML = "Error in uploading image . Please try again .";
              return;
            }

            let data1:any = {...tasks[0], ...formData}
            if(url!==undefined && url!==""){
              docRef.update({ ...tasks[0], ...data1, "avatar": url});
            }
            else{
              // console.log(tasks[0]);
              // console.log(data1);
              docRef.update({ ...tasks[0], ...data1});
            }

            setSuccess(true);
            setUsername(data1.name.replaceAll(" ",""));
          }

        }
     
      });
    }
        


    const handleChange = (e: any) =>{
       
        if(e.target.name==="twt"){
          setTwt(e.target.value);

        }

        if(e.target.name==="lt"){
          setlinkTree(e.target.value);
          if(!e.target.value.match(/^https:\/\/linktr\.ee\//)){
            document.querySelector('.ltcheck')!.innerHTML = "Please enter valid LinkTree Handle";
          }
          else{
            document.querySelector('.ltcheck')!.innerHTML = "";
          }
        }
        if(e.target.name==="name"){
          setName(e.target.value);
        }
        if(e.target.name==="yt"){
          setUtube(e.target.value);
          if(!e.target.value.match(/^https:\/\/www\.youtube\.com\/channel\//)){
            document.querySelector('.utubecheck')!.innerHTML = "Please enter valid Youtube Channel";
          }
          else{
            document.querySelector('.utubecheck')!.innerHTML = "";
          }
        }
        if(e.target.name==="ig"){
          setInstagram(e.target.value);
          if(!e.target.value.match(/^https:\/\/www\.instagram\.com\//)){
            document.querySelector('.igcheck')!.innerHTML = "Please enter valid Instagram Handle";
          }
          else{
            document.querySelector('.igcheck')!.innerHTML = "";
          }
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
          if(e.target.value.length >= 3 && (e.target.value[0]!=='t' || e.target.value[1]!=='z' || e.target.value[2]<'0' || e.target.value[2]>'9')){
            document.querySelector('.walletcheck')!.innerHTML = "Please enter valid Wallet Address !"
          }
          else{
            document.querySelector('.walletcheck')!.innerHTML = ""
          }
          setWalletID(e.target.value);
        }
        if(e.target.name==='email'){
          setEmail(e.target.value);
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
        
        if(!utube.match(/^https:\/\/www.youtube.com\/channel\// ) && utube!==""){
          document.querySelector('.utubecheck')!.innerHTML = "Please enter valid Youtube Channel";
        }
        else if(!instagram.match(/^https:\/\/www.instagram.com\// ) && instagram!==""){
          document.querySelector('.igcheck')!.innerHTML = "Please enter valid Instagram Handle";
        }
        else if(!linktr.match(/^https:\/\/linktr\.ee\// ) && linktr!==""){
          document.querySelector('.ltcheck')!.innerHTML = "Please enter valid Linktr Handle";
        }
        
        else{
          setLoading(true); 
          setDisable(true);
          await RegisterUser();
          setDisable(false);
          setLoading(false);
        }
    }

    if(success)
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
            <h1>Edit Profile</h1>
        </div>
        <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center', color: 'cyan', fontSize: '30px', marginTop: '15%'}}>
          You profile has been updated successfully. 
        </div>
        <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center', color: 'cyan', fontSize: '30px', marginTop: '15%'}}>
          <Button mt={2} onClick={()=>{setLocation(`/artistprofile/${username}`)}}> My profile </Button>
        </div>
        </Container>
        </Flex>
      </>
    );
    else
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
            <h1>Edit Profile</h1>
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
                  placeholder="Full Name *" 
                  isRequired 
                  style={{margin: 'auto'}} 
                />
            </FormGroup>
            </div>

            {/* EMAIL */}
            <div className="row align-items-center justify-content-center">
            <FormGroup className="col-md-8 col-12">
                <Input value={email} isInvalid type="email" errorBorderColor="cyan.300" 
                  name="email" id="email"  
                  variant="filled" 
                  placeholder="Email " 
                  // isRequired 
                  style={{margin: 'auto'}} 
                />
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
                <Input value={twt} isInvalid type="text" errorBorderColor="cyan.300" name="twt" id="twitter" variant="filled" placeholder="Twitter Handle *" isRequired style={{margin: 'auto'}} />
                <div className="twtcheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            <FormGroup className="col-lg-4 col-md-6 col-12">
                <Input value={instagram} isInvalid type="url" errorBorderColor="cyan.300" name="ig" id="instagram" variant="filled" placeholder="Instagram Link" style={{margin: 'auto'}} />
                <div className="igcheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            </div>
            <div className="row">
            <div className="col-lg-2 col-0"></div>
            <FormGroup className="col-lg-4 col-md-6 col-12">
                <Input value={utube} isInvalid type="url" errorBorderColor="cyan.300" name="yt" id="youtube" variant="filled" placeholder="Youtube Channel" style={{margin: 'auto'}} />
                <div className="utubecheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            <FormGroup className="col-lg-4 col-md-6 col-12">
                <Input value={linktr} isInvalid type="url" errorBorderColor="cyan.300" name="lt" id="linktree"  variant="filled" placeholder="Linktree" style={{margin: 'auto'}} />
                <div className="ltcheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            </div>


            {/* AVATAR AND COUNTRY */}
            <div className="row align-items-center justify-content-center">
            <FormGroup className="col-md-4 col-12" >
              <InputGroup style={{margin: 'auto', border: 'cyan'}} >
                <InputLeftAddon children="Profile Picture" />
                <Input 
                  style={{margin: 'auto',paddingTop: '3px'}} 
                  accept="image/*" 
                  type="file" 
                  name="avatar" id="name" 
                  // isRequired
                />
              </InputGroup>
              <div className="avatarcheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            
            </div>
          
            {/* SUBMIT BUTTON */}
            <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
              <Button disabled={disable} isLoading={loading} loadingText="Submitting" variant="solid" colorScheme="teal" size="lg" type="submit" className="c-button-up">
                Update Profile
              </Button>
            </div>
          </Form>
          </Box>
        </Container>
        </Flex>
      </>
    );
}

interface TasksType {
  [index: string]: string
};
export default RegistrationPage;