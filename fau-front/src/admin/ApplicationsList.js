import React, { useState, useEffect } from 'react';
import { getAllApplications } from './apiAdmin'; // Import the API call functions
import { updateApplicationStatus } from './apiCommitte';
import { isAuthenticated } from '../auth';
import Layout from '../core/Layout';
import { sendMail } from './apiAdmin';
const ApplicationsList = ({ status }) => {
    const { user: { fname, lname, role } } = isAuthenticated(); // Get user role
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const title = "Applications List";
    const description = "Manage and review applications.";

    useEffect(() => {
        fetchApplications(status);
    }, [status]);

    const fetchApplications = (status) => {
        getAllApplications(status)
            .then((data) => {
                if (data) {
                    setApplications(data);
                } else {
                    setApplications([]);
                    setError("No applications found");
                }
            })
            .catch(() => setError("Failed to load applications"));
    };
    const handleSendStatus = async (app) => {
        const { submittedBy, course, status } = app;
    
        try {
            const response = await sendMail(
                submittedBy.fname,
                course?.coursename || "Unknown Course",
                app.status,
                submittedBy.email
            );
    
            console.log("Mail Response:", response);
    
            if (response && response.message) {
                setSuccess(response.message);
                setTimeout(() => setSuccess(""), 5000)
            } else {
                console.error("Unexpected response:", response);
                setError(`Failed to send email to ${submittedBy.email}`);
            }
        } catch (err) {
            console.error("Error sending email:", err);
            setError("Error sending email. Please try again.");
        }
    };
    
    

    const handleViewResume = (resume) => {
        if (resume && resume.data) {
            const blob = new Blob([new Uint8Array(resume.data.data)], { type: resume.contentType });
            const url = window.URL.createObjectURL(blob);
            const newTab = window.open();
            newTab.document.write(`<iframe src="${url}" width="100%" height="100%" frameborder="0"></iframe>`);
        } else {
            alert("Resume not available.");
        }
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            const updatedApp = await updateApplicationStatus(applicationId, newStatus);

            setApplications((prevApplications) =>
                prevApplications.map((app) =>
                    app._id === applicationId ? { ...app, status: newStatus } : app
                )
            );
        } catch {
            setError("Failed to update status");
        }
    };

    return (
        <Layout title={title} description={description}>
            <div className="container mt-4">
                <h3 className="text-center mb-4">Applications</h3>
                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}

                <div className="row">
                    {applications.length > 0 ? (
                        applications.map((app) => (
                            <div className="col-md-4" key={app._id}>
                                <div className="card mb-4">
                                    <div className="card-header bg-primary text-white">
                                        <h4>Course Name: {app.course?.coursename || "No course assigned"}</h4>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="text-center">Applicant Details</h5>
                                        <p><strong>Applicant Name:</strong> {app.submittedBy?.fname} {app.submittedBy?.lname}</p>
                                        <p><strong>Email:</strong> {app.submittedBy?.email || "N/A"}</p>
                                        <p><strong>Znumber:</strong> {app.znumber || "N/A"}</p>
                                        {app.experience && <p><strong>TA Experience:</strong> {app.experience ? "Yes" : "No"}</p>}
                                        {Array.isArray(app.relevant_courses) && app.relevant_courses.length > 0 ? (
                                            <p>
                                                <strong>Courses Served as TA:</strong> {app.relevant_courses.join(", ")}
                                            </p>
                                        ) : (
                                            <p>
                                                <strong>Courses Served as TA:</strong> {app.relevant_courses}
                                            </p>
                                        )}

                                        <p><strong>Status:</strong> {app.status}</p>

                                        {role === 3 && (
                                            <div className="m-2">
                                                <button
                                                    className={`btn ${app.status === "selected" ? "btn-success" : "btn-outline-success"} m-3`}
                                                    onClick={() => handleStatusChange(app._id, "selected")}
                                                >
                                                    Selected
                                                </button>
                                                <button
                                                    className={`btn ${app.status === "rejected" ? "btn-danger" : "btn-outline-danger"}`}
                                                    onClick={() => handleStatusChange(app._id, "rejected")}
                                                >
                                                    Rejected
                                                </button>
                                                <button
                                                    className={`btn ${app.status === "pending" ? "btn-warning" : "btn-outline-warning"}`}
                                                    onClick={() => handleStatusChange(app._id, "pending")}
                                                >
                                                    Pending
                                                </button>
                                            </div>
                                        )}

                                        <div>
                                            {app.resume ? (
                                                <button
                                                    onClick={() => handleViewResume(app.resume)}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    View Resume
                                                </button>
                                            ) : (
                                                "No Resume"
                                            )}
                                        </div>
                                        {role === 1 && (
                                                  <div>
                                                  <button
                                                      className="btn mt-2 btn-info"
                                                      onClick={() => handleSendStatus(app)}
                                                  >
                                                      Send Status
                                                  </button>
                                              </div>
                                        )}
                                      
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No applications found.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ApplicationsList;
