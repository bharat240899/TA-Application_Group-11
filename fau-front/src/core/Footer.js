import React from 'react';
import { Link } from 'react-router-dom';
import brand from "../assets/owlhead-logo.png" // Ad/just the path as needed

const Footer = () => {
    return (
        <footer className="text-light text-center py-5 mt-5" style={{ backgroundColor: '#003366' }}>
            <div className="container">
                <div className="row">
                    {/* Image and Text Section (First Section) */}
                    <div className="col-md-3 mb-4">
                        <h5 className="text-uppercase">FAU Careers</h5>
                        <div>
                            <img src={brand} alt="Partner Logo" className="img-fluid mb-3" style={{ maxHeight: '100px', objectFit: 'contain' }} />
                            <p className="text-light">We partner with top companies to bring you the best opportunities.</p>
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="col-md-3 mb-4">
                        <h5 className="text-uppercase">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/signin" className="text-light text-decoration-none">Sign In</Link></li>
                            <li><Link to="/signup" className="text-light text-decoration-none">Sign Up</Link></li>
                            <li><Link to="/apply" className="text-light text-decoration-none">Apply</Link></li>
                        </ul>
                    </div>
                    
                    {/* Contact Us Section */}
                    <div className="col-md-3 mb-4">
                        <h5 className="text-uppercase">Contact Us</h5>
                        <p className="mb-1">Phone: (561)-297 3533</p>
                        <p className="mb-1">Email: <a href="mailto:supporttahub@nu.edu" className="text-light text-decoration-none">recruit@fau.edu</a></p>
                    </div>

                    {/* Legal Section */}
                    <div className="col-md-3 mb-4">
                        <h5 className="text-uppercase">Legal</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/agreement" className="text-light text-decoration-none">Copyright & Agreement</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <hr className="border-light" />

                {/* Copyright */}
                <div className="text-center pt-3">
                    <p className="mb-0">© 2024 CampusHires at FAU. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
