
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
import ChangePassword from './Components/User/ChangeForgottenPass/ChangeForgottenPass';
import AdminLayout from './Pages/AdminLayoutPage/AdminLayout';
import CategoryManagement from './Components/Admin/CategoryManagment/ListCategories/ListCategories';
import ListUsers from './Components/Admin/UsersManagment/ListUsers/ListUsers';
import ListBooks from './Components/Admin/BookManagement/ListBooks.jsx/ListBooks';
import AdminLogin from './Components/Admin/AdminLogin/AdminLogin';
import { axiosAuthInstance } from './redux/Constants/axiosConstants';
import { useEffect } from 'react';
import { removeAuth, setAuth } from './redux/Actions/userActions';
import { useDispatch } from 'react-redux';
import ForgottenPassword from './Components/User/ForgottenPassword/ForgottenPassword';
import {ToastContainer } from 'react-toastify';
import ListOrders from './Components/Admin/OrderManagement/ListOrders/ListOrders';
import ListCoupons from './Components/Admin/CouponManagement/ListCoupons';
import ListOffers from './Components/Admin/OfferManagement/ListOffers/ListOffers';
import Dashboard from './Components/Admin/Dashboard/Dashboard';
import BookForm from './Components/Admin/BookManagement/BookForm/BookForm';
import BookDetails from './Components/Admin/BookManagement/BookDetails/BookDetails';
import UserDetails from './Components/Admin/UsersManagment/UserDetails/UserDetails';
import CategoryForm from './Components/Admin/CategoryManagment/CategoryForm/CategoryForm';
import OrderDetails from './Components/Admin/OrderManagement/OrderDetails/OrderDetails';
import CouponDetails from './Components/Admin/CouponManagement/CouponDetails';
import CouponForm from './Components/Admin/CouponManagement/CouponForm';
import ViewOffer from './Components/Admin/OfferManagement/ViewOffer/ViewOffer';
import OfferForm from './Components/Admin/OfferManagement/OfferForm/OfferForm';
import OrderSuccessPage from './Pages/Userpages/OrderSuccessPage';
import ScrollToTop from './Components/CommonComponents/ScrollToTop/ScrollToTop';
import NotFound from './Components/CommonComponents/NotFound/NotFound';
import ChangeForgottenPass from './Components/User/ChangeForgottenPass/ChangeForgottenPass';

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosAuthInstance.get('/check-auth')
        dispatch(setAuth(response.data))
      } catch (error) {
        dispatch(removeAuth())
      }
    };
    checkAuth();
  }, [dispatch]);



  return (
    <BrowserRouter>
    <div className="App">
      <ScrollToTop />
  
      <Routes>
      <Route >
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/checkout" element={<CheckOutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/book-details/:bookId" element={<DetailsPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path='/register/verify' element={<EmailVerifyPage />} />
        <Route path='/forgotten-password/verify' element={<ForgottenPassword />} />
        <Route path='/forgotten-password/change-password' element={<ChangeForgottenPass />} />
      </Route>
      <Route path='/admin' element={<AdminLayout />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='books' element={<ListBooks />} />
          <Route path='books/add' element={<BookForm />} />
          <Route path='books/view' element={<BookDetails />} />
          <Route path='users' element={<ListUsers />} />
          <Route path='users/view' element={<UserDetails />} />
          <Route path='category' element={<CategoryManagement />} />
          <Route path='category/form' element={<CategoryForm />} />
          <Route path='orders' element={<ListOrders />} />
          <Route path='orders/view' element={<OrderDetails />} />
          <Route path='coupons' element={<ListCoupons />} />
          <Route path='coupons/view' element={<CouponDetails />} />
          <Route path='coupons/form' element={<CouponForm />} />
          <Route path='offers' element={<ListOffers />} />
          <Route path='offers/view' element={<ViewOffer />} />
          <Route path='offers/form' element={<OfferForm />} />
        </Route>
        <Route path="*" element={<NotFound />} />
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
