import React, { Fragment, useContext,useState, useEffect } from 'react'
import { Button,  Col, Container, Row } from 'reactstrap';

import {  Link } from 'react-router-dom';

// api
import {API} from "../../config/API";

import {AppContext} from "../../context/appContext";
import Navigation from '../../components/Navigations';
import Loading from "../../components/Loading";

// images
import avatarUser from "../../assets/img/avatar/avatarUser.png";

// Styel css
import "./Profile.scss";

const Profile = () => {

    const [state] = useContext(AppContext);

    const [profileItems, setProfile] = useState([]);

    const [loading, setLoading] = useState(true);

    // useEffect adalah lifecicle untuk stateless component
    useEffect(() => {
        // code untuk menampilkan data dari api
        const fetchsetProfile = async ( ) => {
        
            const response = await API("/detail-user");

            setProfile(response.data.data.user);
            setLoading(false);
        }

        fetchsetProfile();
    }, [])//saat menuliskan dependency [] kosong maka pemanggilan api hanya dilakukan sekali saja

    console.log(profileItems);

    return loading ? (
            <Loading />
        ) : (
        <Fragment>
            <Navigation />
                {/* <div className="bg-profil float-right"></div> */}
                <Container>
                    <Row className="mt-5 d-flex position-relative ">
                        <Col md="5" className="flex-grow-1 text-left">
                                <img src={state.avatar == null ? avatarUser : profileItems.avatar } alt="Profil" className="img-profile rounded-circle mb-5" ></img>
                                <span>
                                    <p className="value-profile">{profileItems.fullname}</p>
                                </span>                                        
                                <span>
                                    <p className="value-profile-greeting">{profileItems.greeting == null ? "Your Greetings" : profileItems.greeting}</p>
                                </span>    
                                <Button tag={Link} to={`/edit-profile/${profileItems.id}`} className="btn-waysGallery border-0 m-0">
                                    Edit Profil
                                </Button>
                        </Col>
                        <Col md="7" className="flex-auto text-right">
                            
                            {/* <img src={backgroundProfile} alt="Logo" className="fixed-top"></img> */}
                            {profileItems.posts.length == 0 ? " Posts Empty" : 
                                
                                profileItems.posts[0].photos && (
                                    <img src={profileItems.posts[profileItems.posts.length -1].photos[0].image} alt="post" className="post-profile"></img>                                
                                )
                                
                            }
                            <div className="box"></div>
                        </Col>
                    </Row>


                        <h4 className="mb-4 mt-5 font-weight-bold">My Works</h4>
                    <Row>
                        {profileItems.arts.map(art => (
                            <Col md="4" key={art.id}>
                                <img src={art.image} alt="art" className="art-img-profile mb-5"></img>    
                            </Col>
                        )).reverse()}
                    </Row>
                </Container>
        </Fragment>
    )
}

export default  Profile;