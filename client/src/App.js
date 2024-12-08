
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './Pages/Userpages/HomePage';
import LoginPage from './Pages/Userpages/LoginPage';
import RegisterPage from './Pages/Userpages/RegisterPage';
import LibraryPage from './Pages/Userpages/LibraryPage';
import CartPage from './Pages/Userpages/CartPage';
import WishlistPage from './Pages/Userpages/WishlistPage';
import AccountPage from './Pages/Userpages/AccountPage';
import CheckOutPage from './Pages/Userpages/CheckOutPage';
import DetailsPage from './Pages/Userpages/DetailsPage';
import EmailVerifyPage from './Pages/Userpages/EmailVerifyPage';
import ChangePassword from './Components/User/ChangePassword/ChangePassword';
import { ForgetPassProvider } from './contexts/forgetPassword';
import AdminPage from './Pages/AdminPages/AdminPage';
import CategoryManagement from './Components/Admin/CategoryManagment/ListCategories/ListCategories';
import ListUsers from './Components/Admin/UsersManagment/ListUsers/ListUsers';
import ListBooks from './Components/Admin/BookManagement/ListBooks.jsx/ListBooks';
import AdminLogin from './Components/Admin/AdminLogin/AdminLogin';
import { axiosAdminInstance, axiosAuthInstance, axiosCartInstance, axiosOrderInstance, axiosUserInstance } from './redux/Constants/axiosConstants';
import { useEffect } from 'react';
import { removeAuth, setAuth, setCartItemsCount } from './redux/Actions/userActions';
import { useDispatch } from 'react-redux';
import ForgottenPassword from './Components/User/ForgottenPassword/ForgottenPassword';
import { toast, ToastContainer } from 'react-toastify';
import ListOrders from './Components/Admin/OrderManagement/ListOrders/ListOrders';
import ListCoupons from './Components/Admin/CouponManagement/ListCoupons';

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosAuthInstance.get('/check-auth');
        dispatch(setAuth(response.data));
      } catch (error) {
        console.error('Token verification failed:', error);
        dispatch(removeAuth());
      }
    };
    checkAuth();
  }, [dispatch]);



  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/library' element={<LibraryPage />} />
          <Route path='/cart/' element={<CartPage />} />
          <Route path='/wishlist' element={<WishlistPage />} />
          <Route path='/account' element={<AccountPage />} />
          <Route path='/checkout' element={<CheckOutPage />} />
          <Route path='/book-details/:bookId' element={<DetailsPage />} />
        </Routes>
        <ForgetPassProvider>
          <Routes>
            <Route path='/register/verify' element={<EmailVerifyPage />} />
            <Route path='/forgotten-password/verify' element={<ForgottenPassword />} />
            <Route path='/forgotten-password/change-password' element={<ChangePassword />} />
          </Routes>
        </ForgetPassProvider>
        <Routes>
          <Route path='/admin' element={<AdminPage />}>
            <Route path='books' element={<ListBooks />} />
            <Route path='users' element={<ListUsers />} />
            <Route path='category' element={<CategoryManagement />} />
            <Route path='orders' element={<ListOrders />} />
            <Route path='coupons' element={<ListCoupons />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
