import React,{useContext} from 'react'

import {AppContext} from "../context/appContext";

import {Route, Redirect} from "react-router-dom";

import Loading from "./Loading/index";

const PrivateRoute = ({component : Component, ...rest}) => {

    const [state] = useContext(AppContext);

    const { isLogin, isLoading} = state;

    return (
        <Route 
            {...rest}
            render={(props) => 
                isLoading ? (<Loading /> ) 
                : isLogin ? <Component {...props} /> 
                : <Redirect to="/" />
            }
        />
    )
}
export default PrivateRoute
