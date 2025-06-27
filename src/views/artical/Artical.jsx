import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Spinner, Alert, Form, Modal } from 'react-bootstrap';
import Card from '../../components/Card/MainCard';
import { fetchContents, createContent, deleteContent, updateContent } from '../../api/ContentApi';

const Artical = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchString, setSearchString] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  const [showModal, setShowModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formImages, setFormImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [editId, setEditId] = useState(null);

  const loadNews = async (pageNumber = 0, search = '') => {
    setLoading(true);
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
    loadNews(page, searchString);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchString(value);
    loadNews(0, value);
  };

  const handlePrev = () => {
    if (page > 0) loadNews(page - 1, searchString);
  };

  const handleNext = () => {
    if (page < totalPages - 1) loadNews(page + 1, searchString);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    try {
      await deleteContent(id);
      loadNews(0, searchString);
    } catch (err) {
      alert('Failed to delete content');
      console.error(err);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditId(item.id);
      setFormTitle(item.title);
      setFormBody(item.body);
      setExistingImages(item.images || []);
    } else {
      setEditId(null);
      setFormTitle('');
      setFormBody('');
      setExistingImages([]);
    }
    setFormImages([]);
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleFileChange = (e) => {
    setFormImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim()) return setFormError('Title is required');
    if (!formBody.trim()) return setFormError('Body is required');

    setFormSubmitting(true);
    try {
      const payload = {
        title: formTitle,
        body: formBody,
        contentType: 'INF',
        imageFiles: formImages
      };

      if (editId) {
        await updateContent(editId, payload);
      } else {
        await createContent(payload);
      }

      closeModal();
      loadNews(0, searchString);
    } catch (err) {
      setFormError(editId ? 'Failed to update content' : 'Failed to create content');
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control type="text" placeholder="Search content..." value={searchString} onChange={handleSearchChange} />
        </Col>
        <Col md={6} className="text-end">
          <Button variant="primary" className="w-25" onClick={() => openModal()}>
            Add New
          </Button>
        </Col>
      </Row>

      <Row>
        {news.length === 0 && <p>No content found.</p>}
        {news.map((item, index) => (
          <Col key={index} md={6} lg={4} className="mb-4">
            <Card title={item.title || 'No Title'} isOption>
              <div className="mb-2"><strong>Body:</strong> {item.body || 'N/A'}</div>
              <div className="mb-2"><strong>Content Type:</strong> {item.contentType || 'N/A'}</div>
              <div className="mb-2">
                <strong>Publish Date:</strong> {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : 'N/A'}
              </div>
              {item.images && item.images.length > 0 && (
                <div className="mb-2">
                  <strong>Images:</strong>
                  <div className="mt-2">
                    {item.images.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Image ${idx}`}
                        className="img-fluid mb-2 rounded"
                        style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="d-flex justify-content-between">
                <Button variant="warning" size="sm" onClick={() => openModal(item)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-3">
        <Col className="d-flex justify-content-center gap-3">
          <Button variant="secondary" onClick={handlePrev} disabled={page === 0}>Previous</Button>
          <div className="align-self-center">Page {page + 1} of {totalPages}</div>
          <Button variant="secondary" onClick={handleNext} disabled={page >= totalPages - 1}>Next</Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={closeModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Content' : 'Add New Content'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}

            <Form.Group className="mb-3" controlId="contentTitle">
              <Form.Label>Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="contentBody">
              <Form.Label>Body <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter body"
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="contentImages">
              <Form.Label>Images (optional)</Form.Label>
              <Form.Control type="file" multiple accept="image/*" onChange={handleFileChange} />
            </Form.Group>

            {existingImages.length > 0 && (
              <div className="mb-3">
                <Form.Label>Current Images</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {existingImages.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Existing image ${idx}`}
                      className="img-thumbnail"
                      style={{ height: '100px', objectFit: 'cover' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal} disabled={formSubmitting}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={formSubmitting}>
              {formSubmitting ? 'Saving...' : editId ? 'Update' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Artical;
