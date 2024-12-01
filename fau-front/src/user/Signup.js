import React,{useState} from 'react';
import {Link} from 'react-router-dom'
import Layout from '../core/Layout'
import {signup} from '../auth';


const Signup =() =>{
    const [values,setValues] =useState({
        fname:'',
        lname:'',
        znumber:'',
        email:'',
        password:'',
        error:'',
        success:false
    });
    const {fname,lname,znumber,email,password,success,error}=values;
    const handleChange=name =>event=>{
        setValues({...values,error:false,[name]:event.target.value})

    }
   

    const clickSubmit =(event)=>{
        event.preventDefault()
        setValues({...values,error:false});
        signup({fname,lname,znumber,email,password})
        .then(data =>{
            if (data.error && data.error.includes('user already exists')) {
                // Handle specific error case: user already exists
                setValues({ ...values, error: 'User already exists.', success: false });
            } else if (data.error) {
                // Handle other error cases
                setValues({ ...values, error: data.error, success: false });
            } 
            else{
                setValues({
                    ...values,
                    fname:'',
                    lname:'',
                    znumber:'',
                    email:'',
                    password:'',
                    error:'',
                    success:true
                })
            }
        })
    }

    const signUpForm =() =>(
    
        <form>
            <h1>Create your Account</h1>
            <div className="form-group">
                <label className="text-muted">First Name</label>
                <input  
                    onChange={handleChange('fname')} 
                    type="text" 
                    value={fname}
                    className="form-control"/>
            </div>
            <div className="form-group">
                <label className="text-muted">Last Name</label>
                <input  
                    onChange={handleChange('lname')}  
                    type="text" 
                    value={lname}
                    className="form-control"/>
            </div>
            <div className="form-group">
                <label className="text-muted">Z-number</label>
                <input
                    type="text"
                    onChange={handleChange('znumber')}
                    value={znumber}
                    className="form-control"
                    required
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={handleChange('email')} 
                    type="email"
                    value={email}
                    className="form-control"/>
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input 
                    onChange={handleChange('password')}  
                    type="password" 
                    value={password}
                    className="form-control"/>
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">Signup</button>
        </form>
    );
    const showError = ()=>(
        <div className="alert alert-danger" style={{display:error ? '':'none'}}>
            {error}
        </div>
    )
    const showSuccess = ()=>(
        <div 
        className="alert alert-info" 
        style={{display:success  ? "" : "none"}}>
         <strong>Account Creation Succeful.Please <Link to="/signin">Signin</Link></strong> 
        </div>
    )

   return (
       
    <Layout title="Sign-up Page" className="container col-md-8 offset-md-2" description ="Create your account from here">
       {showError()}
       {showSuccess()}
       {signUpForm() }
      {/* JSON.stringify(values) */}
    </Layout> 


   );

   
};
export default Signup;





