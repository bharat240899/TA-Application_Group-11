import React, { useState } from 'react';
import { API } from '../config';
import Layout from '../core/Layout';

const PerformanceEvaluation = () => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [znumber, setZnumber] = useState('');
    const [teachingQuality, setTeachingQuality] = useState('');
    const [communicationSkills, setCommunicationSkills] = useState('');
    const [comments, setComments] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const evaluationData = {
            fname,
            lname,
            email,
            znumber,
            teachingQuality,
            communicationSkills,
            comments,
        };

        try {
            const response = await fetch(`${API}/performance-evaluation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(evaluationData),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage(result.message);
                // Clear the form fields on successful submission
                setFname('');
                setLname('');
                setEmail('');
                setZnumber('');
                setTeachingQuality('');
                setCommunicationSkills('');
                setComments('');
                setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
            } else {
                setMessage('Failed to submit evaluation');
            }
        } catch (error) {
            console.error('Error submitting evaluation:', error);
            setMessage('Error submitting evaluation');
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        switch (id) {
            case 'fname':
                setFname(value);
                break;
            case 'lname':
                setLname(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'znumber':
                setZnumber(value);
                break;
            case 'teachingQuality':
                setTeachingQuality(value);
                break;
            case 'communicationSkills':
                setCommunicationSkills(value);
                break;
            case 'comments':
                setComments(value);
                break;
            default:
                break;
        }
    };

    return (
        <Layout title='Evalaute the form' description='Evaluate TA performances'>
            <div className="container mt-5">
                <h3 className="text-center mb-4">Performance Evaluation</h3>
                {message && <div className="alert alert-info text-center">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="fname" className="form-label">First Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="fname"
                            value={fname}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="lname" className="form-label">Last Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lname"
                            value={lname}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="znumber" className="form-label">Z Number:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="znumber"
                            value={znumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="teachingQuality" className="form-label">Teaching Quality (1-5):</label>
                        <input
                            type="number"
                            className="form-control"
                            id="teachingQuality"
                            value={teachingQuality}
                            onChange={handleChange}
                            min="1"
                            max="5"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="communicationSkills" className="form-label">Communication Skills (1-5):</label>
                        <input
                            type="number"
                            className="form-control"
                            id="communicationSkills"
                            value={communicationSkills}
                            onChange={handleChange}
                            min="1"
                            max="5"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="comments" className="form-label">Comments:</label>
                        <textarea
                            className="form-control"
                            id="comments"
                            value={comments}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Submit Evaluation</button>
                </form>
            </div>
        </Layout>

    );
};

export default PerformanceEvaluation;
