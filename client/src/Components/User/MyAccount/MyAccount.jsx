import React, { useEffect, useState } from 'react';
import { axiosUserInstance } from '../../../redux/Constants/axiosConstants';
import Toast from '../../Toast/Toast';
import {  toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UpdateProfile from './UpdateProfile';
import {Link} from 'react-router-dom'
import ChangePass from './ChangePass';
import Addresses from './Addresses';
const MyAccount = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileData,setProfileData] =useState({})
  const {isLoggedIn,userId}=useSelector(state=>state.auth)
  const navigate = useNavigate()
  
  
  const handleTabClick = (target) => {
    setActiveTab(target);
  };
  useEffect(()=>{
    if(!isLoggedIn || !userId){
      navigate('/')
    }
  },[isLoggedIn])

  useEffect(()=>{
    const getProfileData =async()=> {
      try{
        const response = await axiosUserInstance.get(`/${userId}`)
        setProfileData(response?.data?.userData)
      }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.error)
      }
    }
    getProfileData();
  },[])

  return (
    <section className="accounts section--lg">
      <div className="accounts__container container grid">
        
        <div className="account__tabs">
          <p
            className={`account__tab ${activeTab === 'dashboard' ? 'active-tab' : ''}`}
            onClick={() => handleTabClick('dashboard')}
          >
            <i className="fi fi-rs-settings-sliders"></i> Dashboard
          </p>
          <p
            className={`account__tab ${activeTab === 'orders' ? 'active-tab' : ''}`}
            onClick={() => handleTabClick('orders')}
          >
            <i className="fi fi-rs-shopping-bag"></i> Orders
          </p>
          <p
            className={`account__tab ${activeTab === 'update-profile' ? 'active-tab' : ''}`}
            onClick={() => handleTabClick('update-profile')}
          >
            <i className="fi fi-rs-user"></i> Update Profile
          </p>
          <p
            className={`account__tab ${activeTab === 'address' ? 'active-tab' : ''}`}
            onClick={() => handleTabClick('address')}
          >
            <i className="fi fi-rs-marker"></i> My Address
          </p>
          {
             profileData.password && (
              <p
            className={`account__tab ${activeTab === 'change-password' ? 'active-tab' : ''}`}
            onClick={() => handleTabClick('change-password')}
            >
            <i className="fi fi-rs-settings-sliders"></i> Change Password
            </p>
             )
          }
          
          <p className="account__tab">
            <i className="fi fi-rs-exit"></i> Logout
          </p>
        </div>

        <div className="tabs__content">
          {activeTab === 'dashboard' && (
            <div className={`tab__content ${activeTab === 'dashboard' ? 'active-tab' : ''}`} id="dashboard">
              <h3 className="tab__header">Hello {profileData?.username}</h3>
              <div className="tab__body">
                <table>
                  <tr>
                    <th>User Name</th>
                    <th>{profileData?.username}</th>
                  </tr>
                  <tr>
                    <th>Email Address</th>
                    <th>{profileData?.email}</th>
                  </tr>
                  <tr>
                    <th>Phone Number</th>
                    <th>{profileData?.phone  ? profileData?.phone:
                    <>
                    Not Added <br />
                    <button className="link-button"
                    onClick={() => handleTabClick('update-profile')}>
                    Add Phone Number
                    </button>
                    </>
                     }</th>
                    
                  </tr>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className={`tab__content ${activeTab === 'orders' ? 'active-tab' : ''}`} id="orders">
              <h3 className="tab__header">Your Orders</h3>
              <div className="tab__body">
                <table className="placed__order-table">
                  <thead>
                    <tr>
                      <th>Orders</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Totals</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#1357</td>
                      <td>March 19, 2022</td>
                      <td>Processing</td>
                      <td>$125.00</td>
                      <td><a href="#" className="view__order">View</a></td>
                    </tr>
                    <tr>
                      <td>#2468</td>
                      <td>June 29, 2022</td>
                      <td>Completed</td>
                      <td>$364.00</td>
                      <td><a href="#" className="view__order">View</a></td>
                    </tr>
                    <tr>
                      <td>#2366</td>
                      <td>August 02, 2022</td>
                      <td>Completed</td>
                      <td>$280.00</td>
                      <td><a href="#" className="view__order">View</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        
          {activeTab === 'update-profile' && (
             <div className={`tab__content ${activeTab === 'update-profile' ? 'active-tab' : ''}`} id="update-profile">
             <UpdateProfile activeTab={true}  profileData={profileData}
             />
              </div>
          ) }
          {activeTab === 'address' && (
            
            <div className={`tab__content ${activeTab === 'address' ? 'active-tab' : ''}`} id="address">
              <Addresses userId={profileData._id} userAddresses={profileData?.addresses}/>
            </div>
          )}

          {activeTab === 'change-password'  && (
            <div className={`tab__content ${activeTab === 'change-password' ? 'active-tab' : ''}`} id="change-password">
               <ChangePass email={profileData.email}/>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
