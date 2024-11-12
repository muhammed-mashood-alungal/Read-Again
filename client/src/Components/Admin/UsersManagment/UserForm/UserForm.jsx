import React, { useEffect, useState } from 'react';
import { validateRegister } from '../../../User/Register/forValidation';
import { useDispatch } from 'react-redux';
import { createUser, userLogin } from '../../../../redux/Actions/userActions';

const UserForm = () => {
  const [username , setUsername] = useState("")
  const [email,setEmail] =useState("")
  const [password , setPassword] = useState("")
  const [confirmPassword ,setConfirmPassword] = useState("")
  const [err, setErr] = useState("")
  const [success ,setSuccess] = useState(false)
 const dispatch = useDispatch()
useEffect(()=>{
  if(success){
    setTimeout(()=>{
      setSuccess(false)
    },3000)
  }
},[success])

  const handleCreateUser =async (e) => {
    e.preventDefault();
    setErr("")
    const formData={
     username , email , password , confirmPassword
    }
    const result = await validateRegister(formData)
    if(!result.success){
      setErr(result.message)
      
     }else{
       const result = await dispatch(createUser(formData))
       if(result){
        setSuccess(true)
     }
       
        setUsername("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
     }
  };

  return (
    <div className="category-form ">
        <h4 className="card-title">Create New User</h4>
        {err && <p>{err}</p>}
        {success && <p>User Created Successfully</p>}
        <br />
        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label>User Name</label>
            <input
              type="text"
              value={username}
              onChange={(e)=>{setUsername(e.target.value)}}
              className="form-control"
              placeholder="Username"
              />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
              className="form-control"
              placeholder="Enter Email"
              />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="text"
              value={password}
              onChange={(e)=>{setPassword(e.target.value)}}
              className="form-control"
              placeholder="Password "
              />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="text"
              name="name"
              value={confirmPassword}
              onChange={(e)=>{setConfirmPassword(e.target.value)}}
              className="form-control"
              placeholder="Confirm Password"
              />
          </div>
         
          <button type="submit" className="primary-btn">
            Create
          </button>
        </form>
      </div>
  );
};

export default UserForm;
