import React from 'react';
import Menu from './Menu';
import Footer from './Footer';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import brand from '../assets/owlhead-logo.png'

const Layout = ({ 
    title = "Title", 
    description = "REACT_APP_API_URL", 
    className, 
    children 
}) => (
    <div className="container-fluid">
        {/* Standard Navbar */}
        <nav className="navbar navbar-expand" style={{ backgroundColor: '#003366' }}>
            <div className="container-fluid">
                <Link to='/' className="navbar-brand">
                    <img 
                        src={brand} 
                        alt="Partner Logo" 
                        className="img-fluid" 
                        style={{
                            maxHeight: '40px', 
                            objectFit: 'contain', 
                            verticalAlign: 'middle', 
                            padding: '5px 15px',
                            transition: 'transform 0.3s ease',
                        }} 
                    />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <Menu />
                </div>
            </div>
        </nav>

        {/* Page Description - Placed below Navbar */}
        <div className="text-white text-center p-4 m-4" style={{ backgroundColor: '#003366' }}>
            <h2 className="text-white">{title}</h2>
            <p className="lead">{description}</p>
        </div>

        <div className="row">
            {/* Main Content Area */}
            <div className="col-md-12">
                {/* Main Content */}
                <main className={`container ${className}`}>
                    <div className="card p-4 mb-4">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    </div>
);

export default Layout;
