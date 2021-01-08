import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Card, CardBody} from 'reactstrap';
import StackGrid from "react-stack-grid";

import { Link } from 'react-router-dom';

// api
import {API} from "../../../../config/API";

// component
import Loading from "../../../Loading";
import {AppContext} from "../../../../context/appContext";

const All = () => {

    const [state, dispatch] = useContext(AppContext);

    // state menyimpan data seluruh post
    const [postItems, setPost] = useState([]);

    const [loading, setLoading] = useState(true);
    
    // menyimpan data hasil pencarian
    const [filteredPost, setFilterPost] = useState([]);

    useEffect(() => {
        // code untuk menampilkan data dari api
        const fetchsetPost = async ( ) => {
        
            try {
                const response = await API("/posts");
                
                if (response.status == 200) {
                    setPost(response.data.data.posts);
                    setLoading(false);                    
                }
                // dispatch({
                //     type : "USER_LOADED",
                //     payload : state
                // })
            } catch (err) {
                console.log("Your system error",err);
            }
        }

        fetchsetPost();
    }, [])//saat menuliskan dependency [] kosong maka pemanggilan api hanya dilakukan sekali saja

    // =============================================================
    // fitur search all post
    // =============================================================

    const {keyword} = state;
    useEffect(() => {
        setFilterPost(
        postItems.filter((post) =>
            post.title.toLowerCase().includes(keyword.toLowerCase())
        )
        );
    }, [keyword, postItems]);
    // =============================================================
    // fitur search all post
    // =============================================================

    console.log("all post", filteredPost);
    return  loading ? (
        <Loading />
        ) : (
        <Fragment>

            {/* Today Post */}
            <h4 className="mt-5 mb-5">All Post</h4>

            <StackGrid
                columnWidth={'30%'}
            >
            {
                filteredPost.map(post => (
                    post.photos.length > 0 &&(
                        <Link to={`/post/${post.id}`} key={post.id}> 
                            <Card>
                                <CardBody>                                                            
                                    <img src={post.photos[0].image} alt="imagePost" className="img-post" ></img>
                                </CardBody>
                            </Card>
                        </Link>
                    )
                ))
            }

            </StackGrid>
        </Fragment>
    )
}

export default All
