import React, { Fragment, useContext,useState, useEffect } from 'react'
import { Button,  Col, Container, Row } from 'reactstrap';

import {  Link, useParams } from 'react-router-dom';

// api
import {API} from "../../config/API";

import {AppContext} from "../../context/appContext";
import Navigation from '../../components/Navigations';
import Loading from "../../components/Loading";

// images
import avatarUser from "../../assets/img/avatar/avatarUser.png";

// Styel css
import "./ProfileUser.scss";

const ProfileUser = () => {

    const {id} = useParams();

    const [state] = useContext(AppContext);

    const [profileItems, setProfile] = useState([]);

    // handle condition follow or unfollow in header
    const [followItems, setFollowItems] = useState([]);

    const [loading, setLoading] = useState(true);

    // useEffect adalah lifecicle untuk stateless component
    useEffect(() => {
        // code untuk menampilkan data dari api
        const fetchsetProfile = async ( ) => {
        
            const response = await API(`/user/${id}`);

            setProfile(response.data.data.user);
            setLoading(false);
        }

        fetchsetProfile();
    }, [])//saat menuliskan dependency [] kosong maka pemanggilan api hanya dilakukan sekali saja

    // ===============================================================
    // handle user follow where id

    const fetchFollow = async (id) => {
        try {
            setLoading(true);
            const response = await API.post(`/follow/${id}`);
            console.log("res id follow",id);
            console.log("res follow",response);

            console.log(response);
            setFollowItems(response.data.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }


    const handleFollow = (e) => {
        // setFollow(e.target.value);
        fetchFollow(e.target.value);
    }

    // ============================================================


    // ============================================================

    // handle unfollow
    const fetchUnfollow = async (id) => {
        try {
            setLoading(true);
            const response = await API.delete(`/unfollow/${id}`);
            console.log("res id follow",id);
            console.log("res follow",response);

            console.log(response);
            setFollowItems({follow : null});
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }


    const handleUnfollow = (e) => {
        // setFollow(e.target.value);
        fetchUnfollow(e.target.value);
    }
    
    // ==================================================

    return loading ? (
            <Loading />
        ) : (
        <Fragment>
            <Navigation />
                {/* <div className="bg-profil float-right"></div> */}
                <Container className="position-relative">
                    <Row className="mt-5 d-flex position-relative ">
                        <Col md="5" className="flex-grow-1 text-left">
                            <img src={profileItems.avatar == null ? avatarUser : profileItems.avatar } alt="Profil" className="img-profile rounded-circle mb-5" ></img>
                            <span>
                                <p className="value-profile">{profileItems.fullname}</p>
                            </span>                                        
                            <span>
                                <p className="value-profile-greeting">{profileItems.greeting == null ? "Your Greetings" : profileItems.greeting}</p>
                            </span>    
                            {/* 
                            jika fullnam dari state == fullname yang ada di data postItems maka jangan tampilkan apapun(null)
                            karna yang bisa melakukna follow dan hire hanya akun lain 
                            ATAU 
                            jangan tampilkan fitur follow dan hire di post sendiri 
                            */}
                            {/* 
                            jika ada data di followItems, cek datanya, jika kosong(null) tampilkan tombol follow jika ada data di followitem follow maka tampilkan unfollow 
                            ATAU
                            jika user sudah follow akun user lain maka otomotis akan muncul tombol unfollow                                            
                            */}
                            <div>
                                {
                                profileItems && (
                                        followItems.follow == null ? (
                                        <Button type="button" className="btn btn-waysGallery-secondary border-0" onClick={handleFollow} value={profileItems.id}>Follow</Button> 
                                        ) : (
                                        <Button type="button" className="btn btn-waysGallery-secondary border-0 " onClick={handleUnfollow} value={profileItems.id}>Unfollow</Button> 
                                    )
                                )
                                }
                                <Button type="button" className="btn btn-waysGallery border-0 ml-4" tag={Link} to={`/hire/${profileItems.id}`}>Hire</Button> 
                            </div>
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
                                <img src={art.image} alt="post" className="art-img-profile mb-5"></img>    
                            </Col>
                        )).reverse()}
                    </Row>
                </Container>
        </Fragment>
    )
}

export default  ProfileUser;