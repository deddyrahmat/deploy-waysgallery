import React, {Fragment, useState, useCallback, useContext} from 'react';
import { Container,Col , Row,Form, FormGroup, Input, Button, Modal, ModalBody } from 'reactstrap';
import { useHistory, Redirect } from 'react-router-dom';

// component
import Navigation from '../../components/Navigations';
import {AppContext} from "../../context/appContext";
import Loading from '../../components/Loading';

// utils CKEDITOR
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// utils dropzone=== upload file
import {useDropzone} from 'react-dropzone'

// api
import {API} from '../../config/API';

// style css
import "./Post.scss";

// icon
import iconUpload from "../../assets/img/icons/upload.png"

const Post = (props) => {

  const [state, dispatch] = useContext(AppContext);

  const router = useHistory();

  // const [imagePost, setImagePost] = useState(null);
  
  const [loading, setLoading] = useState(true);
  
  const [post, setPost] = useState({
    title : '',
    description : ''
  })
  
  // menampung image yang akan di tampilkan dan disimpan
  const [imagePrev, setImagePrev] = useState({photos : []});
  
  const handleChangePost = (e) => {
    setPost({...post,  [e.target.name] : e.target.value})
  }

  const handleCKEditor = ( event, editor ) => {
      const data = editor.getData();
      // console.log( { event, editor, data } );
      setPost({...post,description : data});
  }

  const { title, description } = post;

  const handleOnSubmit= async (e) => {
    e.preventDefault();

    try {

      // imagePost.map(async (file) => {
      //   await setPost({...post,image : file.path});
        
      // })

      const body = new FormData();
      body.append("description", description);
      body.append("title", title);

      if (imagePrev !== null) {
        imagePrev.photos.map(img => body.append("image", img.file));
        // body.append("image", imagePost[0]);
      }else{
        return alert("Choose Your Image Post")
      }


      // console.log("tipe data : ",body);
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        
        const response = await API.post("/post", body, config);
        if (response.status == 200) {

          setmodalPost(true);
          dispatch({
            type : "USER_LOADED",
            payload : state
          })

          setLoading(false);
        }

        // karna setelah diupload datanya tidak langsung muncul di page home, maka ku arahkan ke landing page agar di refresh dan diarahkan ke dashboard
        // router.push("/")
    } catch (err) {
      setModalFailed(true)
      console.log(" your system error : ",err);
    }
  }

  // ==================================================
  // use utils dropzone 
  // ==================================================

  const onDrop = useCallback(async acceptedFiles => {
        // Do something with the files
        try {
          // setImagePost(acceptedFiles);
          
          // untuk bagian saat disimpan di cloud
            // bagian priview image
            await acceptedFiles.map(file => {
                setImagePrev(prevState => ({
                    ...prevState,
                    photos: [
                        ...prevState.photos,
                        {
                            file: file,
                            preview: URL.createObjectURL(file)
                        }
                    ]
                }))
            })
        } catch (error) {
            console.log(error);
        }
    }, [])

  // ==================================================
  // use utils dropzone 
  // ==================================================
  const {
    getRootProps, 
    getInputProps,
  } = useDropzone({
    onDrop,
    maxFiles:10,
    accept: 'image/jpeg, image/jpg, image/png'
  })

  // ==================================================
  // use utils dropzone 
  // ==================================================


  // modal post
  const [modalPost, setmodalPost] = useState(false);    
  const togglePost = () => setmodalPost(!modalPost);
  // modal post

  // modal post failed
  const [modalFailed, setModalFailed] = useState(false);
  const toggleFailed = () => setModalFailed(!modalFailed);
  // modal post failed

  // console.log(post);
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
                    {/* jika melewati 10 maka akn muncul pesan limit */}
                  </div>
                </section>
                <Row>
                  {
                      imagePrev.photos.map((photo, i = 0) => {
                          i = i + 1;
                          return (
                            <Col md="3" key={i}  className="m-3">
                                  <img src={photo.preview} alt="preview" className="size-preview-image" />
                            </Col>
                          )
                      })
                  }
                </Row>

              </Col>
              <Col md="6">
                <Form onSubmit={handleOnSubmit}>
                  <FormGroup>
                    <Input type="text" name="title" id="title" placeholder="Title" className="main-form" onChange={handleChangePost} />
                  </FormGroup>

                  <CKEditor
                    editor={ ClassicEditor }
                    config={{placeholder: "Description..."}} 
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

                  <Row className="mt-5">
                    <Col md="6">
                      <Button type="reset" className="btn btn-waysGallery border-0 float-right" >Cancel</Button>  
                    </Col>
                    <Col md="6">
                      <Button type="submit" className="btn btn-waysGallery border-0">Simpan</Button>  
                    </Col>

                  </Row>
                </Form>
              </Col>
            </Row>
        </Container>
        <Modal style={{marginTop:"200px"}} isOpen={modalPost} toggle={togglePost} >
          <ModalBody>
            <p style={{color:"#469F74", fontSize:"24px", fontWeight:"normal", margin:"auto", textAlign:"center"}}>Post Success Created</p>
          </ModalBody>
          {
            modalPost == false ? (
              <Redirect to="/home" />
            ) : null
          }
        </Modal>
        <Modal style={{marginTop:"200px"}} isOpen={modalFailed} toggle={toggleFailed}>
        <ModalBody>
          <p style={{color:"#c70039", fontSize:"24px", fontWeight:"normal", margin:"auto", textAlign:"center"}}>Created Post Failed</p>
        </ModalBody>
      </Modal>
    </Fragment>
  );
}

export default Post;