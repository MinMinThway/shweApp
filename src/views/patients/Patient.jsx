import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Form, Pagination, Modal } from 'react-bootstrap';

const PatientTable = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editPatient, setEditPatient] = useState({
    id: null,
    patient_name: '',
    gender: '',
    age: '',
    work: '',
    body_weight: '',
    height: ''
  });

  const sampleData = [
    { id: 1, patient_name: 'John Doe', gender: 'Male', age: 30, work: 'Engineer', body_weight: 70, height: 175 },
    { id: 2, patient_name: 'Jane Smith', gender: 'Female', age: 28, work: 'Designer', body_weight: 60, height: 165 }
  ];

  useEffect(() => {
    setPatients(sampleData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (patient) => {
    setEditPatient(patient);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editPatient.id) {
      setPatients((prev) => prev.map(p => p.id === editPatient.id ? editPatient : p));
    } else {
      setPatients((prev) => [...prev, { ...editPatient, id: Date.now() }]);
    }
    setShowModal(false);
    setEditPatient({ id: null, patient_name: '', gender: '', age: '', work: '', body_weight: '', height: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure to delete this patient?')) {
      setPatients((prev) => prev.filter(p => p.id !== id));
    }
  };

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Patient Table</h5>
            <Button variant="success" onClick={() => setShowModal(true)}>+ Add Patient</Button>
          </Card.Header>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Work</th>
                  <th>Weight (kg)</th>
                  <th>Height (cm)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.patient_name}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.age}</td>
                    <td>{patient.work}</td>
                    <td>{patient.body_weight}</td>
                    <td>{patient.height}</td>
                    <td>
                      <Button variant="info" size="sm" className="me-2" onClick={() => handleEdit(patient)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(patient.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editPatient.id ? 'Edit' : 'Add'} Patient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Patient Name</Form.Label>
              <Form.Control name="patient_name" value={editPatient.patient_name} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Control name="gender" value={editPatient.gender} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control name="age" value={editPatient.age} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Work</Form.Label>
              <Form.Control name="work" value={editPatient.work} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Body Weight</Form.Label>
              <Form.Control name="body_weight" value={editPatient.body_weight} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Height</Form.Label>
              <Form.Control name="height" value={editPatient.height} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default PatientTable;