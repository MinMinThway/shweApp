import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tabs, Tab, Button, Form, Pagination } from 'react-bootstrap';
import axios from 'axios';

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

  const fetchAgents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/call/agents?searchString=${searchTerm}&agentName=&page=${currentPage}&size=${pageSize}`
      );
      setAgents(response.data.content);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch agents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Call Center Agents</h2>
      
      {/* Search Bar */}
      <Row className="mb-3">
        <Col>
          <Form.Control 
            type="text" 
            placeholder="Search agents..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
      </Row>

      <Table responsive>
        <thead>
          <tr>
            <th onClick={() => handleSort('agentName')}>
              Agent Name {sortBy === 'agentName' && 
                (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('phoneNumber')}>
              Phone Number {sortBy === 'phoneNumber' && 
                (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('language')}>
              Language {sortBy === 'language' && 
                (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('currentCallCount')}>
              Current Calls {sortBy === 'currentCallCount' && 
                (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('lastOnlineAt')}>
              Last Online {sortBy === 'lastOnlineAt' && 
                (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('status')}>
              Status {sortBy === 'status' && 
                (sortDirection === 'asc' ? '↑' : '↓')}
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
                <span 
                  className={`badge ${
                    agent.status === 'ONLINE' ? 'bg-success' :
                    agent.status === 'OFFLINE' ? 'bg-danger' :
                    agent.status === 'BUSY' ? 'bg-warning' :
                    'bg-secondary'
                  }`}
                >
                  {agent.status}
                </span>
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
    </div>
  );
};

export default CallCenterAgentList;
