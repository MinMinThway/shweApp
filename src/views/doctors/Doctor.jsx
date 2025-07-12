import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Form, Pagination, Modal, Image } from 'react-bootstrap';
import { fetchUsers, updateUser, deleteUser } from '../../api/userApi';

const DoctorTable = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const emptyDoctor = {
    id: null,
    full_name: '',
    specialization: '',
    email: '',
    phone_number: '',
    consulting_days: '',
    consulting_hours: '',
    hourly_rate: '',
    experience_years: '',
    biography: '',
    profile_picture_file: null,
    status: 'ACTIVE'
  };

  const [editDoctor, setEditDoctor] = useState(emptyDoctor);
  const [saving, setSaving] = useState(false);

  const loadDoctors = async (page = 0, search = '') => {
    try {
      const data = await fetchUsers(page, pageSize, search);
      setDoctors(data.users || []);
      setCurrentPage(data.currentPage || 0);
      setTotalPages(data.totalPages || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch doctors');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadDoctors();
  }, []);

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteUser(id);
        await loadDoctors(currentPage, searchString);
        alert('Doctor deleted successfully');
      } catch (err) {
        console.error('Failed to delete doctor:', err);
        alert('Failed to delete doctor');
      }
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchString(value);
    loadDoctors(0, value);
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      loadDoctors(page, searchString);
    }
  };

  const handleEditClick = (doctor) => {
    setEditDoctor({ ...doctor, profile_picture_file: null });
    setShowEditModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setShowCreateModal(false);
    setEditDoctor(emptyDoctor);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditDoctor((prev) => ({ ...prev, profile_picture_file: file }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(editDoctor).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });
      await updateUser(formData);
      handleModalClose();
      await loadDoctors(currentPage, searchString);
    } catch (err) {
      console.error('Failed to save doctor:', err);
      alert('Failed to save doctor');
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
              <Card.Title as="h5">Doctors</Card.Title>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Search by name or phone"
                  style={{ maxWidth: '250px' }}
                  value={searchString}
                  onChange={handleSearchChange}
                />
                <Button variant="success" onClick={() => setShowCreateModal(true)}>+ Add Doctor</Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover className="align-middle">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.length === 0 ? (
                    <tr><td colSpan="7" className="text-center">No doctors found</td></tr>
                  ) : (
                    doctors.map((doc, index) => (
                      <tr key={doc.id || index}>
                        <td>
                          {doc.profile_picture_url ? (
                            <Image src={doc.profile_picture_url} roundedCircle width={50} height={50} alt="Profile" />
                          ) : (
                            <span>No Image</span>
                          )}
                        </td>
                        <td>{doc.full_name}</td>
                        <td>{doc.specialization}</td>
                        <td>{doc.phone_number}</td>
                        <td>{doc.email}</td>
                        <td>
                          <span className={`badge ${doc.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>{doc.status}</span>
                        </td>
                        <td>
                          <Button size="sm" variant="info" className="me-2" onClick={() => handleEditClick(doc)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleDeleteDoctor(doc.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

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

      {/* Edit/Create Modal */}
      <Modal show={showEditModal || showCreateModal} onHide={handleModalClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editDoctor.id ? 'Edit Doctor' : 'Add Doctor'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form encType="multipart/form-data">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control name="full_name" value={editDoctor.full_name} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Specialization</Form.Label>
                  <Form.Control name="specialization" value={editDoctor.specialization} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control name="email" value={editDoctor.email} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control name="phone_number" value={editDoctor.phone_number} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Consulting Days</Form.Label>
                  <Form.Control name="consulting_days" value={editDoctor.consulting_days} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Consulting Hours</Form.Label>
                  <Form.Control name="consulting_hours" value={editDoctor.consulting_hours} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Hourly Rate</Form.Label>
                  <Form.Control name="hourly_rate" type="number" value={editDoctor.hourly_rate} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Experience (Years)</Form.Label>
                  <Form.Control name="experience_years" type="number" value={editDoctor.experience_years} onChange={handleInputChange} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Biography</Form.Label>
              <Form.Control as="textarea" rows={3} name="biography" value={editDoctor.biography} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control type="file" name="profile_picture_file" onChange={handleFileChange} accept="image/*" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={editDoctor.status} onChange={handleInputChange}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose} disabled={saving}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveChanges} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DoctorTable;
