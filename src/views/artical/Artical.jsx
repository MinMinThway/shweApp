import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';

import Card from '../../components/Card/MainCard';

const Artical = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/user?searchString=""&contentType="INF"');
        setArticles(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <React.Fragment>
      <Row>
        <Button variant="primary w-25 m-10 float-end">Add Article</Button>
      </Row>
      <Row>
        {articles.map((article, index) => (
          <Col key={index} className="mb-4">
            <Card title={article.title} isOption>
              <div className="mb-3">
                <strong>Body:</strong> {article.body}
              </div>
              <div className="mb-3">
                <strong>Content Type:</strong> {article.contentType}
              </div>
              <div className="mb-3">
                <strong>Publish Date:</strong> {article.publishDate}
              </div>
              {article.imageUrls && article.imageUrls.length > 0 && (
                <div className="mb-3">
                  <strong>Images:</strong>
                  <div className="mt-2">
                    {article.imageUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Article ${index} image ${idx}`}
                        className="img-fluid mb-2"
                        style={{ maxWidth: '100%' }}
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

export default Artical;
