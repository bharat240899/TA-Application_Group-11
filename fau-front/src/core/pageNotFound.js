import search from '../assets/search.svg';
import '../styles.css';
const pageNotFound = () => (
  

        <div className=" success" style={{ backgroundColor: '#003366',padding:'14.6rem' }}>
            <div className="row">
                <div className="col-md-6 offset-md-3 text-center mt-5 text-success">
                     <img src={search} alt="Success" className="img-fluid mt-4 success-icon" />
                     <h1 className='text-danger text-center'>Sorry! Page Not Found</h1>
                    <h3 className='text-danger text-center mt-2'>We couldn't find the page you are looking for</h3>
                    <p className="mt-4">
                        <a href="/" className="btn btn-danger">Go back to Home</a>
                    </p>
                </div>
            </div>
        </div>
  
);


export default pageNotFound;