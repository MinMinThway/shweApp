import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tabs, Tab, Button, Pagination, Modal, Form } from 'react-bootstrap';
import {
  fetchOrders,
  fetchOrderById,
  deleteOrderById,
  updateOrderStatus,
  confirmOrder,
  markOrderAsIncomplete,
  finishOrder
} from '../../api/orderApi';

const statusFilters = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  INCOMPLETE: 'Incomplete',
  CANCELLED: 'Cancelled',
  FINISHED: 'Finished'
};

const DashDefault = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [searchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [rejectNotes, setRejectNotes] = useState('');
  const [reportImage, setReportImage] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    try {
      if (selectedStatus === 'CONFIRMED') {
        await confirmOrder(selectedOrder.id);
      } else if (selectedStatus === 'INCOMPLETE') {
        if (!rejectNotes.trim()) {
          alert('Reject note is required for marking incomplete.');
          return;
        }
        await markOrderAsIncomplete(selectedOrder.id, rejectNotes);
      } else if (selectedStatus === 'FINISHED') {
        if (!reportImage) {
          alert('Please upload a report image.');
          return;
        }
        await finishOrder(selectedOrder.id, reportImage);
      } else {
        await updateOrderStatus(selectedOrder.id, selectedStatus);
      }

      setShowDialog(false);
      fetchOrdersData();
    } catch (err) {
      console.error('Failed to update order status', err);
      alert('Something went wrong.');
    }
  };

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      const response = await fetchOrders(currentPage, pageSize, searchTerm, activeTab);
      setOrders(Array.isArray(response.orders) ? response.orders : []);
      setTotalPages(response.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (orderId) => {
    try {
      const order = await fetchOrderById(orderId);
      setSelectedOrder(order);
      setSelectedStatus(order.status);
      setShowDialog(true);
    } catch (err) {
      console.error('Failed to load order details', err);
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
      FINISHED: 'bg-primary'
    };
    return statusColors[status] || 'bg-secondary';
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    for (let page = 0; page < totalPages; page++) {
      items.push(
        <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
          {page + 1}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="mt-3">
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} />
        {items}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1} />
      </Pagination>
    );
  };

  const handleDelete = async () => {
    if (!selectedOrder) return;
    try {
      await deleteOrderById(selectedOrder.id);
      setShowDialog(false);
      fetchOrdersData();
    } catch (err) {
      console.error('Failed to delete order', err);
    }
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      await updateOrderStatus(selectedOrder.id, selectedStatus);
      setShowDialog(false);
      fetchOrdersData();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

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
                          <th>Submit Date</th>
                          <th>Customer Name</th>
                          <th>Passport Name</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr key={index} onClick={() => handleRowClick(order.id)} style={{ cursor: 'pointer' }}>
                            <td>{order.orderNumber}</td>
                            <td>{order.orderType}</td>
                            <td>{order.date || order.submiDate}</td>
                            <td>{order.name || order.name}</td>
                            <td>{order.nameOnPassport || order.nameOnPassport}</td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                {statusFilters[order.status] || order.status}
                              </span>
                            </td>
                            <td>
                              <Button variant="outline-info" size="sm">
                                View
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

      {/* ===== Modal Dialog for Order Detail ===== */}
      <Modal show={showDialog} onHide={() => setShowDialog(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <>
              <p>
                <strong>Name:</strong> {selectedOrder.nameOnPassport}
              </p>
              <p>
                <strong>Passport Number:</strong> {selectedOrder.passportNumber}
              </p>
              <p>
                <strong>Visa Type:</strong> {selectedOrder.visaType}
              </p>
              <p>
                <strong>City:</strong> {selectedOrder.city}
              </p>
              <p>
                <strong>Current Status:</strong>{' '}
                <span className={`badge ${getStatusBadgeClass(selectedOrder.status)}`}>{statusFilters[selectedOrder.status]}</span>
              </p>

              {/* === Status Selector === */}
              <Form.Group controlId="statusSelect" className="my-3">
                <Form.Label>Change Status</Form.Label>
                <Form.Select value={selectedStatus} onChange={handleStatusChange}>
                  {Object.entries(statusFilters).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* === Reject Note for INCOMPLETE === */}
              {selectedStatus === 'INCOMPLETE' && (
                <Form.Group controlId="rejectNotes" className="my-3">
                  <Form.Label>❌ Reject Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={rejectNotes}
                    onChange={(e) => setRejectNotes(e.target.value)}
                    placeholder="Enter reason for marking as incomplete"
                  />
                </Form.Group>
              )}

              {/* === File Upload for FINISHED === */}
              {selectedStatus === 'FINISHED' && (
                <Form.Group controlId="reportImage" className="my-3">
                  <Form.Label>📄 Upload 90 Days Report</Form.Label>
                  <Form.Control type="file" onChange={(e) => setReportImage(e.target.files[0])} accept="image/*" />
                </Form.Group>
              )}

              {/* === Submit Button === */}
              <Button variant="primary" onClick={handleUpdateOrderStatus}>
                Update Status
              </Button>
            </>
          ) : (
            <p>Loading order...</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDialog(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashDefault;
