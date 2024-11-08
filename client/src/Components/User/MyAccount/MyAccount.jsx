import React, { useState } from 'react';

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabClick = (target) => {
    console.log(target);
    setActiveTab(target);
  };

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
          <p
            className={`account__tab ${activeTab === 'change-password' ? 'active-tab' : ''}`}
            onClick={() => handleTabClick('change-password')}
          >
            <i className="fi fi-rs-settings-sliders"></i> Change Password
          </p>
          <p className="account__tab">
            <i className="fi fi-rs-exit"></i> Logout
          </p>
        </div>

        <div className="tabs__content">
          {activeTab === 'dashboard' && (
            <div className={`tab__content ${activeTab === 'dashboard' ? 'active-tab' : ''}`} id="dashboard">
              <h3 className="tab__header">Hello Rosie</h3>
              <div className="tab__body">
                <p className="tab__description">
                  From your account dashboard, you can easily check & view your recent order, manage your shipping and billing addresses, and edit your password and account details.
                </p>
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
              <h3 className="tab__header">Update Profile</h3>
              <div className="tab__body">
                <form className="form grid">
                  <input type="text" placeholder="Username" className="form__input" />
                  <div className="form__btn">
                    <button className="btn btn--md">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className={`tab__content ${activeTab === 'address' ? 'active-tab' : ''}`} id="address">
              <h3 className="tab__header">Shipping Address</h3>
              <div className="tab__body">
                <address className="address">
                  3522 Interstate <br />
                  75 Business Spur, <br />
                  Sault Ste. <br />
                  Marie, Mi 49783
                </address>
                <p className="city">New York</p>
                <a href="#" className="edit">Edit</a>
              </div>
            </div>
          )}

          {activeTab === 'change-password' && (
            <div className={`tab__content ${activeTab === 'change-password' ? 'active-tab' : ''}`} id="change-password">
              <h3 className="tab__header">Change Password</h3>
              <div className="tab__body">
                <form className="form grid">
                  <input type="password" placeholder="Current Password" className="form__input" />
                  <input type="password" placeholder="New Password" className="form__input" />
                  <input type="password" placeholder="Confirm Password" className="form__input" />
                  <div className="form__btn">
                    <button className="btn btn--md">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
