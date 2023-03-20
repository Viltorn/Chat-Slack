import React, {
  useEffect,
  useContext,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import 'bootstrap';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import routes from '../routes.js';
import logo from '../assets/SignUp.png';
import authContext from '../contexts/authContext.js';
import { SignUpSchema } from '../utils/validation.js';

const SignUpForm = ({ notify }) => {
  const { t } = useTranslation();
  const inputEl = useRef();
  const navigate = useNavigate();
  const { logIn } = useContext(authContext);
  const [authFailed, setAuthFailed] = useState(false);

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      repeatPass: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const res = await axios.post(routes.signUpPath(), values);
        if (res.status === 201) {
          logIn(res.data);
          const { from } = { from: { pathname: '/' } };
          navigate(from);
        }
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 409) {
          setAuthFailed(true);
          inputEl.current.focus();
          return;
        }
        console.log(err);
        notify('error');
        throw Error('NetworkError');
      }
    },
    validationSchema: SignUpSchema,
    validateOnChange: false,
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={logo} className="rounded-circle" style={{ height: '200px', width: '200px' }} alt={t('Registration')} />
              </div>
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('Registration')}</h1>
                <fieldset disabled={formik.isSubmitting}>
                  <Form.Group className="form-floating mb-3">
                    <Form.Control
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      placeholder="username"
                      name="username"
                      id="username"
                      autoComplete="username"
                      isInvalid={(formik.errors.username
                        && formik.touched.username) || authFailed}
                      ref={inputEl}
                    />
                    <Form.Label htmlFor="username">{t('Username')}</Form.Label>
                    {formik.errors.username && formik.touched.username ? (
                      <div className="invalid-feedback">{t(`errors.${formik.errors.username}`)}</div>
                    ) : null}
                    {authFailed ? (
                      <Form.Control.Feedback type="invalid">{t('errors.Conflict')}</Form.Control.Feedback>
                    ) : null}
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange('password')}
                      onBlur={formik.handleBlur('password')}
                      value={formik.values.password}
                      placeholder="password"
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      isInvalid={formik.errors.password && formik.touched.password}
                    />
                    <Form.Label htmlFor="password">{t('Password')}</Form.Label>
                    {formik.touched.password && formik.errors.password ? (
                      <div className="invalid-feedback">{t(`errors.${formik.errors.password}`)}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.repeatPass}
                      placeholder="repeatpassword"
                      name="repeatPass"
                      id="repeatPass"
                      autoComplete="current-repeatpass"
                      isInvalid={formik.errors.repeatPass && formik.touched.repeatPass}
                    />
                    <Form.Label htmlFor="repeatPass">{t('PasswordConfirm')}</Form.Label>
                    {formik.touched.repeatPass && formik.errors.repeatPass ? (
                      <div className="invalid-feedback">{t(`errors.${formik.errors.repeatPass}`)}</div>
                    ) : null}
                  </Form.Group>
                  <Button type="submit" variant="outline-primary" className="w-100">{t('Registration')}</Button>
                </fieldset>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
