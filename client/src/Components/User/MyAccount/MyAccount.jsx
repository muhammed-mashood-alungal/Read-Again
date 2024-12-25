import React, { useEffect, useState } from 'react';
import { axiosAuthInstance, axiosOrderInstance, axiosUserInstance } from '../../../redux/Constants/axiosConstants';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import UpdateProfile from './UpdateProfile';
import ChangePass from './ChangePass';
import Addresses from './Addresses';
import OrderHistory from './OrderHistory';
import WalletPage from './WalletPage';
import { removeAuth } from '../../../redux/Actions/userActions';

const MyAccount = () => {
  const [profileData, setProfileData] = useState({});
  const [orders, setOrders] = useState([])
  const { isLoggedIn, userId } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [currentOrderPage, setCurrentOrderPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = 10
  const activeTab = searchParams.get('tab') || 'dashboard';
  const dispatch = useDispatch()
  const handleTabClick = (target) => {
    setSearchParams({ tab: target });
  }

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
        console.log(err)
      }
    }
    if (isLoggedIn) {
      getProfileData();
    }

  }, [userId, isLoggedIn, activeTab]);

  useEffect(() => {
    const getUserOrderHistory = async () => {
      try {
        const { data } = await axiosOrderInstance.get(`/${userId}/?page=${currentOrderPage}&limit=${limit}`)
        setOrders(data.orders)
        let pages = Math.ceil(data?.totalOrders / limit)
        setTotalPages(pages)
      } catch (err) {
        console.error(err)
      }
    }
    if (isLoggedIn) {
      getUserOrderHistory();
    }
  }, [userId, activeTab, currentOrderPage]);

  const handleLogOut = async () => {
    try {
      await axiosAuthInstance.get('/logout');
      dispatch(removeAuth());
    } catch (error) {
      console.error("Logout failed", error.response?.data || error.message);
    }
  }

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
            <i className="fi fi-rs-marker"></i> Address
          </p>
          <p
            className={`account__tab ${activeTab === 'wallet' ? 'active-tab' : ''}`}
            onClick={() => handleTabClick('wallet')}
          >
            <i className="fi fi-rs-marker"></i> Wallet
          </p>
          {profileData.password && (
            <p
              className={`account__tab ${activeTab === 'change-password' ? 'active-tab' : ''}`}
              onClick={() => handleTabClick('change-password')}
            >
              <i className="fi fi-rs-settings-sliders"></i> Change Password
            </p>
          )}
          <p className="account__tab" onClick={handleLogOut}>
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
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className={`tab__content ${activeTab === 'orders' ? 'active-tab' : ''}`} id="orders">
              <OrderHistory orders={orders} setCurrentOrderPage={setCurrentOrderPage} currentOrderPage={currentOrderPage} totalPages={totalPages} />
            </div>
          )}

          {activeTab === 'update-profile' && (
            <div className={`tab__content ${activeTab === 'update-profile' ? 'active-tab' : ''}`} id="update-profile">
              <UpdateProfile profileData={profileData} />
            </div>
          )}
          {activeTab === 'address' && (
            <div className={`tab__content ${activeTab === 'address' ? 'active-tab' : ''}`} id="address">
              <Addresses userId={profileData._id} userAddresses={profileData?.addresses} />
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className={`tab__content ${activeTab === 'wallet' ? 'active-tab' : ''}`} id="wallet">
              <WalletPage />
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
