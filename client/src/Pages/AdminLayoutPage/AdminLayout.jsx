import React, { useEffect } from 'react';
import './AdminLayout.css';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/Admin/Sidebar/Sidebar';
import { removeAuth, setAuth } from '../../redux/Actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { axiosAuthInstance } from '../../redux/Constants/axiosConstants';
import AdminHeader from '../../Components/Admin/AdminHeader/AdminHeader';

const AdminPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {isLoggedIn , role} = useSelector(state=>state.auth)
  
  useEffect(()=>{
    if(isLoggedIn && role != "ADMIN"){
      navigate('/')
    }else if(!isLoggedIn){
    navigate('/admin/login') 
   }
  },[role,isLoggedIn])
  

  useEffect(() => {
    const checkAuth = async () => {
        try {
            const response = await axiosAuthInstance.get('/check-auth');
            dispatch(setAuth(response.data));
        } catch (error) {
            console.error('Token verification failed:', error);
            dispatch(removeAuth());
        }
    }
    checkAuth()
}, [dispatch])


  

  return (
    <div>
    <Sidebar  />
    <div className="wrapper d-flex flex-column min-vh-100">
       <AdminHeader /> 
      <div className="body flex-grow-1 mt-5">
        <Outlet />
      </div>
    </div>
  </div>
  );
};

export default AdminPage;
