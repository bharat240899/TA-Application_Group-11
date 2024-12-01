import {React} from 'react';
import success from '../assets/check.png'
const Success=()=>{
    return(
        <div className=" success" style={{ backgroundColor: '#003366',padding:'14.6rem' }}>
        <div className="row">
            <div className="col-md-6 offset-md-3 text-center mt-5 text-success">
                 <img src={success} alt="Success" className="img-fluid mt-4 success-icon" />
                 <h1 className='text-danger text-center'>Form Submitted Successfully</h1>
                <h3 className='text-danger text-center mt-2'>You will be receiving mail if your application is shortlisted,where the next steps will be detailed.</h3>
                <p className="mt-4">
                    <a href="/" className="btn btn-danger">Go back to Home</a>
                </p>
            </div>
        </div>
    </div>

    )
}

export default Success;