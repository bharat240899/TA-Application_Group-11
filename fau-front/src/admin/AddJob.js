import React, { useState } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { createJob } from './apiAdmin';

const AddJob = () => {
    // Destructure user and token from isAuthenticated
    const { user: { _id, fname }, token } = isAuthenticated();

    const [values, setValues] = useState({
        coursename: '',
        description: '',
        loading: false,
        error: '',
        createdJob: '',
        redirectToProfile: false,
        formData: new FormData(),
    });

    const {
        coursename,
        description,
        loading,
        error,
        createdJob,
        formData,
    } = values;

    const handleChange = (name) => (event) => {
        const value = event.target.value;
        const updatedFormData = new FormData();
        for (let [key, val] of formData.entries()) {
            updatedFormData.append(key, val);
        }
        updatedFormData.set(name, value);
        setValues({ ...values, error: '', formData: updatedFormData, [name]: value });
    };

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: '', loading: true });
    
        createJob(_id, token, formData)
            .then((data) => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false });
                    console.error('Error creating job:', data.error);
                } else {
                    setValues({
                        ...values,
                        coursename: '',
                        description: '',
                        loading: false,
                        createdJob: data.name,
                    });
                    console.log('Job created:', data);
                }
            })
            .catch((error) => {
                console.log('Network error:', error);
                setValues({ ...values, error: 'Network error', loading: false });
            });
    };

    const newPostForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Post a Job</h4>
            <div className="form-group">
                <label className="text-muted">Course Name</label>
                <input
                    onChange={handleChange('coursename')}
                    type="text"
                    className="form-control"
                    value={coursename}
                />
            </div>
          
    
            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea
                    onChange={handleChange('description')}
                    className="form-control"
                    value={description}
                />
            </div>
   
            
            <button className="btn btn-primary">Create Job</button>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdJob ? '' : 'none' }}>
            <h2>{createdJob} is created!</h2>
        </div>
    );

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    return (
        <Layout title="Add a new job" description={`Hello ${fname}, ready to add a new job?`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
    );
};

export default AddJob;
