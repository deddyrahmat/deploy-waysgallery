import React, {Fragment, useState, useCallback, useContext} from 'react';
import { Container,Col , Row,Form, FormGroup, Input, Button, Modal, ModalBody } from 'reactstrap';
import { useHistory, useParams, Redirect } from 'react-router-dom';

// component
import Navigation from '../../components/Navigations';


// utils dropzone=== upload file
import {useDropzone} from 'react-dropzone'

// api
import {API} from '../../config/API';
import {AppContext} from "../../context/appContext";

// style css
import "./EditProfile.scss";

// icon
import iconUpload from "../../assets/img/icons/upload.png"
import iconCamera from "../../assets/img/icons/camera.png"

const EditProfile = (props) => {

  const [state, dispatch] = useContext(AppContext);

  const router = useHistory();

  const {id} = useParams();

  // dropzone
  const [imageArts, setImageArts] = useState(null);
  

  // profile
  const [profile, setProfile] = useState({
    fullname : state.fullname,
    greeting : state.greeting
  })

  // avatar profile
  const [image, setImage] = useState({ preview: "", raw: "" });

  const handleChangeProfile = (e) => {
    // console.log(e.target.name);
    setProfile({...profile,  [e.target.name] : e.target.value})
  }

  // ======================================================
  // change avatar
  // ======================================================
  const handleChangeAvatar = (e) => {
    if (e.target.files.length) {
      setImage({
        preview : URL.createObjectURL(e.target.files[0]),
        raw : e.target.files[0]
      })
    }
  }

  const { fullname,greeting } = profile;
  const handleOnSubmit= async (e) => {
    e.preventDefault();

    try {
      const body = new FormData();

      if (image.raw == '' || image.raw == null) {
        body.append("fullname", fullname);
        body.append("greeting", greeting);
      }else if (image.raw !== '' || image.raw !== null) {
        body.append("image", image.raw);
        body.append("fullname", fullname);
        body.append("greeting", greeting);
      }

      
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        
        const response = await API.patch("/update-user", body, config);

        // karna setelah diupload datanya tidak langsung muncul di page home, maka ku arahkan ke landing page agar di refresh dan diarahkan ke dashboard

        if (response.status == 200) {
          
          setModalProfile(true)
          
          dispatch({
            type: "USER_LOADED",
            payload: response.data.data.post
          });
        }

        // router.push("/profile")
    } catch (err) {
      console.log(" your system error : ",err);
      setModalFailed(true)
    }
  }

  // ==================================================
  // use utils dropzone 
  // ==================================================

  const onDrop = useCallback( async (acceptedFiles) => {
    // Do something with the files
    const body = new FormData();
    // body.append("userId", userId);
    acceptedFiles.map(img => body.append("image", img));

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
    };
    
    const response = await API.post("/art", body, config);
    if (response.status === 200) {
      // alert("Upload Success")
      setModalArt(true)
    }
  }, [])

  const {
    getRootProps, 
    getInputProps,
  } = useDropzone({
    onDrop,
    maxFiles:10,
    accept: 'image/jpeg, image/jpg, image/png'
  })


  // modal Art
  const [modalArt, setModalArt] = useState(false);    
  const toggleArt = () => setModalArt(!modalArt);
  // modal Art


  // modal Profile
  const [modalProfile, setModalProfile] = useState(false);    
  const toggleProfile = () => setModalProfile(!modalProfile);
  // modal Profile
  
  // modal Profile Failed
  const [modalFailed, setModalFailed] = useState(false);
  const toggleFailed = () => setModalFailed(!modalFailed);
  // modal Profile Failed

  return (
    <Fragment>
      <Navigation />
        <Container>
            <Row className="mt-5">
              <Col md="6">
                

                <section className="container form-upload">
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <img src={iconUpload} alt="Upload"></img>
                    <p>Browse to choose a file</p>
                    <em>(10 files are the maximum number of files you can drop here)</em>
                  </div>
                </section>

              </Col>
              <Col md="6" className="text-center">
                <Form onSubmit={handleOnSubmit}>
                  <label htmlFor="avatar">
                    {image.preview ? (
                      <img src={image.preview} alt="dummy" width="120" height="120" className="rounded-circle" />
                    ) : (
                      <>
                        <div className="border-iconCamera">
                          <img src={iconCamera} alt="Upload Avatar" className="iconCamera-size "></img>
                        </div>
                      </>
                    )}
                  </label>
                  <FormGroup>
                    <Input type="file" name="avatar" id="avatar" className="d-none" onChange={handleChangeAvatar} />
                  </FormGroup>
                  <FormGroup>
                    <Input type="text" name="greeting" id="greeting" placeholder={state.greeting} className="main-form" onChange={handleChangeProfile} />
                  </FormGroup>
                  <FormGroup>
                    <Input type="text" name="fullname" id="fullname" placeholder={state.fullname} className="main-form" onChange={handleChangeProfile} />
                  </FormGroup>

                  

                  <Row className="mt-5">
                    <Col md="6">
                      <Button type="reset" className="btn btn-waysGallery-secondary border-0 float-right" >Cancel</Button>  
                    </Col>
                    <Col md="6">
                      <Button type="submit" className="btn btn-waysGallery border-0 float-left">Simpan</Button>  
                    </Col>

                  </Row>
                </Form>
              </Col>
            </Row>
        </Container>

        {/* Pop UP/ Modal  */}

        <Modal style={{marginTop:"200px"}} isOpen={modalArt} toggle={toggleArt}>
          <ModalBody>
            <p style={{color:"#469F74", fontSize:"24px", fontWeight:"normal", margin:"auto", textAlign:"center"}}>Created Arts Success</p>
          </ModalBody>
          {/* {
            modalArt == false ? (
              <Redirect to="/profile" />
            ) : null
          } */}
        </Modal>


        <Modal style={{marginTop:"200px"}} isOpen={modalProfile} toggle={toggleProfile}>
          <ModalBody>
            <p style={{color:"#469F74", fontSize:"24px", fontWeight:"normal", margin:"auto", textAlign:"center"}}>Change Profile Success</p>
          </ModalBody>
          {
            modalProfile == false ? (
              <Redirect to="/profile" />
            ) : null
          }
        </Modal>

        <Modal style={{marginTop:"200px"}} isOpen={modalFailed} toggle={toggleFailed}>
          <ModalBody>
            <p style={{color:"#c70039", fontSize:"24px", fontWeight:"normal", margin:"auto", textAlign:"center"}}>Change Profile Failed</p>
          </ModalBody>
        </Modal>
    </Fragment>
  );
}

export default EditProfile;