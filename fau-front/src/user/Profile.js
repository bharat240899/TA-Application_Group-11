import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Redirect } from 'react-router-dom';
import { read, update, updateUser } from './apiUser';

const Profile = ({ match }) => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false,
        loading: false,
        redirectToProfile: false,
    });

    const { token } = isAuthenticated();
    const { name, email, password, success, loading, error, redirectToProfile } = values;

    const init = useCallback(userId => {
        read(userId, token).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, name: data.name, email: data.email, password: '' });
            }
        });
    }, [token]);

    useEffect(() => {
        init(match.params.userId);
    }, [init, match.params.userId]);

    const handleChange = name => e => {
        setValues({ ...values, error: '', [name]: e.target.value });
    };

    const clickSubmit = e => {
        e.preventDefault();
        setValues({ ...values, loading: true });

        const updatedData = {
            name,
            email,
            ...(password && { password }), // Only send password if it's not empty
        };

        update(match.params.userId, token, updatedData).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, loading: false });
            } else {
                updateUser(data, () => {
                    setValues({
                        ...values,
                        name: data.name,
                        email: data.email,
                        password: '',
                        success: true,
                        loading: false,
                        redirectToProfile: true, // Trigger redirect
                    });
                });
            }
        });
    };

    const redirectUser = () => {
        if (redirectToProfile) {
            return <Redirect to="/student/dashboard" />;
        }
    };

    const profileUpdate = (name, email, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    type="text"
                    onChange={handleChange('name')}
                    className="form-control"
                    value={name}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    type="email"
                    onChange={handleChange('email')}
                    className="form-control"
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    type="password"
                    onChange={handleChange('password')}
                    className="form-control"
                    value={password}
                />
            </div>

            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    return (
        <Layout title="Profile" description="Update your profile" className="container-fluid">
            <h2 className="mb-4">Profile Update</h2>
            {loading && <div className="alert alert-info">Updating...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">Profile updated successfully!</div>}
            {profileUpdate(name, email, password)}
            {redirectUser()}
        </Layout>
    );
};

export default Profile;
