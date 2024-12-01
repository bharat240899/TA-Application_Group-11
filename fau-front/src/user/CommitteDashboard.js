import React from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';

const CommitteDashboard = () => {
    const { user: { fname, lname, email, role } } = isAuthenticated();

    // Committee-specific links
    const committeLinks = () => {
        return (
            <div className="card shadow-sm border-light">
                <h4 className="card-header text-white bg-primary">Committee Menu</h4>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/committee/dashboard/applications">
                            <i className="fa fa-file-alt"></i> Review Applications
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/committee/dashboard/ta-evaluations">
                            <i className="fa fa-chart-bar"></i> Checkout TA Performances
                        </Link>
                    </li>
                </ul>
            </div>
        );
    };

    // User information display
    const committeInfo = () => {
        return (
            <div className="card shadow-sm mb-4 border-light">
                <h3 className="card-header text-white bg-info">User Information</h3>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <strong>Name: </strong>{fname} {lname}
                    </li>
                    <li className="list-group-item">
                        <strong>Email: </strong>{email}
                    </li>
                    <li className="list-group-item">
                        <strong>Role: </strong>
                        {role === 3 ? 'Committee' : 'Registered User'}
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <Layout title="Committee Dashboard" description={`Hello ${fname} ${lname}, welcome back!`} className="container-fluid">
            <div className="row">
                <div className="col-md-4">
                    {committeLinks()}
                </div>
                <div className="col-md-8">
                    {committeInfo()}
                </div>
            </div>
        </Layout>
    );
};

export default CommitteDashboard;
