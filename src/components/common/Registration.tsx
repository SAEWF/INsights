import React, {useState} from 'react';
import {Form, FormGroup, Container} from 'react-bootstrap';
import { CountryDropdown } from 'react-country-region-selector';
import firebase from '../../lib/firebase/firebase'
import './styles/style.css';
import {Checkbox, Flex, Input, Box, Textarea, InputGroup, InputLeftAddon, InputRightElement, Button, Link} from '@chakra-ui/react';
import uploadImage from './uploadImage';

function RegistrationPage(props: any) {
    const [formData, setFormData] = useState({"ig":"","lt":"","yt":"","display":false});
    const [country, setCountry] = useState('');
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [twt, setTwt] = useState('');
    const [walletID, setWalletID] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [disable, setDisable] = useState(true);
    const [file, setFile] = useState(null);
    const [utube, setUtube] = useState('');
    const [instagram, setInstagram] = useState('');
    const [linktr, setlinkTree] = useState('');
    const [success, setSuccess] = useState(false);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const selectCountry = (val: any) => {
      setCountry(val);
    };

    const handlePassState = () => setShow(!show);

    const RegisterUser = async () => {
      document.querySelector('.registrationError')!.innerHTML = "";
      document.querySelector('.successMessage')!.innerHTML = "";
      document.querySelector('.passcheck')!.innerHTML = "";
      document.querySelector('.passcheck2')!.innerHTML = "";
      document.querySelector('.twtcheck')!.innerHTML = "";
      document.querySelector('.walletcheck')!.innerHTML = "";
      document.querySelector('.utubecheck')!.innerHTML = "";
      document.querySelector('.igcheck')!.innerHTML = "";
      document.querySelector('.ltcheck')!.innerHTML = "";
      document.querySelector('.countryCheck')!.innerHTML = "";

      const db = firebase.firestore();
      var url="";
      const docRef = db.collection('artists').doc(walletID);
      await docRef.get().then(async (doc)=>{
        if(doc.exists){
          document.querySelector('.registrationError')!.innerHTML = "Wallet ID already exists .";
        }
        else{
          url = await uploadImage(file);

          if(url===undefined || url===""){
            document.querySelector('.registrationError')!.innerHTML = "Server Error Occured ";
            return;
          }
          var ahead = true;
          await firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            user?.updateProfile({
              displayName: name,
              //photoUrl linked as wallet ID to retrieve rest of details
              photoURL: walletID
            }).then(() => {
              // User profile updated
            }).catch((error) => {
              console.error(error);
            });
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error(errorMessage);
            if (errorCode === 'auth/email-already-in-use') {
              ahead = false;
              document.querySelector('.registrationError')!.innerHTML = "Email already in use.";
              return;
            }
          });

          if(!ahead || url===undefined || url===""){
            document.querySelector('.registrationError')!.innerHTML = "Server Error Occured ";
            return;
          }
          var data = {...formData,"avatar":url}

          await setFormData(data);
          // console.log("FINAL",data);
          await docRef.set(data).then(() => {
            setSuccess(true);
            // console.log("Document successfully written!");
          })
          .catch((error)=>{
              document.querySelector('.registrationError')!.innerHTML = "An Error occured";
              // console.log("ERROR OCCURED !!");
          })
        }
      });
    }
        

    const isValid = (walletID: string) =>{
      if( walletID[0]!=='t' || walletID[1]!=='z' || walletID[2]<'0' || walletID[2]>'9' )
      return false;
      else return true;
    }

    const handleChange = (e: any) =>{
        if(e.target.name==="twt"){
          setTwt(e.target.value);
          if(!e.target.value.match(/^https:\/\/twitter.com\//)){
            document.querySelector('.twtcheck')!.innerHTML = "Please enter valid Twitter Handle";
          }
          else{
            document.querySelector('.twtcheck')!.innerHTML = "";
          }
        }
        else if(e.target.name==="country"){
          setCountry(e.target.value);
          if(e.target.value===""){
            document.querySelector('.countryCheck')!.innerHTML = "Please select a country";
          }
          else{
            document.querySelector('.countryCheck')!.innerHTML = "";
          }
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
          if(desc.length>200){
            document.querySelector('.desccheck')!.innerHTML = "Description should be less than 200 characters.";
            setDesc(e.target.value.substring(0,200));
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
        if(e.target.name==='password'){
          setPassword(e.target.value);

          // password validations
          if(e.target.value.length<6){
            document.querySelector('.passcheck')!.innerHTML = "Password should be atleast 6 characters long.";
          }
          else if(!e.target.value.match(/[a-z]/i)){
            document.querySelector('.passcheck')!.innerHTML = "Password should contain atleast one lowercase letter.";
          }
          else if(!e.target.value.match(/[A-Z]/i)){
            document.querySelector('.passcheck')!.innerHTML = "Password should contain atleast one uppercase letter.";
          }
          else if(!e.target.value.match(/[0-9]/i)){
            document.querySelector('.passcheck')!.innerHTML = "Password should contain atleast one number.";
          }
          else if(!e.target.value.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/i)){
            document.querySelector('.passcheck')!.innerHTML = "Password should contain atleast one special character.";
          }
          else{
            document.querySelector('.passcheck')!.innerHTML = "";
          }

          if(e.target.value===cpassword){
            document.querySelector('.passcheck2')!.innerHTML = "";
          }

          return;
        }
        if(e.target.name==='terms'){
          setDisable(!disable);
          return;
        }
        if(e.target.name==='cpassword'){
          setCpassword(e.target.value);
          if(e.target.value!==password){
            document.querySelector('.passcheck2')!.innerHTML = "Passwords do not match.";
            return;
          }
          else{
            document.querySelector('.passcheck2')!.innerHTML = "";
            return;
          }
        }

        setFormData({...formData, [e.target.name] : e.target.value});
        // console.log(formData);
    }

    const handleSignup = async (event: any) =>{
        event.preventDefault();
        // console.log("SIGNUP", password, cpassword);
        if(event.target.password.value.length <= 6){
          document.querySelector('.passcheck')!.innerHTML = "Password should be atleast 6 characters long.";
        }
        else if(!event.target.password.value.match(/[a-z]/i)){
          document.querySelector('.passcheck')!.innerHTML = "Password should contain atleast one lowercase letter.";
        }
        else if(!event.target.password.value.match(/[A-Z]/i)){
          document.querySelector('.passcheck')!.innerHTML = "Password should contain atleast one uppercase letter.";
        }
        else if(!event.target.password.value.match(/[0-9]/i)){
          document.querySelector('.passcheck')!.innerHTML = "Password should contain atleast one number.";
        }
        else if(!event.target.password.value.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/i)){
          document.querySelector('.passcheck')!.innerHTML = "Password should contain atleast one special character.";
        }
        else if(country===""){
            document.querySelector('.countryCheck')!.innerHTML = "Please Select Country";
        }
        else if(!twt.match(/^https:\/\/twitter.com\//)){
            document.querySelector('.twtcheck')!.innerHTML = "Please enter valid Twitter Handle";
        }
        else if(!utube.match(/^https:\/\/www.youtube.com\/channel\// ) && utube!==""){
          document.querySelector('.utubecheck')!.innerHTML = "Please enter valid Youtube Channel";
        }
        else if(!instagram.match(/^https:\/\/www.instagram.com\// ) && instagram!==""){
          document.querySelector('.igcheck')!.innerHTML = "Please enter valid Instagram Handle";
        }
        else if(!linktr.match(/^https:\/\/linktr\.ee\// ) && linktr!==""){
          document.querySelector('.ltcheck')!.innerHTML = "Please enter valid Linktr Handle";
        }
        else if(!isValid(walletID)){
            document.querySelector('.walletcheck')!.innerHTML = "Please enter valid Wallet Address";
        }
        else if(event.target.password.value !== event.target.cpassword.value){
          document.querySelector('.passcheck2')!.innerHTML = "Both passwords dont match . Try again !";
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
            <h1>Artist Registration</h1>
        </div>
        <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center', color: 'cyan', fontSize: '30px', marginTop: '15%'}}>
          You have been registered . We will get back to you soon .
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
            <h1>Artist Registration</h1>
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
                  placeholder="Email *" 
                  isRequired 
                  style={{margin: 'auto'}} 
                />
            </FormGroup>
            </div>

            {/* PASSWORD FORM */}
            <div className="row align-items-center justify-content-center">
            <FormGroup className="col-lg-4 col-md-8 col-12" >
                <InputGroup size="md" >
                <Input
                  
                  name="password" id="password"
                  value={password}
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  isInvalid
                  isRequired
                  errorBorderColor="cyan.300"
                  variant="filled"
                />
                <InputRightElement>
                  <Button size="sm" onClick={handlePassState}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <div className="passcheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            <FormGroup className="col-lg-4 col-md-8 col-12">
                <Input value={cpassword} 
                  isInvalid 
                  type="password" 
                  errorBorderColor="cyan.300" 
                  name="cpassword" id="cpassword" 
                  variant="filled" 
                  placeholder="Confirm Password" 
                  isRequired
                />
                <div className="passcheck2" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            </div>

            {/* WALLET ID */}
            <div className="row align-items-center justify-content-center">
            <FormGroup className="col-md-8 col-12">
                <Input value={walletID} 
                  isInvalid type="text" 
                  errorBorderColor="cyan.300" 
                  variant="filled" 
                  name="walletAddress" id="walletAddress" 
                  placeholder="Tezos Wallet Address * ( eg., tz1...... )" 
                  isRequired style={{margin: 'auto'}} 
                />
                <div className="walletcheck col-md-7 col-12" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            </div>

              {/* DESCRIPTION */}
            <div className="row align-items-center justify-content-center">
            <FormGroup className="col-md-8 col-12">
                <Textarea value={desc} 
                  errorBorderColor="cyan.300" 
                  name="description" id="desc" 
                  isInvalid isRequired
                  placeholder="Description [ Max Length : 200 ]" 
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
                <Input value={twt} isInvalid type="url" errorBorderColor="cyan.300" name="twt" id="twitter" variant="filled" placeholder="Twitter Handle *" isRequired style={{margin: 'auto'}} />
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
                  isRequired
                />
              </InputGroup>
              <div className="avatarcheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            <FormGroup className="col-md-4 col-12" >
                <div className="countries" style={{color: 'black', margin: 'auto', height: '35px'}}>
                  <CountryDropdown name="country" value={country} onChange={selectCountry} />
                </div>
                <div className="countryCheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            </div>
          
            {/* SUBMIT BUTTON */}
            <FormGroup className="row" style={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
                <Checkbox colorScheme="green" name="terms" >
                I agree to the <Link to="/legal/tnc"> Terms of Service of ByteBlock </Link>
                </Checkbox>
            </FormGroup>
            
            <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
              <Button disabled={disable} isLoading={loading} loadingText="Submitting" variant="solid" colorScheme="teal" size="lg" type="submit" className="c-button-up">
                Register
              </Button>
            </div>
          </Form>
          </Box>
        </Container>
        </Flex>
      </>
    );
}
export default RegistrationPage;