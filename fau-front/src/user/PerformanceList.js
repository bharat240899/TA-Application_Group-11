import React, { useState, useEffect } from 'react';
import { API } from '../config';  // API base URL
import Layout from '../core/Layout';
const PerformanceList = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch performance evaluations from the backend
        const fetchEvaluations = async () => {
            try {
                const response = await fetch(`${API}/ta-evaluations`);
                const data = await response.json();
                if (response.ok) {
                    setEvaluations(data);
                } else {
                    setError('Failed to load evaluations');
                }
            } catch (err) {
                setError('Error fetching evaluations');
            } finally {
                setLoading(false);
            }
        };

        fetchEvaluations();
    }, []);

    // Render loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Render error state
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Layout title='Evaluations' description="Below are the performance reports of TA's that are shared by instructors ">
                  <div className="container mt-5">
            <h3 className="text-center mb-4">Performance Evaluations</h3>
            {evaluations.length === 0 ? (
                <div>No evaluations found.</div>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Z Number</th>
                            <th>Teaching Quality</th>
                            <th>Communication Skills</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {evaluations.map((evaluation, index) => (
                            <tr key={index}>
                                <td>{evaluation.fname}</td>
                                <td>{evaluation.lname}</td>
                                <td>{evaluation.email}</td>
                                <td>{evaluation.znumber}</td>
                                <td>{evaluation.teachingQuality}</td>
                                <td>{evaluation.communicationSkills}</td>
                                <td>{evaluation.comments}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
        </Layout>
      
    );
};

export default PerformanceList;
