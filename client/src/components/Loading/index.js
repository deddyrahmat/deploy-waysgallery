import { Fragment } from "react";
import {  Row } from 'reactstrap';
import imgLoading from "../../assets/img/icons/loading.gif";
const Loading = () => {
    return (
        <Fragment>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <img src={imgLoading} alt="loading"></img>
            </div>
        </Fragment>
    )
}

export default Loading
