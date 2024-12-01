import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { signin, authenticate, isAuthenticated, verifyOtp } from '../auth';
import Layout from '../core/Layout';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const Signin = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        otp: '',
        error: '',
        loading: false,
        redirectToReferrer: false,
        isOtpSent: false,
    });

    const { email, password, otp, error, loading, redirectToReferrer, isOtpSent } = values;
    const { user } = isAuthenticated();
    console.log(user);

    const handleChange = (name) => (event) => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true });
        
        signin({ email, password }).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error, loading: false });
            } else {
                setValues({ ...values, isOtpSent: true, loading: false });
            }
        });
    };

    const clickVerifyOtp = (event) => {
        event.preventDefault();
        verifyOtp({ email, otp }).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                authenticate(data, () => {
                    setValues({ ...values, redirectToReferrer: true });
                });
            }
        });
    };

    const showError = () => (
        error && <div className="alert alert-danger">{error}</div>
    );

    const showLoading = () => (
        loading && <div className="alert alert-info"><h2>Loading...</h2></div>
    );

   
    const redirectUser =() =>{
        if(redirectToReferrer){
           if(user && user.role ===1){
            return <Redirect to="/admin/dashboard" />
           }
           else if (user && user.role === 2) {
            // Redirect to the instructor dashboard if the user is an instructor
            return <Redirect to="/instructor/dashboard" />;
           }
           else if (user && user.role === 3) {
            // Redirect to the instructor dashboard if the user is an instructor
            return <Redirect to="/committee/dashboard" />;
           }
           else{
            return <Redirect to="/student/dashboard" />
           }
           
        }
      
    }

    return (
        <Layout title="Sign-In Page" description="Sign in here" className="container col-md-8 offset-md-2">
            {showLoading()}
            {showError()}
            {isOtpSent ? (
                <form>
                    <div className="form-group">
                        <label className="text-muted">Enter OTP</label>
                        <input 
                            onChange={handleChange('otp')} 
                            type="text" 
                            value={otp} 
                            className="form-control" 
                        />
                    </div>
                    <button onClick={clickVerifyOtp} className="btn btn-primary">Verify OTP</button>
                </form>
            ) : (
                <form>
                    <div className="form-group">
                        <label className="text-muted">Email</label>
                        <input 
                            onChange={handleChange('email')} 
                            type="email" 
                            value={email} 
                            className="form-control" 
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Password</label>
                        <input 
                            onChange={handleChange('password')} 
                            type="password" 
                            value={password} 
                            className="form-control" 
                        />
                    </div>
                    <button onClick={clickSubmit} className="btn btn-primary m-2">Sign in</button>
                    
                   <Link to='/forgot-password'>Forgot Password?</Link>
                </form>
            )}
            {redirectUser()}
        </Layout>
    );
};

export default Signin;
