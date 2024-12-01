import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { getJobs } from '../user/apiUser';  // Import the getJobs function
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
const LatestJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch jobs when the component is mounted
    useEffect(() => {
        getJobs()
            .then((data) => {
                if (data.error) {
                    console.error('Error fetching jobs:', data.error);
                } else {
                    setJobs(data);  // Set the jobs state with the fetched data
                    setLoading(false);  // Stop loading once data is fetched
                }
            })
            .catch((error) => {
                console.error('Error fetching jobs:', error);
                setLoading(false);  // Handle error and stop loading
            });
    }, []);

    const renderJobs = () => {
        if (loading) {
            return <p>Loading jobs...</p>;
        }
        if (jobs.length === 0) {
            return <p>No jobs available at the moment.</p>;
        }
        return (
            <div className="list-group">
                {jobs.map((job) => (
                    <div key={job._id} className="list-group-item m-2">
                        <h5>{job.coursename}</h5>
                        <ReactMarkdown>{job.description}</ReactMarkdown>
                        {/* Update this Link to navigate to the job application page */}
                        <Link to={`/apply/${job._id}`} className="btn btn-primary">
                            Apply
                        </Link>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Layout
            title="Dashboard"
            description={`Explore your latest recommended jobs here`}
            className="container-fluid"
        >
            <div className="container mt-4">
                <h3>Latest Job Listings</h3>
                {renderJobs()}  {/* Render the jobs here */}
            </div>
        </Layout>
    );
};

export default LatestJobs;
