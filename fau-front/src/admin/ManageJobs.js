import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import {deletePosting,getPostings } from "./apiAdmin";

const ManageJobs = () => {
    const [jobs, setJobs] = useState([]);

    const { user, token } = isAuthenticated();

    const loadJobs = () => {
        getPostings().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setJobs(data);
            }
        });
    };

    const destroy = jobId => {
        deletePosting(jobId, user._id, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                loadJobs();
            }
        });
    };

    useEffect(() => {
        loadJobs();
    }, []);

    return (
        <Layout
            title="Manage TA Jobs"
            description="Manage TA Job Postings"
            className="container-fluid"
        >
            <div className="row">
                <div className="col-md-12">
                    <h2 className="text-center">
                        Total {jobs.length} courses that require TA.
                    </h2>
                    <hr />
                    <ul className="list-group">
                        {jobs.map((p, i) => (
                            <li
                                key={i}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <strong>{p.coursename}</strong>
                                <Link to={`/admin/update/${p._id}`}>
                                    <span className="badge badge-warning badge-pill">
                                        Update
                                    </span>
                                </Link>
                                <span 
                                    onClick={() => destroy(p._id)}
                                    className="badge badge-danger badge-pill"
                                >
                                    Delete
                                </span>
                            </li>
                            
                        ))}
                    </ul>
                    <br />
                </div>
            </div>
        </Layout>
    );
};

export default ManageJobs;
