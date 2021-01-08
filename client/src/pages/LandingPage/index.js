import React, { Fragment, useContext } from 'react';
import {AppContext} from "../../context/appContext";

import {API} from "../../config/API/index";
// import axios from "axios";


import { useHistory } from 'react-router-dom';



// component
import Header from '../../components/Home/Header'

import "./LandingPage.scss";

const LandingPage = () => {
    const router = useHistory();
    
    const [state] = useContext(AppContext);
    console.log(state);


    if (state.isLogin) {
        router.push('/home')
    }else{
        router.push('/')    
    }
    return (
        <Fragment>
                <Header />
        </Fragment>
    )
}

export default  LandingPage;