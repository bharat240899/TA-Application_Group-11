import React from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
const Dashboard = () => {
    const { user, token } = isAuthenticated();  // Destructure user and token from isAuthenticated
    
    const userLinks = () => (
        <div className="card border-primary mb-4">
            <div className="card-header bg-primary text-white text-center">
                <h5>Student Menu</h5>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item text-center">
                    <Link to="/latest-jobs" className="text-decoration-none">
                        Apply Jobs
                    </Link>
                </li>
                {/* <li className="list-group-item text-center">
                    <Link to={`/profile/${user._id}`} className="text-decoration-none">
                        Update Profile
                    </Link>
                </li> */}
            </ul>
        </div>
    );

    const userInfo = () => (
        <div className="card border-info">
            <div className="card-header bg-info text-white text-center">
                <h5>User Information</h5>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item text-center">
                    <strong>Name:</strong> {user.fname} {user.lname}
                </li>
                <li className="list-group-item text-center">
                    <strong>Email:</strong> {user.email}
                </li>
                <li className="list-group-item text-center">
                    <strong>Role:</strong> 
                    {user.role === 1 ? 'Admin' : user.role === 2 ? 'Instructor' : user.role === 3 ? 'Committee Member' : 'Student'}
                </li>
            </ul>
        </div>
    );

    return (
        <Layout
            title="Dashboard"
            description={`Hello ${user.fname} ${user.lname}, welcome to your dashboard!`}
            className="container-fluid"
        >
            <div className="container my-4">
                <div className="row">
                    <div className="col-md-3 mb-4">{userLinks()}</div>
                    <div className="col-md-9 mb-4">
                        {userInfo()}
                     
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
