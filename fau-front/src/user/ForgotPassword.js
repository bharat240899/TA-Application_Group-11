// ForgotPassword.js
import React, { useState } from 'react';
import Layout from '../core/Layout';
import { forgotPassword, resetPassword } from '../auth';

const ForgotPassword = () => {
    const [values, setValues] = useState({
        email: '',
        otp: '',
        newPassword: '',
        isOtpSent: false,
        error: '',
        success: '',
    });

    const { email, otp, newPassword, isOtpSent, error, success } = values;

    const handleChange = (name) => (event) => {
        setValues({ ...values, error: '', success: '', [name]: event.target.value });
    };

    const requestOtp = (event) => {
        event.preventDefault();
        forgotPassword(email).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, isOtpSent: true, success: 'OTP sent to your email.' });
            }
        });
    };

    const submitNewPassword = (event) => {
        event.preventDefault();
        resetPassword(email, otp, newPassword).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    email: '',
                    otp: '',
                    newPassword: '',
                    isOtpSent: false,
                    success: 'Password has been reset successfully!',
                });
            }
        });
    };

    return (
        <Layout title="Forgot Password" description="Reset your password here">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form>
                <div className="form-group">
                    <label className="text-muted">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        onChange={handleChange('email')}
                        value={email}
                    />
                </div>
                {isOtpSent && (
                    <>
                        <div className="form-group">
                            <label className="text-muted">OTP</label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={handleChange('otp')}
                                value={otp}
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                onChange={handleChange('newPassword')}
                                value={newPassword}
                            />
                        </div>
                    </>
                )}
                {!isOtpSent ? (
                    <button onClick={requestOtp} className="btn btn-primary">
                        Request OTP
                    </button>
                ) : (
                    <button onClick={submitNewPassword} className="btn btn-primary">
                        Reset Password
                    </button>
                )}
            </form>
        </Layout>
    );
};

export default ForgotPassword;
