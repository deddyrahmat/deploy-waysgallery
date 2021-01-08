// page add product by admin

import React, { Fragment, useState, useContext } from 'react'
import { Col, Container, Row, ButtonGroup,  Input} from 'reactstrap';
import { Search } from 'react-feather';
import Navigation from '../../components/Navigations';

// api
import {API} from "../../config/API";

// import Posts from "../../components/Home/Posts"
import {AppContext} from "../../context/appContext";
import All from '../../components/Home/Posts/All';
import Follow from '../../components/Home/Posts/Follow';
import Loading from "../../components/Loading";



// style css
import "./Home.scss";

const Home = () => {

    const [state, dispatch] = useContext(AppContext);

    // hasil dari search
    const [postStatus, setPostStatus] = useState('');
    
    const [loading, setLoading] = useState(true);

    const handleFilterPost = (e) => {
        setPostStatus(e.target.value);
    }

    const handleSearch = (e) => {
        dispatch({
            type : "KEYWORD_SEARCH",
            payload : e.target.value
        })
        // setSearch(e.target.value);
        // console.log("data",e.target.value);
    }


        // useEffect adalah lifecicle untuk stateless component
    // useEffect(() => {
    //     // code untuk menampilkan data dari api
    //         const fetchsetSearch = async ( ) => {

    //         try {
    //             const response = await API(`/search?status=${searchItems}`);

    //             setPostStatus(response.data.data.transactions);
    //             setLoading(false);
    //         } catch (err) {
    //             console.log("Your System Error : ", err);
    //         }
            
    //     }

    //     fetchsetSearch();
    // }, [searchItems])//saat menuliskan dependency [value] maka pemanggilan api akan dilakukan setiap ada perubahan data(didupdate)
    
    // console.log(postStatus);

    return (
        <Fragment>
            <Navigation />
                <Container>
                    <Row className="mt-4">
                        <Col md="4">
                            <ButtonGroup>
                                <select 
                                    className="form-control bg-light font-weight-bold text-dark" 
                                    name="status"
                                    onChange={handleFilterPost}
                                >
                                    <option value='all'  >All Posts</option>
                                    <option value='follow'  >Follow</option>
                                </select>
                            </ButtonGroup>
                        </Col>
                        <Col md={{size: 3, offset:5}} className="text-right">
                            <div className="form-group has-search">
                                <span className="form-control-feedback"><Search /></span>
                                <Input type="text" name="seacrh" id="examplePassword" placeholder="Seacrh Title Post" onChange={handleSearch} />
                            </div>
                        </Col>
                    </Row>
                    
                    {
                        postStatus === 'all' || postStatus === '' ? (
                            <All />
                        ) : postStatus === 'follow' ? ( 
                            <Follow />
                        ) : (
                            null
                        )
                    }
                    
                </Container>
        </Fragment>
    )
}

export default  Home;