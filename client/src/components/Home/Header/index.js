// menjadi component header(menampilkan image di jumbotron)
import React, { Fragment } from 'react'
import { Button, Col, Container, Row } from 'reactstrap';

import Auth from "../Auth";

// import header image
import kiriAtas from "../../../assets/img/layout/kiriAtas.svg";
import kiriBawah from "../../../assets/img/layout/kiriBawah.svg";
import kananBawah from "../../../assets/img/layout/kananBawah.svg";
import ImageHeader from "../../../assets/img/Header.svg";
import Waysgallery from "../../../assets/img/icons/waysgallery.svg";
import Catur from "../../../assets/img/icons/catur.svg";

import "./Header.scss";

const Header = () => {
    return (
        <Fragment>
            <img src={kiriAtas} alt="Header" width="20%" className="layout-header-kiriAtas fixed-top"></img>
            <img src={kiriBawah} alt="Header" width="20%" className="layout-header-kiriBawah text-right fixed-bottom"></img>
            <img src={kananBawah} alt="Header" className="img-fluid layout-header-kananBawah text-right fixed-bottom float-right"></img>
            {/* <div >
            </div> */}

            <Container className="container-landing">
                <Row className="d-flex justify-content-center align-items-center">
                    <Col md="6" >
                        <img src={Catur} alt="Header" className="icon-title-header" width="30%"></img>                    
                        <img src={Waysgallery} alt="Header" className="title-header" width="50%"></img>                    
                        <h3>show your work to inspire everyone</h3>
                        <p>Ways Exhibition is a website design creators gather to share their work with other creators</p>
                        <Auth />
                    </Col>  
                    <Col md="6" >
                        <img src={ImageHeader} alt="Header" width="80%" className="float-right"></img>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}

export default Header;