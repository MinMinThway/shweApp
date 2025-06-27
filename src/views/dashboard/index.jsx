import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tabs, Tab, Button, Pagination, Modal, Form } from 'react-bootstrap';

// Replace these with your actual API calls:
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

// Helper to download image from URL
const downloadImage = (url, filename) => {
  fetch(url, {
    mode: 'cors'
  })
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename || 'download.jpg';
      link.click();
      window.URL.revokeObjectURL(link.href);
    })
    .catch(() => alert('Failed to download image.'));
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

  useEffect(() => {
    fetchOrdersData();
  }, [currentPage, searchTerm, activeTab]);

  const handleRowClick = async (orderId) => {
    try {
      const order = await fetchOrderById(orderId);
      setSelectedOrder(order);
      setSelectedStatus(order.orderStatus || order.status);
      setRejectNotes('');
      setReportImage(null);
      setShowDialog(true);
    } catch (err) {
      console.error('Failed to load order details', err);
    }
  };

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

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
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
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Order Number</th>
                          <th>Order Type</th>
                          <th>Submit Date</th>
                          <th>Customer Name</th>
                          <th>Passport Name</th>
                          <th>Passport Number</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr key={index} onClick={() => handleRowClick(order.id)} style={{ cursor: 'pointer' }}>
                            <td>{order.orderNumber}</td>
                            <td>{order.orderType}</td>
                            <td>{order.submiDate || order.date}</td>
                            <td>{order.name || order.customerName || '-'}</td>
                            <td>{order.nameOnPassport || '-'}</td>
                            <td>{order.passportNumber || '-'}</td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(order.orderStatus || order.status)}`}>
                                {statusFilters[order.orderStatus || order.status] || order.orderStatus || order.status}
                              </span>
                            </td>
                            <td>
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRowClick(order.id);
                                }}
                              >
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

      {/* Modal for Order Detail */}
      <Modal show={showDialog} onHide={() => setShowDialog(false)} size="lg" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Order Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <>
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Order Number:</strong> {selectedOrder.orderNumber}
                  </p>
                  <p>
                    <strong>User ID:</strong> {selectedOrder.userId}
                  </p>
                  <p>
                    <strong>Name On Passport:</strong> {selectedOrder.nameOnPassport}
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
                    <strong>Next Due Date:</strong> {selectedOrder.nextDueDate}
                  </p>
                  <p>
                    <strong>Payment Status:</strong> {selectedOrder.paymentStatus}
                  </p>
                  <p>
                    <strong>Order Status:</strong>{' '}
                    <span className={`badge ${getStatusBadgeClass(selectedOrder.orderStatus)}`}>
                      {statusFilters[selectedOrder.orderStatus] || selectedOrder.orderStatus}
                    </span>
                  </p>
                  <p>
                    <strong>Order Type:</strong> {selectedOrder.orderType}
                  </p>
                  <p>
                    <strong>Submit Date:</strong> {selectedOrder.submiDate}
                  </p>
                  <p>
                    <strong>Confirm Date:</strong> {selectedOrder.comfirmDate || '-'}
                  </p>
                  <p>
                    <strong>Total Price:</strong> ${selectedOrder.totalPrice}
                  </p>
                  <p>
                    <strong>Notes:</strong> {selectedOrder.notes || '-'}
                  </p>
                </Col>
                <Col md={6}>
                  {/* Images */}
                  <div>
                    <h5>Documents & Photos</h5>

                    {selectedOrder.passportVisaPageUrl && (
                      <div className="mb-3">
                        <p>
                          <strong>Passport Visa Page:</strong>
                        </p>
                        <img
                          src={selectedOrder.passportVisaPageUrl}
                          alt="Passport Visa Page"
                          style={{ maxWidth: '100%', maxHeight: '200px' }}
                        />
                        <br />
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="mt-1"
                          onClick={() => downloadImage(selectedOrder.passportVisaPageUrl, 'passportVisaPage.jpg')}
                        >
                          Download
                        </Button>
                      </div>
                    )}

                    {selectedOrder.passportBioPageUrl && (
                      <div className="mb-3">
                        <p>
                          <strong>Passport Bio Page:</strong>
                        </p>
                        <img
                          src={selectedOrder.passportBioPageUrl}
                          alt="Passport Bio Page"
                          style={{ maxWidth: '100%', maxHeight: '200px' }}
                        />
                        <br />
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="mt-1"
                          onClick={() => downloadImage(selectedOrder.passportBioPageUrl, 'passportBioPage.jpg')}
                        >
                          Download
                        </Button>
                      </div>
                    )}

                    {selectedOrder.oldNinetyDaysReportUrl && (
                      <div className="mb-3">
                        <p>
                          <strong>Old 90 Days Report:</strong>
                        </p>
                        <img
                          src={selectedOrder.oldNinetyDaysReportUrl}
                          alt="Old 90 Days Report"
                          style={{ maxWidth: '100%', maxHeight: '200px' }}
                        />
                        <br />
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="mt-1"
                          onClick={() => downloadImage(selectedOrder.oldNinetyDaysReportUrl, 'old90DaysReport.jpg')}
                        >
                          Download
                        </Button>
                      </div>
                    )}

                    {selectedOrder.newNinetyDaysReportUrl && (
                      <div className="mb-3">
                        <p>
                          <strong>New 90 Days Report:</strong>
                        </p>
                        <img
                          src={selectedOrder.newNinetyDaysReportUrl}
                          alt="New 90 Days Report"
                          style={{ maxWidth: '100%', maxHeight: '200px' }}
                        />
                        <br />
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="mt-1"
                          onClick={() => downloadImage(selectedOrder.newNinetyDaysReportUrl, 'new90DaysReport.jpg')}
                        >
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

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
