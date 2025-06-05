import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';

const BootstrapTable = () => {
  const [users,setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
      const fetchUsers  = async ()=>{
        try {
          const repsonse = await axios.get('http://localhost:8080/api/v1/user/paginated?searchString=&agentName=&page=0&size=10');
          setUsers(repsonse.data);
          setError(null)
        } catch (error) {
          setError('Failed to fetch users');
          console.error(error);
        }finally{
          setLoading(false);
        }
      }
      fetchUsers();
  },[])
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
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
                    <th>Username</th>
                    <th>Phone</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user,index)=>(
                    <tr key={index}>
                      <td>{user.username}</td>
                      <td>{user.phone}</td>
                      <td>{user.image}</td>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BootstrapTable;
