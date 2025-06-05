import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tabs, Tab, Button } from 'react-bootstrap';
import axios from 'axios';

const DashDefault = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/orders');
        setOrders(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const getStatusBadge = (status) => {
    let color = 'secondary';
    let text = 'Unknown';
    
    if (status === '1') {
      color = 'warning';
      text = 'Pending';
    } else if (status === '2') {
      color = 'success';
      text = 'Confirmed';
    } else if (status === '0') {
      color = 'danger';
      text = 'Cancelled';
    }
    
    return <span className={`badge bg-${color}`} style={{ padding: '5px 10px' }}>{text}</span>;
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Orders</Card.Title>
              <Button variant="primary float-end">Add Order</Button>
            </Card.Header>
            <Card.Body>
              <Tabs defaultActiveKey="pending">
                <Tab eventKey="pending" title="Pending">
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Order Number</th>
                        <th>Order Type</th>
                        <th>Date</th>
                        <th>Customer Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter(order => order.status === '1')
                        .map((order, index) => (
                          <tr key={index}>
                            <td>{order.orderNumber}</td>
                            <td>{order.orderType}</td>
                            <td>{order.date}</td>
                            <td>{order.name}</td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td>
                              <Button variant="info" size="sm" className="me-2">
                                <i className="feather icon-edit" /> Edit
                              </Button>
                              <Button variant="danger" size="sm">
                                <i className="feather icon-trash-2" /> Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Tab>
                <Tab eventKey="confirmed" title="Confirmed">
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Order Number</th>
                        <th>Order Type</th>
                        <th>Date</th>
                        <th>Customer Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter(order => order.status === '2')
                        .map((order, index) => (
                          <tr key={index}>
                            <td>{order.orderNumber}</td>
                            <td>{order.orderType}</td>
                            <td>{order.date}</td>
                            <td>{order.name}</td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td>
                              <Button variant="info" size="sm" className="me-2">
                                <i className="feather icon-edit" /> Edit
                              </Button>
                              <Button variant="danger" size="sm">
                                <i className="feather icon-trash-2" /> Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Tab>
                <Tab eventKey="cancelled" title="Cancelled">
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Order Number</th>
                        <th>Order Type</th>
                        <th>Date</th>
                        <th>Customer Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter(order => order.status === '0')
                        .map((order, index) => (
                          <tr key={index}>
                            <td>{order.orderNumber}</td>
                            <td>{order.orderType}</td>
                            <td>{order.date}</td>
                            <td>{order.name}</td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td>
                              <Button variant="info" size="sm" className="me-2">
                                <i className="feather icon-edit" /> Edit
                              </Button>
                              <Button variant="danger" size="sm">
                                <i className="feather icon-trash-2" /> Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;
