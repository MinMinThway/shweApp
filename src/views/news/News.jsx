import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

import Card from '../../components/Card/MainCard';
import axios from 'axios';

const SamplePage = () => {
  const [news, SetNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/contents/filter-content?searchString=travel&contentType=NEWS&page=0&size=10');
        SetNews(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch news');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return <div>Loading...</div>
  if (error) return <div>Erros : {error}</div>

  return (
    <React.Fragment>
      <Row>
        <Button variant="primary w-25 m-10 float-end">Add User</Button>
      </Row>
      <Row>
        {news.map((newData, index) => {
          <Card title={newData.title} isOption>
            <div className="mb-3">
              <strong>Body:</strong> {newData.body}
            </div>
            <div className="mb-3">
              <strong>Content Type:</strong> {newData.contentType}
            </div>
            <div className="mb-3">
              <strong>Publish Date:</strong> {newData.publishDate}
            </div>
            {newData.imageUrls && newData.imageUrls.length > 0 && (
              <div className="mb-3">
                <strong>Images:</strong>
                <div className="mt-2">
                  {newData.imageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`News ${index} image ${idx}`}
                      className="img-fluid mb-2"
                      style={{ maxWidth: '100%' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </Card>
        })}
      </Row>
    </React.Fragment>
  );
};

export default SamplePage;
