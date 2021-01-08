import React, { Fragment, useContext,useState, useEffect } from 'react'
import { Button,  Col, Container, Row } from 'reactstrap';
import ReactHtmlParser from 'react-html-parser';

import {  Link,useParams } from 'react-router-dom';

// api
import {API} from "../../config/API";

import {AppContext} from "../../context/appContext";
import Navigation from '../../components/Navigations';
import Loading from "../../components/Loading";

// images
import avatarUser from "../../assets/img/avatar/avatarUser.png";

// Styel css
import "./DetailPost.scss";

const DetailPost = () => {

    const {id} = useParams();

    const [state] = useContext(AppContext);

    const [postItems, setPost] = useState([]);

    // handle condition follow or unfollow in header
    const [followItems, setFollowItems] = useState([]);

    const [loading, setLoading] = useState(true);

    // ====================================================
    // handle user follow
    // const [follow, setFollow] = useState(0);
    // ====================================================
    
    
    
    // ====================================================
    // useEffect adalah lifecicle untuk stateless component

    // code untuk menampilkan data dari api
    const fetchsetPost = async ( ) => {
        try {
            const response = await API(`/post/${id}`);
            console.log("res post",response);

            if (response.status == 200) {
                const responseFollow = await API(`/following/${response.data.data.post.createBy.id}`);
                console.log("status P :",responseFollow.status);
                if (responseFollow.status == 200) {   
                    console.log("cek follo w ; ",responseFollow.data);
                    setFollowItems(responseFollow.data.data.follow);
                    console.log("follow item",followItems);
                }
                setFollowItems(responseFollow.data.data);
                setLoading(false);
            }

            setPost(response.data.data.post);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    
    useEffect(() => {       

        fetchsetPost();

        // fetchSetFollowItems();
    }, [])//saat menuliskan dependency [] kosong maka pemanggilan api hanya dilakukan sekali saja
    // ===============================================================


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
            <div className="container-detail-post" >
                {/* jika ada data yang berhasil didapat dari api dalam postitems tampilkan ke detail post */}
                {
                    Object.keys(postItems).length > 0 && (              
                        <div>     

                            <Row>
                                <Col md="1">
                                    <img src={postItems.createBy.avatar == null ? avatarUser : postItems.createBy.avatar } alt="Profil" className="rounded-circle " width="60px" height="60px" ></img>
                                </Col>

                                {/* 
                                jika user yang sedang login adalah yang membuat post maka alihkan link ke menu profil
                                jika berbeda maka arahkan ke profil user yang membuat post
                                */}
                                {
                                    state.id === postItems.createBy.id ? 
                                    (
                                        <Col md="9" tag={Link} to={`/profile`} className="text-decoration-none text-dark">
                                            <h5 className="title-detail-post">{postItems.title}</h5>
                                            <p className="user-detail-post">{postItems.createBy.fullname}</p>
                                        </Col>
                                    ) : (
                                        <Col md="9" tag={Link} to={`/user/${postItems.createBy.id}`} className="text-decoration-none text-dark"><h5 className="title-detail-post">{postItems.title}</h5>
                                            <p className="user-detail-post">{postItems.createBy.fullname}</p>
                                        </Col>
                                    )
                                }
                                    
                                {/* 
                                jika fullnam dari state == fullname yang ada di data postItems maka jangan tampilkan apapun(null)
                                karna yang bisa melakukna follow dan hire hanya akun lain 
                                ATAU 
                                jangan tampilkan fitur follow dan hire di post sendiri 
                                */}
                                {state.fullname == postItems.createBy.fullname ? null : (
                                    <Fragment>
                                        <Col md="1">

                                            {/* 
                                            jika ada data di followItems, cek datanya, jika kosong(null) tampilkan tombol follow jika ada data di followitem follow maka tampilkan unfollow 
                                            ATAU
                                            jika user sudah follow akun user lain maka otomotis akan muncul tombol unfollow                                            
                                            */}
                                            {
                                                followItems && (
                                                        followItems.follow == null ? (
                                                        <Button type="button" className="btn btn-waysGallery-secondary ml-n5 border-0" onClick={handleFollow} value={postItems.createBy.id}>Follow</Button> 
                                                        ) : (
                                                        <Button type="button" className="btn btn-waysGallery-secondary ml-n5 border-0 " onClick={handleUnfollow} value={postItems.createBy.id}>Unfollow</Button> 
                                                    )
                                                )

                                            }
                                        </Col>
                                        <Col md="1">
                                            <Button type="button" className="btn btn-waysGallery border-0" tag={Link} to={`/hire/${postItems.createBy.id}`}>Hire</Button>  
                                        </Col>
                                    </Fragment>
                                )}
                            </Row>  
                            {/* menampilkan image utama */}
                            <div className="d-flex justify-content-center ml-5">
                                <img src={postItems.photos[0].image} alt="Post" className="full-img-detail-post" ></img>
                            </div>
                            {/* tampilkan seluruh image post sebgai thumbnail  */}
                            <div className="d-flex justify-content-center ml-5">
                                {
                                    postItems.photos.map(photo => (
                                        <img src={photo.image} key={photo.id} alt="Post" className="item-img-detail-post m-1" ></img>
                                    ))
                                }
                            </div>

                            <div className="mt-4 mb-5">
                                <p>
                                    👋 <span className="font-weight-bold">Say Hello</span> <span className="text-info font-weight-bold">{postItems.createBy.email}</span>
                                </p>

                                <p>
                                    {ReactHtmlParser(postItems.description)}
                                </p>
                            </div>

                        </div>
                    )
                }
            </div>
        </Fragment>
    )
}

export default DetailPost
