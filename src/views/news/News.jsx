import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Spinner, Alert } from 'react-bootstrap';

import Card from '../../components/Card/MainCard';
import { fetchContents } from '../../api/ContentApi';

const SamplePage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchContents('INF', '', 0, 10);
        setNews(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch news');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

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
        <Col className="text-end">
          <Button variant="primary" className="w-25">
            Add News
          </Button>
        </Col>
      </Row>

      <Row>
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
                <strong>Publish Date:</strong>{' '}
                {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : 'N/A'}
              </div>
              {item.imageUrls && item.imageUrls.length > 0 && (
                <div className="mb-2">
                  <strong>Images:</strong>
                  <div className="mt-2">
                    {item.imageUrls.map((url, idx) => (
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
    </React.Fragment>
  );
};

export default SamplePage;
