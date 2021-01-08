import React, {Fragment, useState, useCallback, useContext} from 'react';
import { Container,Col , Row,Form,  Button, Modal, ModalBody  } from 'reactstrap';
import { useHistory, useParams, Redirect } from 'react-router-dom';

// component
import Navigation from '../../components/Navigations';
import {AppContext} from "../../context/appContext";

// utils CKEDITOR
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// utils dropzone=== upload file
import {useDropzone} from 'react-dropzone'

// api
import {API} from '../../config/API';

// style css
import "./Project.scss";

// icon
import iconUpload from "../../assets/img/icons/upload.png"

const Project = (props) => {

  const router = useHistory();

  const {id} = useParams();

  const [state, dispatch] = useContext(AppContext);

  const [loading, setLoading] = useState(true);

  const [post, setPost] = useState({
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

  const { description } = post;

  const handleOnSubmit= async (e) => {
    e.preventDefault();

    try {

      const body = new FormData();
      body.append("description", description);

      if (imagePrev !== null) {
        imagePrev.photos.map(img => body.append("image", img.file));
      }else{
        return alert("Choose Your Image Projects")
      }


      console.log("tipe data : ",body);
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };

        console.log(id);
        
        const response = await API.post(`/project/${id}`, body, config);

        if (response.status == 200) {
          setModalProject(true);
          dispatch({
            type : "USER_LOADED",
            payload : state
          })

          setLoading(false);
        }

        // karna setelah diupload datanya tidak langsung muncul di page home, maka ku arahkan ke landing page agar di refresh dan diarahkan ke dashboard
        // router.push("/transactions")
    } catch (err) {
      console.log(" your system error : ",err);
      setModalFailed(true);
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
    } catch (err) {
      console.log(err);
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


  
  // modal Project
  const [modalProject, setModalProject] = useState(false);    
  const toggleProject = () => setModalProject(!modalProject);
  // modal Project
  
  // modal Project Failed
  const [modalFailed, setModalFailed] = useState(false);
  const toggleFailed = () => setModalFailed(!modalFailed);
  // modal Project Failed

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

                  <Row className="mt-5 text-center">
                    <Col md="12">
                      <Button type="submit" className="btn btn-waysGallery border-0">Simpan</Button>  
                    </Col>

                  </Row>
                </Form>
              </Col>
            </Row>
        </Container>

        <Modal style={{marginTop:"200px"}} isOpen={modalProject} toggle={toggleProject}>
          <ModalBody>
            <p style={{color:"#469F74", fontSize:"24px", fontWeight:"normal", margin:"auto", textAlign:"center"}}>Send Project Success</p>
          </ModalBody>
          {
            modalProject == false ? (
              <Redirect to="/transactions" />
            ) : null
          }
        </Modal>

        <Modal style={{marginTop:"200px"}} isOpen={modalFailed} toggle={toggleFailed}>
          <ModalBody>
            <p style={{color:"#c70039", fontSize:"24px", fontWeight:"normal", margin:"auto", textAlign:"center"}}>Send Project Failed</p>
          </ModalBody>
        </Modal>
    </Fragment>
  );
}

export default Project;