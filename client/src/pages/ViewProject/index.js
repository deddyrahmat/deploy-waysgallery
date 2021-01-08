// page add product by admin

import React, { Fragment, useState, useEffect } from 'react'
import { Col, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import ReactHtmlParser from 'react-html-parser';

import { Link, useParams, useHistory } from 'react-router-dom';

import Navigation from '../../components/Navigations';

// api
import {API} from "../../config/API";

// import Posts from "../../components/Home/Posts"

import Loading from "../../components/Loading"

// style css
import "./ViewProject.scss";

const ViewProject = () => {
    const router = useHistory();

    const {id} = useParams();

    const [projectItems, setProject] = useState([]);

    const [projectId , setProjectId] = useState(0);

    const [loading, setLoading] = useState(true);

    // useEffect adalah lifecicle untuk stateless component
    useEffect(() => {
        // code untuk menampilkan data dari api
        const fetchsetProject = async ( ) => {
        
        // const response = await axios.get("http://localhost:5000/api/v1/products")
            try {
                const response = await API(`/project/${id}`);
    
                setProject(response.data.data.project);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }

        }

        fetchsetProject();
    }, [])//saat menuliskan dependency [] kosong maka pemanggilan api hanya dilakukan sekali saja


    const handleApprove = e => {

        const fetchsetHiring = async ( ) => {
        
        // const response = await axios.get("http://localhost:5000/api/v1/products")
            try {
                const id = parseInt(e.target.value);
                const body = JSON.stringify({ id });
                console.log("body id",body);

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                };

                const response = await API.patch(`/approveOrder/${id}`,body, config);
                if (response.status == 200) {
                    console.log(response);

                    router.push("/transactions")
                }
            } catch (err) {
                console.log(err);
            }

        }

        fetchsetHiring();
    }
    const handleCancel = e => {

        const fetchsetHiring = async ( ) => {
        
        // const response = await axios.get("http://localhost:5000/api/v1/products")
            try {
                const id = parseInt(e.target.value);
                const body = JSON.stringify({ id });
                console.log("body id",body);

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                };

                const response = await API.patch(`/cancelOrder/${id}`,body, config);
                if (response.status == 200) {
                    console.log(response);

                    router.push("/transactions")
                }
            } catch (err) {
                console.log(err);
            }

        }

        fetchsetHiring();
    }

    // modal image
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const download = async() => {
        try {

            let n = 1;

            projectItems.photos.map(async (photo) => {
                const response = await fetch(
                    photo.image
                );


                if (response.status === 200) {
                    console.log(photo.image)
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "project"+ n++;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    return { success: true };
                }
            })
            
        } catch (err) {
            console.log(err);
        }
    };

    console.log("proje", projectItems);

    return loading ? (
            <Loading />
        ) : Object.keys(projectItems).length === 0 ? (
            <Loading />
        ) : (
        <Fragment>
            <Navigation />
                <Container>
                    
                    <Row>
                        <Col md="6">
                            {
                                projectItems.photos.length > 0 && (                                    
                                    <img src={projectItems.photos[0].image} alt="view-project" onClick={() => {
                                        toggle();
                                        setProjectId(projectItems.hiringId);
                                    }} className="img-fluid main-img"></img>
                                )
                            }
                        </Col>
                        <Col md="6">
                            {ReactHtmlParser(projectItems.description)}
                            <Row className="mt-5">
                                <Col md="6">
                                <Button type="button" className="btn btn-waysGallery-secondary border-0 float-right" onClick={handleCancel} value={projectItems.hiringId} >Cancel</Button>  
                                </Col>
                                <Col md="6">
                                <Button type="button" className="btn btn-waysGallery border-0 float-left" onClick={handleApprove} value={projectItems.hiringId} >Approve</Button>  
                                </Col>

                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            {
                                projectItems.photos.map((project) => (
                                    <img src={project.image} key={project.id} width="60px" alt="view-project" className=" m-2"></img>
                                ))
                            }
                            
                        </Col>
                    </Row>

                    {/* modal image */}
                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalBody>
                            {
                                projectItems.photos.length > 0 && (                                    
                                    <img src={projectItems.photos[0].image} alt="view-project" className="img-fluid main-img"></img>
                                )
                            }
                        <div className="text-center mt-3">
                            <Button className="btn btn-waysGallery border-0" onClick={e => download(e)}>Download</Button>{' '}
                        </div>
                        </ModalBody>
                    </Modal>
                    {/* modal image */}
                </Container>
        </Fragment>
    )
}

export default  ViewProject;