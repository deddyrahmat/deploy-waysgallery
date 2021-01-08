// memanggil component landing sesuai kondisi auth user 
// buat conts untuk menentukan status login user

import React, { Fragment,useState,useContext } from 'react'
import {AppContext} from "../../context/appContext";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  Container
} from 'reactstrap';

// component
import Logo from "../../assets/img/logo/Logo.png";
import LandingUser from './LandingUser';

// Style css

import "./Navigation.scss";
import { Link } from 'react-router-dom';



const Navigation = (props) => {

  // handle context global
  const [state] = useContext(AppContext);

  // const [auth, setAuth] = useState("guest");

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const imgLogo = <NavbarBrand> <img src={Logo} width="80%" alt="logo"></img> </NavbarBrand> ;

  return (
    <Fragment>            
      <Navbar light expand="md" className="Navigation">
        <Container>
          
          {state.isLogin ? (
            <Link to="/home">
              {imgLogo}
            </Link>
          ) : (
            <Link to="/">
              {imgLogo}
            </Link>
          ) }
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <LandingUser />
          </Nav>
        </Collapse>
        </Container>
      </Navbar>

      <hr className="mt-n1"></hr>
    </Fragment>
  );
}


export default  Navigation;

