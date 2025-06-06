import React from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JWTLogin = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      const url = `${API_BASE_URL}api/v1/auth/login`;
      console.log("Login POST URL:", url);
  
      const response = await axios.post(url, {
        phoneNumber: values.phoneNumber,
        password: values.password
      });
  
      console.log("Login response:", response.data);
  
      const { token, refreshToken, user } = response.data;
  
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
  
      setStatus({ success: true });
      setSubmitting(false);
  
      navigate('/');
    } catch (err) {
      console.error("Login error:", err);
  
      // More detailed error logging
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      } else if (err.request) {
        console.error("No response received, request made:", err.request);
      } else {
        console.error("Error setting up request:", err.message);
      }
  
      setStatus({ success: false });
      setErrors({ submit: err.response?.data || 'Login failed' });
      setSubmitting(false);
    }
  };
  

  return (
    <Formik
      initialValues={{
        phoneNumber: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        phoneNumber: Yup.string().required('Phone number is required'),
        password: Yup.string().required('Password is required')
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              className="form-control"
              name="phoneNumber"
              placeholder="Phone Number"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.phoneNumber}
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <small className="text-danger">{errors.phoneNumber}</small>
            )}
          </div>
          <div className="form-group mb-4">
            <input
              className="form-control"
              name="password"
              placeholder="Password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            {touched.password && errors.password && (
              <small className="text-danger">{errors.password}</small>
            )}
          </div>

          {errors.submit && (
            <Col sm={12}>
              <Alert variant="danger">{errors.submit}</Alert>
            </Col>
          )}

          <Row>
            <Col>
              <Button className="btn-block mb-4" variant="primary" disabled={isSubmitting} type="submit">
                Sign In
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
