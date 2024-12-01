import { API } from "../config";

export const read = (userId, token) => {
    return fetch(`${API}/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const createApplication = (courseId, userId, token, formData) => {
    return fetch(`${API}/courses/${courseId}/applications`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            // Do not set Content-Type here, as FormData will set it automatically
        },
        body: formData, // Send the FormData with file
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        return data; // Return the response data for further use
    })
    .catch(err => {
        console.log('Error submitting application:', err); // Log any errors
    });
};


export const update = (userId, token, user) => {
    return fetch(`${API}/user/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const updateUser = (user, next) => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("jwt")) {
            let auth = JSON.parse(localStorage.getItem("jwt"));
            auth.user = user;
            localStorage.setItem("jwt", JSON.stringify(auth));
            next();
        }
    }
};

export const getUsers = () => {
    return fetch(`${API}/users`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
export const getApplications = () => {
    return fetch(`${API}/applications`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
export const getJobDetails = (courseId) => {
    return fetch(`${API}/job/${courseId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    })
        .then((response) => response.json())
        .catch((err) => console.error('Error fetching job details:', err));
};
export const getJobs = () => {
    return fetch(`${API}/jobs`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};