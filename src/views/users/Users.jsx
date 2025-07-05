import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Form, Pagination, Modal } from 'react-bootstrap';
import { fetchUsers, updateUser, deleteUser } from '../../api/userApi';

const BootstrapTable = () => {
  const [users, setUsers] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  // Modal & form state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState({
    id: null,
    userName: '',
    phoneNumber: '',
    role: '', // changed from status
    image: ''
  });
  const [saving, setSaving] = useState(false);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        await loadUsers(currentPage, searchString);
        alert('User deleted successfully');
      } catch (err) {
        console.error('Failed to delete user:', err);
        alert('Failed to delete user');
      }
    }
  };

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

  // Open modal with selected user data
  const handleEditClick = (user) => {
    setEditUser({
      id: user.id,
      userName: user.userName,
      phoneNumber: user.phoneNumber,
      role: user.status || user.role || '',
      image: user.image || ''
    });
    setShowEditModal(true);
  };

  // Close modal
  const handleModalClose = () => {
    setShowEditModal(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit updated user data
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      console.log('editUser', editUser);
      await updateUser(editUser);
      setShowEditModal(false);
      await loadUsers(currentPage, searchString); // refresh list
    } catch (err) {
      console.error('Failed to update user:', err);
      alert('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
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
                    <th>Status</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={user.id || index}>
                        <td>{user.userName}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.status}</td>
                        <td>{user.image ? <img src={user.image} alt="User" width={40} /> : <span>No image</span>}</td>
                        <td>
                          <Button variant="info" size="sm" className="me-2" onClick={() => handleEditClick(user)}>
                            <i className="feather icon-edit" /> Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
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

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formUserName">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="userName" value={editUser.userName} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" name="phoneNumber" value={editUser.phoneNumber} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control as="select" name="role" value={editUser.role} onChange={handleInputChange}>
                <option value="">Select role</option>
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formImage">
              <Form.Label>Image URL/Base64</Form.Label>
              <Form.Control type="text" name="image" value={editUser.image} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BootstrapTable;
