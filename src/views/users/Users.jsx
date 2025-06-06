import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { fetchUsers } from '../../api/userApi';

const BootstrapTable = () => {
  const [users, setUsers] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = async (search = '') => {
    // setLoading(true);
    try {
      const usersData = await fetchUsers(0, 5, search); // Updated to include search
      setUsers(usersData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadUsers();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchString(value);
    loadUsers(value); // Live search
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex align-items-center justify-content-between">
              <Card.Title as="h5" className="mb-0">User Table</Card.Title>
              <Form.Control
                type="text"
                placeholder="Search by username or phone"
                style={{ maxWidth: '250px' }}
                value={searchString}
                onChange={handleSearchChange}
              />
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
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.userName}</td>
                      <td>{user.phoneNumber}</td>
                      <td>
                        {user.image ? (
                          <img src={user.image} alt="User" width={40} />
                        ) : (
                          <span>No image</span>
                        )}
                      </td>
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
