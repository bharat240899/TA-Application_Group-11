import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Signin from './user/Signin';
import Signup from './user/Signup';
import Home from './core/Home';
import Profile from './user/Profile';
import Dashboard from './user/StudentDashboard';
import AdminDashboard from './user/AdminDashboard';
import CommitteDashboard from './user/CommitteDashboard';
import InstructorDashboard from './user/InstructorDashboard';
import StudentRoute from './auth/StudentRoute';
import AdminRoute from './auth/AdminRoute';
import InstructorRoute from './auth/InstructorRoute';
import CommitteRoute from './auth/CommitteRoute';
import ForgotPassword from './user/ForgotPassword';
import LatestJobs from './user/LatestJobs';
import ApplicationForm from './user/ApplicationForm';
import pageNotFound from './core/pageNotFound'
import AddJob from './admin/AddJob';
import Success from './core/Success'
import ApplicationsList from './admin/ApplicationsList'; // Correct for named export
import NotifyStatus from './user/NotifyStatus';
import PerformanceEvaluation from './user/PerformanceEvaluation';
import PerformanceList from './user/PerformanceList';
const RoutePaths = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/signin" exact component={Signin} />
                <Route path="/signup" exact component={Signup} />
                <Route path="/forgot-password" exact component={ForgotPassword} />
                <Route path="/latest-jobs" exact component={LatestJobs} />
                <Route path="/form/success" exact component={Success} />
                <Route path="/apply/:jobId" component={ApplicationForm} />
                <AdminRoute path="/admin/dashboard" exact component={AdminDashboard} />
                <AdminRoute path="/admin/dashboard/ta-evaluations" exact component={PerformanceList} />
                <AdminRoute path="/job/create/:userId" exact component={AddJob} />
                                <AdminRoute 
                path="/admin/manage-application" 
                exact 
                component={NotifyStatus} 
                />


                <InstructorRoute path="/instructor/dashboard" exact component={InstructorDashboard} />
                <InstructorRoute path="/dashboard/evaluate" exact component={PerformanceEvaluation} />
                <CommitteRoute path="/committee/dashboard" exact component={CommitteDashboard} />
                <CommitteRoute path="/committee/dashboard/ta-evaluations" exact component={PerformanceList} />
                <CommitteRoute path="/committee/dashboard/applications" exact component={ApplicationsList} />
                <StudentRoute path="/profile/:userId" exact component={Profile} />
                <StudentRoute path="/student/dashboard" exact component={Dashboard} />
                <Route path='*' exact component={pageNotFound} />
            </Switch>
        </BrowserRouter>
    );
};

export default RoutePaths;
