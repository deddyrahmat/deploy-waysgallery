import { useHistory } from "react-router-dom"
import { Button } from "reactstrap";
import imgNotFound from "../../assets/img/avatar/notFound.svg";

const NotFound = () => {
    const router = useHistory();
    return (
        <div className="justify-content-center align-items-center mt-5">
            <img src={imgNotFound} alt="Logo" className="mb-4 mx-auto d-block img-fluid" width="50%"></img>
            
            <Button color="success" onClick={() => router.push("/home")}  className="mx-auto d-block mt-5">kembali ke home</Button>

        </div>
    )
}

export default NotFound
