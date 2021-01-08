import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Card, CardBody} from 'reactstrap';
import StackGrid from "react-stack-grid";

import { Link } from 'react-router-dom';

// api
import {API} from "../../../../config/API";

// component
import Loading from "../../../../components/Loading";
import {AppContext} from "../../../../context/appContext";

const Follow = () => {

    const [state, dispatch] = useContext(AppContext);

    const [postItems, setPost] = useState([]);

    const [loading, setLoading] = useState(true);

    // menyimpan data hasil pencarian
    const [filteredPost, setFilterPost] = useState([]);

    useEffect(() => {
        // code untuk menampilkan data dari api
        const fetchsetPost = async ( ) => {
        
            // const response = await axios.get("http://localhost:5000/api/v1/products")
            try {
                const response = await API("/follow");
                setPost(response.data.data.user);
                setLoading(false);
                dispatch({
                    type : "USER_LOADED",
                    payload : state
                })
            } catch (err) {
                console.log(err);
            }
        }

        fetchsetPost();
    }, [])//saat menuliskan dependency [] kosong maka pemanggilan api hanya dilakukan sekali saja

    // =============================================================
    // fitur search filter post
    // =============================================================

    const {keyword} = state;
    console.log("key" , keyword);
    useEffect(() => {
        setFilterPost(

            postItems.map(follow => {
                console.log(follow)

                // =================================
                // cara di codepen berhasil
                
                // follow.followings.posts.filter(post => {
                    //     post.title.toLowerCase().includes(keyword.toLowerCase())
                    //     // p.name === 'suci' ? 
                    //     // console.log(p.name)
                    //     // : null
                    // })
                // =================================
            })

            // Object.keys(postItems).map((follow) => 
            //     postItems[follow]
            // )
            
            // postItems.filter((following) => {
            //     for (const follow in following) {
            //         let result =  following[follow]
                    
            //         let valueFollow = [];
            //         for (const follo in result) {
            //             valueFollow = [result[follo]]
            //             console.log(valueFollow)
            //         }
            //     }
            // })

        )
    }, [keyword, postItems]);
    // =============================================================
    // fitur search filter post
    // =============================================================

    console.log("data post",postItems);
    console.log("filter post",filteredPost);
    return  loading ? (
        <Loading />
        ) : (
        <Fragment>

            {/* Today Post */}
            <h4 className="mt-5 mb-5">Follow Post</h4>

            <StackGrid
                columnWidth={'30%'}
            >
            {
                postItems.map(following => (
                    following.followings.posts.map(post => (
                        // post.id
                        post.photos.length > 0 &&(
                                <Link to={`/post/${post.id}`} key={post.id}> 
                                    <Card>
                                        <CardBody>                                                            
                                            <img src={post.photos[0].image} alt="imagePost" className="img-post" ></img>
                                        </CardBody>
                                    </Card>
                                </Link>
                            ) 
                        )
                    )
                ))
            }

            </StackGrid>
        </Fragment>
    )
}

export default Follow
