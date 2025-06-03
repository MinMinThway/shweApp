import React from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';

const BootstrapTable = () => {
  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Basic Table</Card.Title>
              <Button variant="primary float-end">Add User</Button>
              <span className="d-block m-t-5">
                use bootstrap <code>Table</code> component
              </span>
              
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>
                      <Button variant="info" size="sm" className="me-2">
                        <i className="feather icon-edit" /> Edit
                      </Button>
                      <Button variant="danger" size="sm">
                        <i className="feather icon-trash-2" /> Delete
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>
                      <Button variant="info" size="sm" className="me-2">
                        <i className="feather icon-edit" /> Edit
                      </Button>
                      <Button variant="danger" size="sm">
                        <i className="feather icon-trash-2" /> Delete
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                    <td>
                      <Button variant="info" size="sm" className="me-2">
                        <i className="feather icon-edit" /> Edit
                      </Button>
                      <Button variant="danger" size="sm">
                        <i className="feather icon-trash-2" /> Delete
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BootstrapTable;
