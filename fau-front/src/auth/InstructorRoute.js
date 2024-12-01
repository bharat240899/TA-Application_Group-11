import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from './index';

const InstructorRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() && isAuthenticated().user.role === 2 ? (
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

export default InstructorRoute;
