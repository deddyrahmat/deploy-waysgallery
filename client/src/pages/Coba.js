import React from 'react'
import Gallery from "react-photo-gallery";
import {photos} from "./poto";

const Coba = () => {
    return (
        <div>
            <Gallery photos={photos} direction={"column"} />
        </div>
    )
}

export default Coba
