import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Tabs,
  Tab,
  Button,
  Pagination,
} from 'react-bootstrap';
import { fetchOrders } from '../../api/orderApi';

const statusFilters = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  INCOMPLETE: 'Incomplete',
  CANCELLED: 'Cancelled',
  FINISHED: 'Finished',
};

const DashDefault = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('PENDING'); // ✅ Use uppercase
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      const response = await fetchOrders(currentPage, pageSize, searchTerm, activeTab);
      const orderData = Array.isArray(response.orders) ? response.orders : [];

      setOrders(orderData); // ✅ No need to filter again
      setTotalPages(response.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, [currentPage, searchTerm, activeTab]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusColors = {
      PENDING: 'bg-warning',
      CONFIRMED: 'bg-success',
      INCOMPLETE: 'bg-info',
      CANCELLED: 'bg-danger',
      FINISHED: 'bg-primary',
    };
    return statusColors[status] || 'bg-secondary';
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    for (let page = 0; page < totalPages; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page + 1}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="mt-3">
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        />
        {items}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        />
      </Pagination>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Order List</Card.Title>
            </Card.Header>
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(key) => {
                  setActiveTab(key);
                  setCurrentPage(0);
                }}
              >
                {Object.entries(statusFilters).map(([key, label]) => (
                  <Tab key={key} eventKey={key} title={label}>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Order Number</th>
                          <th>Order Type</th>
                          <th>Date</th>
                          <th>Customer Name</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr key={index}>
                            <td>{order.orderNumber}</td>
                            <td>{order.orderType}</td>
                            <td>{order.date}</td>
                            <td>{order.name}</td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                {statusFilters[order.status] || order.status}
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
                    {renderPagination()}
                  </Tab>
                ))}
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashDefault;
