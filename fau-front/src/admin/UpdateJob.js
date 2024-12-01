import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link, Redirect } from 'react-router-dom';
import { getPosting, getCategories, updatePostings } from './apiAdmin';

const UpdateJob = ({ match }) => {
    const { user, token } = isAuthenticated();
    const [errors,setError] =useState(false);
    const [success,setSuccess] =useState(false);
    const [values, setValues] = useState({
        coursename: '',
        jobid: '',
        description: '',
        category: '',
        deadline: '',
        loading: false,
        error: '',
        categories: [],
        updatedJob: '',
        redirectToProfile: false,
        formData: new FormData(),
    });

    const {
        coursename,
        jobid,
        description,
        category,
        deadline,
        loading,
        error,
        categories,
        updatedJob,
        formData,
    } = values;

    const init = jobId => {
        getPosting(jobId)
            .then(data => {
                if (data && data.error) {
                    setValues({ ...values, error: data.error });
                    setError(data.error)
                } else if (data) {
                    // populate the state
                    setValues({
                        ...values,
                        coursename: data.coursename,
                        jobid: data.jobid,
                        description: data.description,
                        category: data.category,
                        deadline: data.deadline,
                        formData: new FormData(),
                    });
                    setError("");
                    setSuccess(true);
                    // load categories
                    initCategories();
                }
            })
            .catch(error => {
                console.error('Error fetching job data:', error);
                setValues({ ...values, error: 'Error fetching job data', loading: false });
            });
    };
    

    // Load categories and set form data
    const initCategories = () => {
        getCategories().then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    categories: data,
                });
            }
        });
    };

    useEffect(() => {
        init(match.params.userId);
    }, []);

    const handleChange = (name) => (event) => {
        const value = event.target.value;
        // Create a new FormData object
        const updatedFormData = new FormData();
        // Append existing formData to the new FormData object
        for (let [key, val] of formData.entries()) {
            updatedFormData.append(key, val);
        }
        // Set the new form field value
        updatedFormData.set(name, value);
        // Update the state with the new formData and field value
        setValues({ ...values, error: '', formData: updatedFormData, [name]: value });
    };

    const clickSubmit = (event) => {
        setError('')
        setSuccess(false)
        event.preventDefault();
        setValues({ ...values, error: '', loading: true });
    
        updatePostings(match.params.jobId, user._id, token, formData)
            .then((data) => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false });
                    // Log the error received from the API
                    console.error('Error updating job:', data.error);
                } 
                else {
                        setValues({
                            ...values,
                            coursename: '',
                            jobid: '',
                            description: '',
                            category: '',
                            deadline: '',
                            loading: false,
                            updatedJob: data.name,
                            
                        });
                        // Log the success message or updated data
                        console.log('Job details updated:', data);
                    }
                
            })
            .catch((error) => {
                console.log('Network error:', error);
                setValues({ ...values, error: 'Network error', loading: false });
            });
    };
    
    const newUpdateForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Update a Job</h4>
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
                <label className="text-muted">Job ID</label>
                <input
                    onChange={handleChange('jobid')}
                    type="text"
                    className="form-control"
                    value={jobid}
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
    
            <div className="form-group">
                <label className="text-muted">Category</label>
                <select
                    onChange={handleChange('category')}
                    className="form-control"
                    value={category}
                >
                    <option>Please select</option>
                    {categories.map((c, i) => (
                        <option key={i} value={c.name}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>
    
            <div className="form-group">
                <label className="text-muted">Deadline</label>
                <input
                    type="date"
                    onChange={handleChange('deadline')}
                    className="form-control"
                    value={deadline}
                />
            </div>
    
            <button className="btn btn-outline-primary">Update Job</button>
        </form>
    );
    

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => {
         if(success){
            return <h3 className="text-success">{updatedJob} is updated</h3>
        }
    };

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    return (
        <Layout title="Update job" description={`Hello ${user.name}, ready to update the new job?`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newUpdateForm()}
                </div>
            </div>
        </Layout>
    );
};


export default UpdateJob;
