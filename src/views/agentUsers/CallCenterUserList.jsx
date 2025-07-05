import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Form, Pagination, Modal, Alert } from 'react-bootstrap';
import { fetchCallCenterUsers, createCallCenterUser, updateCallCenterUser, deleteCallCenterUser } from 'api/callAgent';

const CallCenterUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ userId: '', userName: '', phoneNumber: '', remainingBalance: '', serviceStatus: 'ACTIVE' });
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await fetchCallCenterUsers(currentPage, pageSize, searchTerm);
      setUsers(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUsers();
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        phoneNumber: formData.phoneNumber,
        userName: formData.userName,
        remainingBalance: parseFloat(formData.remainingBalance),
        serviceStatus: formData.serviceStatus,
      };

      if (editingUser) {
        await updateCallCenterUser(editingUser.userId, payload);
        alert('User updated successfully.');
      } else {
        payload.userId = formData.userId;
        await createCallCenterUser(payload);
        alert('User created successfully.');
      }
      setShowForm(false);
      setEditingUser(null);
      setFormData({ userId: '', userName: '', phoneNumber: '', remainingBalance: '', serviceStatus: 'ACTIVE' });
      fetchUsers();
    } catch (err) {
      console.error('Failed to submit user:', err);
      alert('Submit failed.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      userId: user.userId,
      userName: user.userName,
      phoneNumber: user.phoneNumber,
      remainingBalance: user.remainingBalance,
      serviceStatus: user.serviceStatus,
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const success = await deleteCallCenterUser(userId);
      if (success) {
        alert('User deleted successfully.');
        fetchUsers();
      } else {
        alert('Failed to delete user.');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error occurred while deleting user.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Call Center Users</h3>

      <Row className="mb-3">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col md={4} className="text-end">
          <Button variant="success" onClick={() => { setShowForm(true); setEditingUser(null); setFormData({ userId: '', userName: '', phoneNumber: '', remainingBalance: '', serviceStatus: 'ACTIVE' }); }}>
            + Create New User
          </Button>
        </Col>
      </Row>

      <Table responsive>
        <thead>
          <tr>
            <th>User ID</th>
            <th>User Name</th>
            <th>Phone Number</th>
            <th>Remaining Balance</th>
            <th>Service Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.userId}</td>
              <td>{user.userName}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.remainingBalance?.toFixed(2)}</td>
              <td>
                <span className={`badge ${
                  user.serviceStatus === 'ACTIVE' ? 'bg-success' :
                  user.serviceStatus === 'SUSPENDED' ? 'bg-warning' :
                  'bg-secondary'
                }`}>
                  {user.serviceStatus}
                </span>
              </td>
              <td>
                <Button variant="info" size="sm" className="me-2" onClick={() => handleEdit(user)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(user.userId)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Row className="mt-3">
        <Col>
          <Pagination>
            <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPage === 0} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} />
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i}
                active={i === currentPage}
                onClick={() => handlePageChange(i)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} />
            <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage === totalPages - 1} />
          </Pagination>
        </Col>
      </Row>

      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Edit User' : 'Create New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateOrUpdateUser}>
            {!editingUser && (
              <Form.Group className="mb-3">
                <Form.Label>User ID</Form.Label>
                <Form.Control type="text" name="userId" value={formData.userId} onChange={handleFormChange} required />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>User Name</Form.Label>
              <Form.Control type="text" name="userName" value={formData.userName} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Remaining Balance</Form.Label>
              <Form.Control type="number" step="0.01" name="remainingBalance" value={formData.remainingBalance} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Service Status</Form.Label>
              <Form.Select name="serviceStatus" value={formData.serviceStatus} onChange={handleFormChange}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="INACTIVE">INACTIVE</option>
              </Form.Select>
            </Form.Group>
            <div className="text-end">
              <Button variant="secondary" onClick={() => setShowForm(false)} className="me-2">Cancel</Button>
              <Button type="submit" variant="primary">{editingUser ? 'Update' : 'Create'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CallCenterUserList;
