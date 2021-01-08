import React, {Fragment, useState} from 'react';
import { Container,Col , Row,ButtonGroup } from 'reactstrap';
import TableOffer from '../../components/Home/TableOffer';
import TableOrder from '../../components/Home/TableOrder';
import Navigation from '../../components/Navigations';

// style css
import "./Order.scss";

const Order = (props) => {

  const [status, setStatus] = useState("");

  const handleChangeStatus = (e) => {
    setStatus(e.target.value);
  }

  console.log(status);
  
  return (
    <Fragment>
      <Navigation />

        <Container>

          <ButtonGroup className="mt-2 mb-5">
            <select 
                className="form-control bg-light font-weight-bold text-dark" 
                name="status"
                onChange={handleChangeStatus}
            >
                <option value='my-offer'>My Offer</option>
                <option value='my-order'>My Order</option>
            </select>
          </ButtonGroup>

            <Row>
              <Col>
              {
                status === "my-offer" || status === '' ? (
                  <TableOffer />
                  ) : (
                  <TableOrder />
                )
              }
              </Col>
            </Row>
        </Container>
    </Fragment>
  );
}

export default Order;