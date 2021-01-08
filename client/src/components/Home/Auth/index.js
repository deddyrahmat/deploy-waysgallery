// menampilkan navigasi modal login dan register

import React, { Fragment,useState, useContext } from 'react'

import {AppContext} from "../../../context/appContext";

import { useHistory } from "react-router-dom";

import {API,setAuthToken} from "../../../config/API"

// component
import { Button, Container, Form, FormGroup, Input, Modal, ModalBody } from 'reactstrap';

// Style Css
import "./Auth.scss";

const Auth = () => {

  const [state,dispatch] = useContext(AppContext);

  const [modalLogin, setModalLogin] = useState(false);

  const toggleLogin = () => setModalLogin(!modalLogin);

  const [modalRegister, setModalRegister] = useState(false);

  const toggleRegister = () => setModalRegister(!modalRegister);

  // ============================================
  // Login
  // ============================================

  const [formDataLogin, setFormDataLogin] = useState({
    email : '',
    password : ''
  })

  const { email, password } = formDataLogin;

  const router = useHistory();

  const handleChangeLogin = (e) => {
    setFormDataLogin({ ...formDataLogin, [e.target.name]: e.target.value });
  }


  const funLogin = async (email, password) => {
    try {
      const body = JSON.stringify({ email, password });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      
      const response = await API.post("/login", body, config);
      
      // console.log(response.data.data);
      if (response.status == 200) {
        
        
        const result = response.data.data.chanel;
        dispatch({
          type:"LOGIN",
          payload : result
        })
        
        setAuthToken(result.token);
      }
      
      router.push("/home")
    } catch (err) {
      console.log("Your system error ",err);
      setModalFailed(true)
    }
  }
  

  const handleSubmitLogin = async (e) => {
      e.preventDefault();

      try {
        funLogin(email, password)

      } catch (err) {
        console.log("Your system error ",err);
      }
  }


  // ============================================
  // Registrasi
  // ============================================
  const [formDataRegister, setFormDataRegister] = useState({
    fullname : '',
    emailRegis : '',
    passwordRegis : ''
  })

  const { emailRegis, passwordRegis, fullname } = formDataRegister;

  const handleChangeRegis = (e) => {
    setFormDataRegister({ ...formDataRegister, [e.target.name]: e.target.value });
  }  


  const handleSubmitRegister = async (e) => {
      e.preventDefault();

      try {
        let fullname = formDataRegister.fullname;
        let email = formDataRegister.emailRegis;
        let password = formDataRegister.passwordRegis;
        const body = JSON.stringify({ fullname, email, password });
        console.log("body : "+body);

        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        
        const response = await API.post("/register", body, config);

        if (response.status == 200 ) {
          
          funLogin(email, password)
        }else{
          console.log(response.status)
        }

      } catch (err) {
        console.log(err);
      }
  }


  const [modalFailed, setModalFailed] = useState(false);

  const toggleFailed = () => setModalFailed(!modalFailed);


  const loginPage = () => {
    toggleLogin();
    toggleRegister();
  }

  const regisPage = () => {
    toggleLogin();
    toggleRegister();
  }
  

  return (
    <Fragment>
      {/* form modal register */}
      <Button className="btn_auth mr-4 joinNow border-0" onClick={toggleRegister}>Join Now</Button>
            <Modal isOpen={modalRegister} toggle={toggleRegister} className="size-modals" >
              <ModalBody>
                <Container>
                  <Form onSubmit={handleSubmitRegister}>
                    <h3 className="title-formAuth">Register</h3>
                    <FormGroup>
                      <Input type="email" name="emailRegis" id="emailRegis" placeholder="Email" className="main-form" onChange={(e) => {handleChangeRegis(e)}}  value={emailRegis} />
                    </FormGroup>
                    <FormGroup>
                      <Input type="password" name="passwordRegis" id="passwordRegis" placeholder="Password" className="main-form" onChange={(e) => {handleChangeRegis(e)}}  value={passwordRegis} />
                    </FormGroup>
                    <FormGroup>
                      <Input type="text" name="fullname" id="fullname" placeholder="Fullname" className="btn-formAuth" onChange={(e) => {handleChangeRegis(e)}}  value={fullname} />
                    </FormGroup>
                    
                    <Button block color="light" className="btn-clickAuth text-white" type="submit">Register</Button>
                  </Form>
                  <p className="text-center">Already have an account ? Klik <b onClick={loginPage}>Here</b> </p>
              </Container>
              
              </ModalBody>
            </Modal>
      {/* form modal register */}
      {/* form modal login */}
            <Button className="btn-auth login" onClick={toggleLogin}>Login</Button>
            <Modal isOpen={modalLogin} toggle={toggleLogin} className="size-modals">
              <ModalBody>
                <Container>
                <Form onSubmit={handleSubmitLogin}>
                  <h3 className="title-formAuth">Login</h3>
                  <FormGroup>
                    <Input type="email" name="email" id="email" placeholder="Email" onChange={(e) => {handleChangeLogin(e)}} className="main-form" value={email} />
                  </FormGroup>
                  <FormGroup>
                    <Input type="password" name="password" id="password" onChange={(e) => {handleChangeLogin(e)}} placeholder="Password" className="main-form" value={password} />
                  </FormGroup>
                  
                  <Button block color="light" className="btn-clickAuth border-0 text-white" type="submit" >Login</Button>
                </Form>
                <p className="text-center">Don't have an account ? Klik <b onClick={regisPage}>Here</b> </p>
              </Container>
              
              </ModalBody>
            </Modal>
      {/* form modal login */}


      <Modal style={{marginTop:"200px"}} isOpen={modalFailed} toggle={toggleFailed}>
        <ModalBody>
          <p style={{color:"#c70039", fontSize:"24px", fontWeight:"normal", margin:"auto", textAlign:"center"}}>Login Failed</p>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default Auth;