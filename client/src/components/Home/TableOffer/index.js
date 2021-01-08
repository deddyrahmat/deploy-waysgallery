import React,{useState, useEffect, Fragment} from 'react';
import { Button, Table,Modal, ModalBody, Row, Col } from 'reactstrap';
import ReactHtmlParser from 'react-html-parser';
import NumberFormat from 'react-number-format';
import { useHistory, Link } from 'react-router-dom';

// api
import {API} from "../../../config/API";

// style css
import "./TableOffer.scss";

// images
import IconSuccess from "../../../assets/img/icons/success.png";
import IconCancel from "../../../assets/img/icons/cancel.png";
import IconWait from "../../../assets/img/icons/wait.png";

const TableOffer = (props) => {

  const router = useHistory();

  const [offerItems, setOffer] = useState([]);

  const [loading, setLoading] = useState(true);

  const [detailModal, setDetailModal] = useState([]);

    // useEffect adalah lifecicle untuk stateless component
    useEffect(() => {
        // code untuk menampilkan data dari api
        const fetchsetOffer = async ( ) => {

          try {
            const response = await API("/transactions?status=my-offer");
  
            setOffer(response.data.data.transactions);
            setLoading(false);
          } catch (err) {
            console.log("Your System Error : ", err);
          }
        
        }

        fetchsetOffer();
    }, [])//saat menuliskan dependency [] kosong maka pemanggilan api hanya dilakukan sekali saja
    

    // ================================================================
    // handle offer
    // ================================================================

    // ========== cancel =============
    const handleCancel = (e) => {
      setCancelOffer(e.target.value);
    }
    
    // useEffect adalah lifecicle untuk stateless component
    const setCancelOffer = async ( id ) => {
      
      try {
        const body = JSON.stringify({ id });

        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await API.patch(`/cancelOffer`,body, config);
        
        if (response.status == 200) {
          const result = response.data.data.transactions;
          setOffer(result)
          setLoading(false);
          setModal(false);
        }
        router.push('/transactions');
      } catch (err) {
        console.log("Your System Error : ", err);
      }
      
    }

    // ========== cancel =============

    // ============ approve ===========
    const handleApprove = (e) => {
      setApproveOffer(e.target.value);
    }
    
    // useEffect adalah lifecicle untuk stateless component
    const setApproveOffer = async ( id ) => {
      
      try {
        const body = JSON.stringify({ id });

        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await API.patch(`/approveOffer`,body, config);
        
        if (response.status == 200) {
          const result = response.data.data.transactions;
          setOffer(result)
          setLoading(false);
          setModal(false);
        }
        router.push('/transactions');
      } catch (err) {
        console.log("Your System Error : ", err);
      }
      
    }
    // ============ approve ===========

    // ================================================================
    // handle offer
    // ================================================================

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);
    
    let n = 1;//variabel untuk melakukan perulangan di no urut table

    // console.log(detailModal);
    return (
      <Table bordered>
      <thead className="bg-table-admin">
        <tr>
          <th>No</th>
          <th>Client</th>
          <th>Order</th>
          <th>Start Project</th>
          <th>End Project</th>
          <th>Status</th>
          <th className="text-center">Action</th>
        </tr>
      </thead>
      <tbody className="body-table-admin">
        {
          offerItems.map(offer => (
            <tr key={offer.id}>
              <th scope="row">{n++}</th>
              <td>{offer.orderby.fullname}</td>
              <td className="table-modal" onClick={
                (e) => {
                  toggle()
                  setDetailModal(offer)
                }
              }>{offer.title}</td>
              <td>{new Date(offer.startDate).toLocaleDateString()}</td>
              <td>{new Date(offer.endDate).toLocaleDateString()}</td>
              {
                  offer.status === "Waiting Accept" ? (
                    <Fragment>
                      <td className="status-table-admin accept">
                        {offer.status}
                      </td>
                      <td align="center">
                        <Button color="danger" className="btn-cancel btn-table-admin" type="button" onClick={handleCancel} value={offer.id}>Cancel</Button>
                        <Button color="success" className="btn-approve btn-table-admin" type="button" onClick={handleApprove} value={offer.id}>Approve</Button>
                      </td>
                    </Fragment>
                  )
                  : offer.status === "Waiting Approved Project" ? (
                    <Fragment>
                      <td className="status-table-admin wait">{offer.status}</td>
                      <td align="center">
                        <img src={IconWait} alt="Waiting" ></img>
                      </td>
                    </Fragment>
                  ) 
                  : offer.status === "Project Is Complete" ? (
                    <Fragment>
                      <td className="status-table-admin success">Success</td>
                      <td align="center">
                          <img src={IconSuccess} alt="Success" ></img>
                      </td>
                    </Fragment>
                  ) 
                  : offer.status === "Cancel" ? (
                    <Fragment>
                      <td className="status-table-admin cancel">{offer.status}</td>
                      <td align="center">
                          <img src={IconCancel} alt="cancel" ></img>
                      </td>
                    </Fragment>
                  ) : offer.status === "Waiting Project" ?(
                    <Fragment>
                      <td className="status-table-admin wait">{offer.status}</td>
                      <td align="center">
                          <Button color="success" className="btn-approve btn-table-admin" tag={Link} to={`/project/${offer.id}`}>Send Project</Button>
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

          {
            detailModal.status === "Waiting Accept" ? (
              <Row className="mt-5 float-right">
                <Col>
                  <Button className="btn btn-waysGallery-danger border-0 mr-1" onClick={handleCancel} value={detailModal.id}>Cancel</Button>
                  <Button className="btn btn-waysGallery border-0" onClick={handleApprove} value={detailModal.id}>Approve</Button>{' '}
                </Col>
              </Row>
            ) : null
          }
        </ModalBody>
      </Modal>
    </Table>
  );
}

export default TableOffer;