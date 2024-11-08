
import './App.css';
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import HomePage from './Pages/Userpages/HomePage';
import LoginPage from './Pages/Userpages/LoginPage';
import RegisterPage from './Pages/Userpages/RegisterPage';
import LibraryPage from './Pages/Userpages/LibraryPage';
import CartPage from './Pages/Userpages/CartPage';
import WishlistPage from './Pages/Userpages/WishlistPage';
import AccountPage from './Pages/Userpages/AccountPage';
import CheckOutPage from './Pages/Userpages/CheckOutPage';
import DetailsPage from './Pages/Userpages/DetailsPage';


function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route  path='/' element={<HomePage/>}/>
        <Route  path='/login' element={<LoginPage/>}/>
        <Route  path='/register' element={<RegisterPage/>}/>
        <Route  path='/library' element={<LibraryPage/>}/>
        <Route  path='/cart' element={<CartPage/>}/>
        <Route  path='/wishlist' element={<WishlistPage/>}/>
        <Route  path='/account' element={<AccountPage/>}/>
        <Route  path='/checkout' element={<CheckOutPage/>}/>
        <Route  path='/details' element={<DetailsPage/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
