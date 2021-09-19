import React, {useState} from 'react';
import {Button, Form, FormGroup, Container} from 'react-bootstrap';
import { CountryDropdown } from 'react-country-region-selector';
import firebase from '../../lib/firebase/firebase'
import './styles/style.css';
import {Flex} from '@chakra-ui/react';
import uploadImage from './uploadImage';
import PasswordStrengthBar from 'react-password-strength-bar';

function Example(props: any) {
    const [formData, setFormData] = useState({});
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

    const selectCountry = (val: any) => {
      setCountry(val);
    }

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

      const db = firebase.firestore();
      var url="";
      const docRef = db.collection('artists').doc(walletID);
      await docRef.get().then(async (doc)=>{
        if(doc.exists){
          document.querySelector('.registrationError')!.innerHTML = "Wallet ID already exists .";
        }
        else{
          url = await uploadImage(file);
          var ahead = true;
          await firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            user?.updateProfile({
              displayName: name,
              photoURL: walletID
            }).then(() => {
              // User profile updated
            }).catch((error) => {
              console.error(error);
            });
            // ...
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
            // ..
          });

          if(!ahead || url===undefined) return;
          var data = {...formData,"avatar":url}

          await setFormData(data);
          console.log("FINAL",data);
          await docRef.set(data).then(() => {
            setSuccess(true);
            console.log("Document successfully written!");
          })
          .catch((error)=>{
              document.querySelector('.registrationError')!.innerHTML = "An Error occured";
              console.log("ERROR OCCURED !!");
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
        }
        if(e.target.name==="lt"){
          setlinkTree(e.target.value);
        }
        if(e.target.name==="name"){
          setName(e.target.value);
        }
        if(e.target.name==="yt"){
          setUtube(e.target.value);
        }
        if(e.target.name==="ig"){
          setInstagram(e.target.value);
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
        if(e.target.name==="twitter"){
          setTwt(e.target.value);
        }
        if(e.target.name==='walletAddress'){
          if(walletID.length > 3 && (walletID[0]!=='t' || walletID[1]!=='z' || walletID[2]<'0' || walletID[2]>'9')){
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
        console.log(formData);
    }

    const handleSignup = async (event: any) =>{
        event.preventDefault();
        // console.log("SIGNUP", password, cpassword);
        if(event.target.password.value.length <= 8){
            document.querySelector('.passcheck')!.innerHTML = "Length of password must be greater than 8";
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
        else if(!linktr.match(/^https:\/\/linktr.ee\// ) && linktr!==""){
          document.querySelector('.ltcheck')!.innerHTML = "Please enter valid Linktr Handle";
        }
        else if(event.target.password.value === event.target.cpassword.value && isValid(walletID)){
            if(linktr===""){
              setFormData({...formData, "lt" : ''});
            }
            if(utube===""){
              setFormData({...formData, "yt" : ''});
            }
            if(instagram===""){
              setFormData({...formData, "ig" : ''});
            }
            setDisable(true); 
            await RegisterUser();
            setDisable(false);
        }
        else{
              document.querySelector('.passcheck2')!.innerHTML = "Both passwords dont match . Try again !";
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
        <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center', color: 'green', fontSize: '30px', marginTop: '15%'}}>
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
    <Container>
          <div className="one mt-4 mb-3">
            <h1>Artist Registration</h1>
          </div>
          <div className="registrationError" style={{display: 'flex',alignItems: 'center',justifyContent: 'center', color: 'red'}}></div>
          <div className="successMessage" style={{display: 'flex',alignItems: 'center',justifyContent: 'center', color: 'green'}}></div>
          <br />
          <Form id="myform" onSubmit={handleSignup} onChange={handleChange}>
            <FormGroup className="row">
                <Form.Label className="col-md-5 col-12" >Name *</Form.Label>
                <Form.Control value={name} className="col-md-5 col-12" type="text" name="name" id="name" placeholder="Name" required={true}/>
            </FormGroup>
            <FormGroup className="row">
                <Form.Label className="col-md-5 col-12" >Email-id *</Form.Label>
                <Form.Control value={email} className="col-md-5 col-12" type="email" name="email" id="email" placeholder="Email" required={true}/>
            </FormGroup>
            <FormGroup className="row">
                <Form.Label className="col-md-5 col-12" >Description *</Form.Label>
                <Form.Control value={desc} className="col-md-5 col-12" as="textarea" rows={3} name="description" id="desc" placeholder="Description" required={true}/>
                <div className="desccheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            <FormGroup className="row">
                <Form.Label className="col-md-5 col-12" >Profile Picture *</Form.Label>
                <Form.Control className="col-md-5 col-12" accept="image/*" type="file" name="avatar" id="name" required={true}/>
                <div className="avatarcheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            <FormGroup className="row">
                <Form.Label className="col-md-5 col-12" >Country *</Form.Label>
                <div className="col-md-7 col-12" style={{color: 'black'}}>
                  <CountryDropdown name="country" value={country} onChange={selectCountry} />
                </div>
            </FormGroup>
            <FormGroup className="row">
                <Form.Label className="col-md-5 col-12" >Password *</Form.Label>
                <Form.Control value={password} className="col-md-5 col-12" type="password" name="password" id="password" placeholder="password" required={true}/>
                <div className="col-md-5 col-12" style={{margin: 'auto 16% auto auto', color: 'red', fontSize: '10px'}}>
                  <div className="passcheck">We recommend to use a strong password</div>
                  <PasswordStrengthBar password={password} />
                </div>
            </FormGroup>
            <FormGroup className="row">
                <Form.Label className="col-md-5 col-12" >Confirm Password *</Form.Label>
                <Form.Control value={cpassword} className="col-md-5 col-12" type="password" name="cpassword" id="cpassword" placeholder="Confirm password" required={true}/>
                <div className="passcheck2" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            <FormGroup className="row">
                <Form.Label className="col-md-5 col-12" >Tezos Wallet Address *</Form.Label>
                <Form.Control onPaste={()=>setWalletID(walletID)} value={walletID} className="col-md-5 col-12" type="text" name="walletAddress" id="walletAddress" placeholder="Wallet Address" required={true}/>
                <div className="walletcheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            <FormGroup className="row">
                <Form.Label className="col-md-5 col-12" >Twitter Handle *</Form.Label>
                <Form.Control value={twt} className="col-md-5 col-12" type="url" name="twt" id="twitter" placeholder="https://twitter.com/name" required={true}/>
                <div className="twtcheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            <FormGroup className="row">
                <Form.Label className="col-md-5 col-12" >Instagram Link</Form.Label>
                <Form.Control value={instagram} className="col-md-5 col-12" type="url" name="ig" id="instagram" placeholder="https://www.instagram.com/name"/>
                <div className="igcheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            <FormGroup className="row">
                <Form.Label className="col-md-5 col-12" >Youtube Channel</Form.Label>
                <Form.Control value={utube} className="col-md-5 col-12" type="url" name="yt" id="youtube" placeholder="https://www.youtube.com/channel/name" />
                <div className="utubecheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            <FormGroup className="row">
                <Form.Label className="col-md-5 col-12" >Linktree</Form.Label>
                <Form.Control value={linktr} className="col-md-5 col-12" type="url" name="lt" id="linktree" placeholder="https://linktr.ee/name" />
                <div className="ltcheck" style={{margin: 'auto 0 auto auto', color: 'red'}}></div>
            </FormGroup>
            <br />
            <FormGroup className="row" style={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
                <Form.Control className="col-md-1 col-1" type="checkbox" name="terms" id="terms" />
                <Form.Label className="col-md-5 col-12" htmlFor="terms">I agree to the Terms of Service of ByteBlock</Form.Label>
            </FormGroup>
            
            <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
              <Button disabled={disable} color="primary" type="submit" className="c-button-up">
                Register
              </Button>
            </div>
          </Form>
        </Container>
        </Flex>
      </>
    );
}
export default Example;