import React,{useState, useEffect, Fragment} from 'react';
import { Button, Table, Modal, ModalBody, Row, Col } from 'reactstrap';
import ReactHtmlParser from 'react-html-parser';
import NumberFormat from 'react-number-format';


// api
import {API} from "../../../config/API";

// style css
import "./TableOrder.scss";

// images
import IconSuccess from "../../../assets/img/icons/success.png";
import IconCancel from "../../../assets/img/icons/cancel.png";
import IconWait from "../../../assets/img/icons/wait.png";
import { useHistory, Link } from 'react-router-dom';

// component
import Loading from "../../Loading"

const TableOrder = (props) => {

  const router = useHistory();

  const [orderItems, setOrder] = useState([]);

  const [loading, setLoading] = useState(true);

  const [detailModal, setDetailModal] = useState([]);

    // useEffect adalah lifecicle untuk stateless component
    useEffect(() => {
        // code untuk menampilkan data dari api
        const fetchsetOrder = async ( ) => {

          try {
            const response = await API("/transactions?status=my-order");
  
            setOrder(response.data.data.transactions);
            setLoading(false);
          } catch (err) {
            console.log("Your System Error : ", err);
          }
        
        }

        fetchsetOrder();
    }, [])//saat menuliskan dependency [] kosong maka pemanggilan api hanya dilakukan sekali saja
    

    
    let n = 1;//variabel untuk melakukan perulangan di no urut table

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    console.log(detailModal);

    return  loading ? (
            <Loading />
        ) : (
      <Table bordered>
      <thead className="bg-table-admin">
        <tr>
          <th>No</th>
          <th>Vendor</th>
          <th>Order</th>
          <th>Start Project</th>
          <th>End Project</th>
          <th>Status</th>
          <th className="text-center">Action</th>
        </tr>
      </thead>
      <tbody className="body-table-admin">
        {
          orderItems.map(order => (
            <tr key={order.id}>
              <th scope="row">{n++}</th>
              <td>{order.orderby.fullname}</td>
              <td className="table-modal" onClick={
                (e) => {
                  toggle()
                  setDetailModal(order)
                }
              }>{order.title}</td>
              <td>{new Date(order.startDate).toLocaleDateString()}</td>
              <td>{new Date(order.endDate).toLocaleDateString()}</td>
              {
                  order.status === "Waiting Accept" ? (
                    <Fragment>
                      <td className="status-table-admin accept">
                        {order.status}
                      </td>
                      <td align="center">
                        <img src={IconWait} alt="Waiting" ></img>
                      </td>
                    </Fragment>
                  )
                  : order.status === "Waiting Project" ? (
                    <Fragment>
                      <td className="status-table-admin wait">{order.status}</td>
                      <td align="center">
                        <img src={IconWait} alt="Waiting" ></img>
                      </td>
                    </Fragment>
                  )
                  : order.status === "Waiting Approved Project" ? (
                    <Fragment>
                      <td className="status-table-admin wait">{order.status}</td>
                      <td align="center">
                          <Button color="success" className="btn-approve btn-table-admin" tag={Link} to={`/view-project/${order.id}`}>View Project</Button>
                      </td>
                    </Fragment>
                  ) : order.status === "Cancel" ? (
                    <Fragment>
                      <td className="status-table-admin cancel">{order.status}</td>
                      <td align="center">
                          <img src={IconCancel} alt="cancel" ></img>
                      </td>
                    </Fragment>
                  ) : order.status === "Project Is Complete" ?(
                    <Fragment>
                      <td className="status-table-admin success">{order.status}</td>
                      <td align="center">
                          <img src={IconSuccess} alt="Success" ></img>
                      </td>
                    </Fragment>
                  ) : null
              }
            </tr>
          ))
        }

      </tbody>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalBody>

          <div className="text-modal mb-3">
            {detailModal.title}
          </div>
          <div className=" text-modal">
            {ReactHtmlParser(detailModal.description)}
          </div>
          <NumberFormat 
            value={detailModal.price} 
            displayType={'text'} 
            thousandSeparator={true} 
            prefix={'Price : '} 
            renderText={
              value => <small className="price-modal">{value}</small>
            } />

          {/* {
            detailModal.status === "Waiting Accept" ? (
              <Row className="mt-5 float-right">
                <Col>
                  <Button className="btn btn-waysGallery-danger border-0 mr-1" onClick={handleCancel} value={detailModal.id}>Cancel</Button>
                  <Button className="btn btn-waysGallery border-0" onClick={handleApprove} value={detailModal.id}>Approve</Button>{' '}
                </Col>
              </Row>
            ) : null
          } */}
        </ModalBody>
      </Modal>
    </Table>
  );
}

export default TableOrder;