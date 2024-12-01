import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from './index';

const CommitteRoute = ({ component: Component, ...rest }) => (
    <Route 
        {...rest}
        render={props =>
            isAuthenticated() && isAuthenticated().user.role === 3 ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: '/signin', // Redirect to the sign-in page
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);

export default CommitteRoute;
