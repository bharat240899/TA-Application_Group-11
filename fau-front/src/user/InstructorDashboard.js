import React from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';

const InstructorDashboard = () => {
    const { user: { fname, email, role } } = isAuthenticated();

    // Instructor-specific links
    const instructLinks = () => {
        return (
            <div className="card shadow-sm border-light">
                <h4 className="card-header text-white bg-primary">Instructor Menu</h4>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/dashboard/evaluate">
                            <i className="fa fa-check-circle"></i> Evaluate TA Performance
                        </Link>
                    </li>
                </ul>
            </div>
        );
    };

    // User information display
    const instructInfo = () => {
        return (
            <div className="card shadow-sm mb-4 border-light">
                <h3 className="card-header text-white bg-info">User Information</h3>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <strong>Name: </strong>{fname}
                    </li>
                    <li className="list-group-item">
                        <strong>Email: </strong>{email}
                    </li>
                    <li className="list-group-item">
                        <strong>Role: </strong>
                        {role === 2 ? 'Instructor' : 'Registered User'}
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <Layout title="Instructor Dashboard" description={`Hello ${fname}, welcome back!`} className="container-fluid">
            <div className="row">
                <div className="col-md-4">
                    {instructLinks()}
                </div>
                <div className="col-md-8">
                    {instructInfo()}
                </div>
            </div>
        </Layout>
    );
};

export default InstructorDashboard;
