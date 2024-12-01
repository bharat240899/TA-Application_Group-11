import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { getPosting } from '../admin/apiAdmin';
import { createApplication } from './apiUser';

const Form = ({ match }) => {
    const { user, token } = isAuthenticated();
    const [errors, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [values, setValues] = useState({
        fname: '',
        lname: '',
        znumber: '',
        experience: '',
        relevant_courses: '',
        from: '',
        to: '',
        resume: '',
        submittedApplication: '',
        loading: false,
        error: '',
        success: false,
        redirectToProfile: false,
        formData: new FormData(),
    });

    const {
        fname,
        lname,
        znumber,
        experience,
        relevant_courses,
        from,
        to,
        resume,
        loading,
        error,
        formData,
    } = values;

    const init = jobId => {
        getPosting(jobId)
            .then(data => {
                if (data && data.error) {
                    setValues({ ...values, error: data.error });
                    setError(data.error);
                } else if (data) {
                    setValues({
                        ...values,
                        fname: data.fname,
                        lname: data.lname,
                        znumber: data.znumber,
                        experience: data.experience,
                        relevant_courses: data.relevant_courses,
                        from: data.from,
                        to: data.to,
                        resume: data.resume,
                        formData: new FormData(),
                    });
                    setError('');
                    setSuccess(true);
                }
            })
            .catch(error => {
                console.error('Error fetching job data:', error);
                setValues({ ...values, error: 'Error fetching job data', loading: false });
            });
    };

    useEffect(() => {
        init(match.params.userId);
    }, []);

    const handleChange = (name) => (event) => {
        const value = name === 'resume' ? event.target.files[0] : event.target.value;
        const updatedFormData = new FormData();
        for (let [key, val] of formData.entries()) {
            updatedFormData.append(key, val);
        }
        updatedFormData.set(name, value);
        setValues({ ...values, error: '', formData: updatedFormData, [name]: value });
    };

    const validateForm = () => {
        if (!fname || !lname || !znumber || !experience || !resume) {
            return 'All fields must be filled!';
        }
        if (experience === 'true' && (!relevant_courses || !from || !to)) {
            return 'Please fill in all experience-related fields!';
        }
        return '';
    };

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: '', loading: true });

        const error = validateForm();
        if (error) {
            setValues({ ...values, error, loading: false });
            return;
        }

        createApplication(match.params.jobId, user._id, token, formData)
            .then((data) => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false });
                } else {
                    setValues({
                        ...values,
                        fname: '',
                        lname: '',
                        znumber: '',
                        experience: '',
                        relevant_courses: '',
                        from: '',
                        to: '',
                        resume: '',
                        loading: false,
                        submittedApplication: data.name,
                    });
                    setSuccess(true);
                }
            })
            .catch((error) => {
                console.log('Network error:', error);
                setValues({ ...values, error: 'Network error', loading: false });
            });
    };

    const applicationForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Apply</h4>
            <div className="form-group">
                <label>First Name</label>
                <input
                    type="text"
                    onChange={handleChange('fname')}
                    value={fname}
                    className="form-control"
                    required
                />
            </div>

            <div className="form-group">
                <label>Last Name</label>
                <input
                    type="text"
                    onChange={handleChange('lname')}
                    value={lname}
                    className="form-control"
                    required
                />
            </div>

            <div className="form-group">
                <label>Z-number</label>
                <input
                    type="text"
                    onChange={handleChange('znumber')}
                    value={znumber}
                    className="form-control"
                    required
                />
            </div>

            <div className="form-group">
                <label>Experience</label>
                <div className="form-check form-check-inline">
                    <input
                        type="radio"
                        onChange={handleChange('experience')}
                        checked={experience === 'true'}
                        value="true"
                        className="form-check-input"
                    />
                    <label className="form-check-label mr-3">Yes</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        type="radio"
                        onChange={handleChange('experience')}
                        checked={experience === 'false'}
                        value="false"
                        className="form-check-input"
                        required
                    />
                    <label className="form-check-label">No</label>
                </div>
            </div>

            {experience === 'true' && (
                <>
                    <div className="form-group">
                        <label>Relevant Courses</label>
                        <textarea
                            onChange={handleChange('relevant_courses')}
                            value={relevant_courses}
                            className="form-control"
                            placeholder="Please input the courses that are relevant to this course"
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>From</label>
                        <input
                            type="date"
                            onChange={handleChange('from')}
                            value={from}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label>To</label>
                        <input
                            type="date"
                            onChange={handleChange('to')}
                            value={to}
                            className="form-control"
                        />
                    </div>
                </>
            )}

            <div className="form-group">
                <label>Resume</label>
                <input
                    type="file"
                    onChange={handleChange('resume')}
                    accept=".pdf, .doc, .docx"
                    className="form-control-file"
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">
                Submit Application
            </button>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => {
        if (success) {
            return <Redirect to="/form/success" />;
        }
    };

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    return (
        <Layout title="Apply for a Job" description={`Apply for the courses that match with your skills and expertise.`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {applicationForm()}
                </div>
            </div>
        </Layout>
    );
};

export default Form;
