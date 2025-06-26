import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Form, Pagination, Modal } from 'react-bootstrap';
import { fetchAgents as fetchAgentData, createAgent, deleteAgent } from 'api/callAgent'; // ✅ Use your existing API

const CallCenterAgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('agentName');
  const [sortDirection, setSortDirection] = useState('asc');

  // Create Modal States
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    agentName: '',
    phoneNumber: '',
    language: '',
    currentCallCount: 0,
    status: 'OFFLINE'
  });

  const fetchAgents = async () => {
    try {
      const data = await fetchAgentData(currentPage, pageSize, searchTerm, '');
      setAgents(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setError(null);
    } catch (err) {
      setError('Failed to fetch agents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAgents();
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // Form Handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'currentCallCount' ? Number(value) : value
    }));
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    try {
      await createAgent(formData);
      setShowForm(false);
      setFormData({ name: '', phoneNumber: '', language: '', currentCallCount: 0, status: 'OFFLINE' });
      fetchAgents();
    } catch (err) {
      console.error('Failed to create agent:', err);
      alert('Create agent failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;
  
    try {
      const success = await deleteAgent(id);
      if (success) {
        alert('Agent deleted successfully.');
        fetchAgents(); // Refresh list
      } else {
        alert('Failed to delete agent.');
      }
    } catch (err) {
      console.error('Error deleting agent:', err);
      alert('Error occurred while deleting agent.');
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Call Center Agents</h3>

      {/* Search & Create */}
      <Row className="mb-3">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col md={4} className="text-end">
          <Button variant="success" onClick={() => setShowForm(true)}>
            + Create New Agent
          </Button>
        </Col>
      </Row>

      {/* Agent Table */}
      <Table responsive>
        <thead>
          <tr>
            <th onClick={() => handleSort('agentName')}>
              Agent Name {sortBy === 'agentName' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('phoneNumber')}>
              Phone Number {sortBy === 'phoneNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('language')}>
              Language {sortBy === 'language' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('currentCallCount')}>
              Current Calls {sortBy === 'currentCallCount' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('lastOnlineAt')}>
              Last Online {sortBy === 'lastOnlineAt' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('status')}>
              Status {sortBy === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent, index) => (
            <tr key={index}>
              <td>{agent.agentName}</td>
              <td>{agent.phoneNumber}</td>
              <td>{agent.language}</td>
              <td>{agent.currentCallCount}</td>
              <td>{new Date(agent.lastOnlineAt).toLocaleString()}</td>
              <td>
                <span className={`badge ${
                  agent.status === 'ONLINE' ? 'bg-success' :
                  agent.status === 'OFFLINE' ? 'bg-danger' :
                  agent.status === 'BUSY' ? 'bg-warning' :
                  'bg-secondary'
                }`}>
                  {agent.status}
                </span>
              </td>
              <td>
                <Button variant="info" size="sm" className="me-2">
                  <i className="feather icon-edit" /> Edit
                </Button>
                {/* <Button variant="danger" size="sm" onClick={handleDelete}>
                  <i className="feather icon-trash-2" /> Delete
                </Button> */}
                <Button variant="danger" size="sm" onClick={() => handleDelete(agent.id)}>
                  <i className="feather icon-trash-2" /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
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

      {/* Create Agent Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Agent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateAgent}>
            <Form.Group className="mb-3">
              <Form.Label>Agent Name</Form.Label>
              <Form.Control type="text" name="agentName" value={formData.agentName} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Language</Form.Label>
              <Form.Control type="text" name="language" value={formData.language} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Current Call Count</Form.Label>
              <Form.Control type="number" name="currentCallCount" value={formData.currentCallCount} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleFormChange}>
                <option value="ONLINE">ONLINE</option>
                <option value="OFFLINE">OFFLINE</option>
                <option value="BUSY">BUSY</option>
              </Form.Select>
            </Form.Group>
            <div className="text-end">
              <Button variant="secondary" onClick={() => setShowForm(false)} className="me-2">Cancel</Button>
              <Button type="submit" variant="primary">Create</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CallCenterAgentList;
