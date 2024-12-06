import React, { useEffect, useState } from 'react';
import { axiosOrderInstance, axiosUserInstance } from '../../../redux/Constants/axiosConstants';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import UpdateProfile from './UpdateProfile';
import ChangePass from './ChangePass';
import Addresses from './Addresses';
import OrderHistory from './OrderHistory';

const MyAccount = () => {
  const [profileData, setProfileData] = useState({});
  const [orders, setOrders] = useState([]);
  const { isLoggedIn, userId } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'dashboard'; // Default to 'dashboard'

  const handleTabClick = (target) => {
    setSearchParams({ tab: target });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, userId]);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const response = await axiosUserInstance.get(`/${userId}`);
        setProfileData(response?.data?.userData);
      } catch (err) {
       // toast.error(err?.response?.data?.error);
      }
    };
    if(isLoggedIn){
      getProfileData();
    }
    
  }, [userId,isLoggedIn,activeTab]);

  useEffect(() => {
    const getUserOrderHistory = async () => {
      try {
        const response = await axiosOrderInstance.get(`/${userId}`);
        setOrders(response?.data?.orders);
      } catch (err) {
        console.error(err);
       // toast.error(err?.response?.data?.error);
      }
    };
    if(isLoggedIn){
      getUserOrderHistory();
    }
  }, [userId]);

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
          {profileData.password && (
            <p
              className={`account__tab ${activeTab === 'change-password' ? 'active-tab' : ''}`}
              onClick={() => handleTabClick('change-password')}
            >
              <i className="fi fi-rs-settings-sliders"></i> Change Password
            </p>
          )}
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
                    <th>
                      {profileData?.phone ? (
                        profileData?.phone
                      ) : (
                        <>
                          Not Added <br />
                          <button className="link-button" onClick={() => handleTabClick('update-profile')}>
                            Add Phone Number
                          </button>
                        </>
                      )}
                    </th>
                  </tr>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className={`tab__content ${activeTab === 'orders' ? 'active-tab' : ''}`} id="orders">
              <OrderHistory orders={orders} />
            </div>
          )}

          {activeTab === 'update-profile' && (
            <div className={`tab__content ${activeTab === 'update-profile' ? 'active-tab' : ''}`} id="update-profile">
              <UpdateProfile  profileData={profileData} />
            </div>
          )}
          {activeTab === 'address' && (
            <div className={`tab__content ${activeTab === 'address' ? 'active-tab' : ''}`} id="address">
              <Addresses userId={profileData._id} userAddresses={profileData?.addresses} />
            </div>
          )}

          {activeTab === 'change-password' && (
            <div className={`tab__content ${activeTab === 'change-password' ? 'active-tab' : ''}`} id="change-password">
              <ChangePass email={profileData.email} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
