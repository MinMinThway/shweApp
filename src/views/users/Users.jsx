import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Form, Pagination } from 'react-bootstrap';
import { fetchUsers } from '../../api/userApi';

const BootstrapTable = () => {
  const [users, setUsers] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  const loadUsers = async (page = 0, search = '') => {
    try {
      const data = await fetchUsers(page, pageSize, search);
      setUsers(data.users || []);
      setCurrentPage(data.currentPage || 0);
      setTotalPages(data.totalPages || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users');
      setUsers([]);
      setCurrentPage(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadUsers(currentPage, searchString);
  }, []); // load first page on mount

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchString(value);
    // Reset to page 0 on search
    loadUsers(0, value);
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      loadUsers(page, searchString);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex align-items-center justify-content-between">
              <Card.Title as="h5" className="mb-0">
                User Table
              </Card.Title>
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
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={index}>
                        <td>{user.userName}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.image ? <img src={user.image} alt="User" width={40} /> : <span>No image</span>}</td>
                        <td>
                          <Button variant="info" size="sm" className="me-2">
                            <i className="feather icon-edit" /> Edit
                          </Button>
                          <Button variant="danger" size="sm">
                            <i className="feather icon-trash-2" /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {/* Pagination controls */}
              <Pagination>
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} />
              </Pagination>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BootstrapTable;
