import React, {Fragment, useState, useContext} from 'react';
import { Container,Col , Row,Form, FormGroup, Input, Button, Modal, ModalBody } from 'reactstrap';
import { useHistory, useParams, Redirect } from 'react-router-dom';
import NumberFormat from 'react-number-format';

// component
import Navigation from '../../components/Navigations';
import {AppContext} from "../../context/appContext";

// utils CKEDITOR
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// api
import {API} from '../../config/API';

// style css
import "./Post.scss";

const Hire = (props) => {

  const {id} = useParams();

  // const [state,dispatch] = useContext(AppContext);
  const [state,dispatch] = useContext(AppContext);

  const router = useHistory();


  const [post, setPost] = useState({
    title : '',
    description : '',
    startDate : '',
    endDate : '',
    price : ''
  })

  const handleChangePost = (e) => {
    setPost({...post,  [e.target.name] : e.target.value})
  }

  const handleCKEditor = ( event, editor ) => {
      const data = editor.getData();
      // console.log( { event, editor, data } );
      setPost({...post,description : data});
  }

  const { title, description, startDate, endDate, price } = post;

  console.log("price", price);
  
  const handleOnSubmit= async (e) => {
    e.preventDefault();

    try {
      // const body = new FormData();
      const priceNew = parseInt(price.replace(/,/g , ''))
      console.log("nedwe price", priceNew);
      const body = JSON.stringify({ title, description, startDate, endDate, price : priceNew });
      console.log("nedwe price", body);
      // body.append("description", description);
      // body.append("title", title);
      // body.append("startDate", startDate);
      // body.append("endDate", endDate);
      // body.append("price", price);

        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        
        const response = await API.post(`/hire/${id}`, body, config);
        console.log("response :",response);

        if (response.status == 200) {
          // alert("We have sent  your offer, please wait for the user to accept it");
          setModalHire(true)

          dispatch({
            type : "USER_LOADED",
            payload : state
          })

        }

        // router.push("/")
    } catch (err) {
      console.log(" your system error : ",err);
      setModalFailed(true)
    }
  }

  // modal Hire
  const [modalHire, setModalHire] = useState(false);    
  const toggleHire = () => setModalHire(!modalHire);
  // modal Hire
  
  // modal Hire Failed
  const [modalFailed, setModalFailed] = useState(false);
  const toggleFailed = () => setModalFailed(!modalFailed);
  // modal Hire Failed

  return (
    <Fragment>
      <Navigation />
        <Container>
            <Row className="mt-5 d-flex justify-content-center">
              <Col md="8">
                <Form onSubmit={handleOnSubmit}>
                  <FormGroup>
                    <Input type="text" name="title" id="title" placeholder="Title" className="main-form" onChange={handleChangePost} />
                  </FormGroup>

                  <CKEditor
                      config={{placeholder: "Description Job..."}} 
                      editor={ ClassicEditor }
                      data=""
                      onReady={ editor => {
                          // You can store the "editor" and use when it is needed.
                          // console.log( 'Editor is ready to use!', editor );
                      } }
                      onChange={ handleCKEditor }
                      onBlur={ ( event, editor ) => {
                          // console.log( 'Blur.', editor );
                      } }
                      onFocus={ ( event, editor ) => {
                          // console.log( 'Focus.', editor );
                      } }
                  />

                  <Row form className="mt-3">
                    <Col md={6}>
                      <FormGroup>
                        <Input type="date" name="startDate" id="startDate" placeholder="Start Project" className="main-form"  onChange={handleChangePost}/>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Input type="date" name="endDate" id="endDate" placeholder="End Project" className="main-form"  onChange={handleChangePost} />
                      </FormGroup>
                    </Col>
                  </Row>

                  <FormGroup>
                    <NumberFormat thousandSeparator={true} style={{paddingLeft:"10px", paddingTop:"5px", paddingBottom:"5px"}} placeholder="Price" name="price" id="price" className="main-form w-100" inputmode="numeric" onChange={handleChangePost} />
                  </FormGroup>

                  <Row className="mt-5">
                    <Col md="6">
                      <Button type="reset" className="btn btn-waysGallery-secondary border-0 float-right" >Cancel</Button>  
                    </Col>
                    <Col md="6">
                      <Button type="submit" className="btn btn-waysGallery border-0">Bidding</Button>  
                    </Col>

                  </Row>
                </Form>
              </Col>
            </Row>
        </Container>

        <Modal style={{marginTop:"200px"}} isOpen={modalHire} toggle={toggleHire}>
          <ModalBody>
            <p style={{color:"#469F74", fontSize:"24px", fontWeight:"normal", margin:"auto", textAlign:"center"}}>We have sent your offer, please wait for the user to accept it</p>
          </ModalBody>
          {
            modalHire == false ? (
              <Redirect to="/home" />
            ) : null
          }
        </Modal>

        <Modal style={{marginTop:"200px"}} isOpen={modalFailed} toggle={toggleFailed}>
          <ModalBody>
            <p style={{color:"#c70039", fontSize:"24px", fontWeight:"normal", margin:"auto", textAlign:"center"}}>Hired Failed</p>
          </ModalBody>
        </Modal>
    </Fragment>
  );
}

export default Hire;