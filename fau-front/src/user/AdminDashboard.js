import React from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import '../styles.css';

const AdminDashboard = () => {
    const { user } = isAuthenticated();

    // Redirect non-admin users
    if (user && user.role !== 1) {
        return <Redirect to="/user/dashboard" />;
    }

    const adminLinks = () => {
        return (
            <nav className="admin-links">
                <ul>
                    {/* Link to the job create page with userId as a parameter */}
                    <li><Link to={`/job/create/${user._id}`}>Input TA recommendations</Link></li>
                    <li><Link to="/admin/manage-application">Manage TA Applications</Link></li>
                    <li><Link to="/admin/dashboard/ta-evaluations">Checkout TA Performances report</Link></li>
                </ul>
            </nav>
        );
    };

    const adminInfo = () => {
        return (
            <div className="admin-info">
                <h3>User Information</h3>
                <ul>
                    <li><strong>Name: </strong>{user.fname} {user.lname}</li>
                    <li><strong>Email: </strong>{user.email}</li>
                    <li><strong>Role: </strong>{user.role === 1 ? 'Admin' : 'Registered User'}</li>
                </ul>
            </div>
        );
    };

    return (
        <Layout title="Dashboard" description={`Hello ${user.fname}. Welcome!`} className="container-fluid">
            <div className="dashboard-container">
                <div className="sidebar">
                    {adminLinks()}
                </div>
                <div className="main-content">
                    {adminInfo()}
                </div>
            </div>

        </Layout>
    );
};

export default AdminDashboard;
