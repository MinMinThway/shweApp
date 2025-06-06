import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Spinner, Alert, Form } from 'react-bootstrap';

import Card from '../../components/Card/MainCard';
import { fetchContents } from '../../api/ContentApi';

const Artical = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchString, setSearchString] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  const loadNews = async (pageNumber = 0, search = '') => {
    try {
      const data = await fetchContents('INF', search, pageNumber, pageSize);
      setNews(data.content || []);
      setTotalPages(data.totalPages || 1);
      setError(null);
      setPage(data.pageable.pageNumber || 0);
    } catch (err) {
      setError('Failed to fetch news');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadNews(page, searchString);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchString(value);
    loadNews(0, value); // reset to first page on new search
  };

  const handlePrev = () => {
    if (page > 0) {
      loadNews(page - 1, searchString);
    }
  };

  const handleNext = () => {
    if (page < totalPages - 1) {
      loadNews(page + 1, searchString);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        Error: {error}
      </Alert>
    );
  }

  return (
    <React.Fragment>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control type="text" placeholder="Search news" value={searchString} onChange={handleSearchChange} />
        </Col>
        <Col md={6} className="text-end">
          <Button variant="primary" className="w-25">
            Add News
          </Button>
        </Col>
      </Row>

      <Row>
        {news.length === 0 && <p>No news found.</p>}
        {news.map((item, index) => (
          <Col key={index} md={6} lg={4} className="mb-4">
            <Card title={item.title || 'No Title'} isOption>
              <div className="mb-2">
                <strong>Body:</strong> {item.body || 'N/A'}
              </div>
              <div className="mb-2">
                <strong>Content Type:</strong> {item.contentType || 'N/A'}
              </div>
              <div className="mb-2">
                <strong>Publish Date:</strong> {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : 'N/A'}
              </div>
              {item.images && item.images.length > 0 && (
                <div className="mb-2">
                  <strong>Images:</strong>
                  <div className="mt-2">
                    {item.images.map((url, idx) => (
                      // eslint-disable-next-line jsx-a11y/img-redundant-alt
                      <img
                        key={idx}
                        src={url}
                        alt={`News ${index} image ${idx}`}
                        className="img-fluid mb-2 rounded"
                        style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination Controls */}
      <Row className="mt-3">
        <Col className="d-flex justify-content-center gap-3">
          <Button variant="secondary" onClick={handlePrev} disabled={page === 0}>
            Previous
          </Button>
          <div className="align-self-center">
            Page {page + 1} of {totalPages}
          </div>
          <Button variant="secondary" onClick={handleNext} disabled={page >= totalPages - 1}>
            Next
          </Button>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Artical;
