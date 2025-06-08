import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Form, Button } from "react-bootstrap";
import { fetchExchangeRates } from "api/exchangeApi";

const ExchangeRates = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

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

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Exchange Rates</Card.Title>
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
                      </tr>
                    </thead>
                    <tbody>
                      {rates.map((rate, index) => (
                        <tr key={index}>
                          <td>{rate.date}</td>
                          <td>{rate.time}</td>
                          <td>{rate.buyMmk}</td>
                          <td>{rate.sellMmk}</td>
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
                    <span>
                      Page {currentPage + 1} of {totalPages}
                    </span>
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
    </React.Fragment>
  );
};

export default ExchangeRates;
