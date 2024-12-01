import {API} from '../config';
export const updateApplicationStatus = async (applicationId, status) => {
    try {
        const response = await fetch(`${API}/courses/${applicationId}/applications`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}` // If you use token-based authentication
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            throw new Error('Failed to update status');
        }

        const data = await response.json();
        return data;  // Return the updated application data
    } catch (error) {
        throw new Error('Failed to update status: ' + error.message);
    }
};
