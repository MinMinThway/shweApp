import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Form, Button, Modal, Alert } from "react-bootstrap";
import { fetchExchangeRates, createExchangeRate, updateExchangeRate, deleteExchangeRate } from "api/exchangeApi";

const ExchangeRates = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [newRate, setNewRate] = useState({ date: '', time: '', buyMmk: '', sellMmk: '' });
  const [formError, setFormError] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [editFormError, setEditFormError] = useState(null);
  const [editFormSubmitting, setEditFormSubmitting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rateToDelete, setRateToDelete] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ success: '', error: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const loadRates = async (start, end, page = 0) => {
    try {
      setLoading(true);
      const data = await fetchExchangeRates(start, end, page, pageSize);

      const exchangeRates = data?.exchangeRates || data?.content || data?.data || [];
      const total = data?.totalPages || 1;

      setRates(exchangeRates);
      setTotalPages(total);
      setError(null);
    } catch (err) {
      console.error('API Error:', err);
      let errorMessage = 'Failed to fetch exchange rates';
      if (err.response?.data?.message) errorMessage = err.response.data.message;
      else if (err.message) errorMessage = err.message;

      setError(errorMessage);
      setRates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    loadRates(today, today, 0);
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    loadRates(startDate, endDate, 0);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      loadRates(startDate, endDate, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      loadRates(startDate, endDate, newPage);
    }
  };

  const handleCreateRate = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);

    try {
      await createExchangeRate({
        ...newRate,
        buyMmk: parseFloat(newRate.buyMmk),
        sellMmk: parseFloat(newRate.sellMmk)
      });

      setShowModal(false);
      setNewRate({ date: '', time: '', buyMmk: '', sellMmk: '' });
      loadRates(startDate, endDate, currentPage);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create exchange rate');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditClick = (rate) => {
    setSelectedRate({ ...rate });
    setEditFormError(null);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditFormError(null);
    setEditFormSubmitting(true);

    try {
      await updateExchangeRate(selectedRate.id, {
        date: selectedRate.date,
        time: selectedRate.time,
        buyMmk: parseFloat(selectedRate.buyMmk),
        sellMmk: parseFloat(selectedRate.sellMmk),
      });

      setShowEditModal(false);
      setSelectedRate(null);
      loadRates(startDate, endDate, currentPage);
    } catch (err) {
      setEditFormError(err.response?.data?.message || 'Failed to update exchange rate');
    } finally {
      setEditFormSubmitting(false);
    }
  };

  const handleDeleteClick = (rate) => {
    setRateToDelete(rate);
    setDeleteStatus({ success: '', error: '' });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!rateToDelete) return;

    setIsDeleting(true);
    try {
      await deleteExchangeRate(rateToDelete.id);
      setDeleteStatus({ success: 'Exchange rate deleted successfully!', error: '' });
      setShowDeleteModal(false);
      setRateToDelete(null);
      loadRates(startDate, endDate, currentPage);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete exchange rate';
      setDeleteStatus({ success: '', error: errorMsg });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title as="h5">Exchange Rates</Card.Title>
              <Button variant="success" onClick={() => setShowModal(true)}>Create</Button>
            </Card.Header>
            <Card.Body>
              <Form className="mb-3" onSubmit={handleFilter}>
                <Row>
                  <Col md={4}>
                    <Form.Group controlId="startDate">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="endDate">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button type="submit" variant="primary" className="w-100">
                      Apply Filter
                    </Button>
                  </Col>
                </Row>
              </Form>

              {deleteStatus.success && (
                <Alert variant="success">{deleteStatus.success}</Alert>
              )}

              {loading ? (
                <div>Loading...</div>
              ) : error ? (
                <div className="text-danger">{error}</div>
              ) : (
                <>
                  <Table responsive className="table-striped">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Buy MMK</th>
                        <th>Sell MMK</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rates.map((rate, index) => (
                        <tr key={index}>
                          <td>{rate.date}</td>
                          <td>{rate.time}</td>
                          <td>{rate.buyMmk}</td>
                          <td>{rate.sellMmk}</td>
                          <td>
                            <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(rate)}>Edit</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteClick(rate)}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button
                      variant="secondary"
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <span>Page {currentPage + 1} of {totalPages}</span>
                    <Button
                      variant="secondary"
                      onClick={handleNextPage}
                      disabled={currentPage + 1 >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Exchange Rate</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateRate}>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            <Form.Group className="mb-3" controlId="newRateDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newRate.date}
                onChange={(e) => setNewRate({ ...newRate, date: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newRateTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={newRate.time}
                onChange={(e) => setNewRate({ ...newRate, time: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newRateBuy">
              <Form.Label>Buy MMK</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={newRate.buyMmk}
                onChange={(e) => setNewRate({ ...newRate, buyMmk: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newRateSell">
              <Form.Label>Sell MMK</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={newRate.sellMmk}
                onChange={(e) => setNewRate({ ...newRate, sellMmk: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={formSubmitting}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={formSubmitting}>
              {formSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Exchange Rate</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            {editFormError && <Alert variant="danger">{editFormError}</Alert>}
            <Form.Group className="mb-3" controlId="editRateDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={selectedRate?.date || ''}
                onChange={(e) => setSelectedRate({ ...selectedRate, date: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editRateTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={selectedRate?.time || ''}
                onChange={(e) => setSelectedRate({ ...selectedRate, time: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editRateBuy">
              <Form.Label>Buy MMK</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={selectedRate?.buyMmk || ''}
                onChange={(e) => setSelectedRate({ ...selectedRate, buyMmk: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editRateSell">
              <Form.Label>Sell MMK</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={selectedRate?.sellMmk || ''}
                onChange={(e) => setSelectedRate({ ...selectedRate, sellMmk: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={editFormSubmitting}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={editFormSubmitting}>
              {editFormSubmitting ? 'Saving...' : 'Update'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteStatus.error && <Alert variant="danger">{deleteStatus.error}</Alert>}
          <p>Are you sure you want to delete the exchange rate on <strong>{rateToDelete?.date}</strong> at <strong>{rateToDelete?.time}</strong>?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default ExchangeRates;
