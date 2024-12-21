import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'reactstrap';
import { axiosWishlistInstance } from '../../../redux/Constants/axiosConstants';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { bookImages } from '../../../redux/Constants/imagesDir';
import { toast } from 'react-toastify';
import { addToCart, decCartItemCount, decWishlistItemsCount } from '../../../redux/Actions/userActions';
import ConfirmationModal from '../../ConfirmationModal/ConfirmationModal';

const WishlistItems = () => {
  const {userId } = useSelector(state=>state.auth)
  const [wishlist,setWislist]=useState([])
  const [selectedItemId,setSelectedItemId]=useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(()=>{
    async function fetchWishlist(){
       try{
          const {data} = await axiosWishlistInstance.get(`/${userId}`)
          setWislist(data.wishlist)
       }catch(err){
         console.log(err?.response?.data?.message)
       }
    }
    if(userId){
      fetchWishlist()
    }else{
      navigate('/login')
    }
  },[])

  const handleAddToCart=async(itemId)=>{
    try {
      if(!userId){
        navigate('/login')
        toast.error("login First for add To cart")
      }
       const itemInfo={
        productId : itemId,
        quantity:1
       }

       const isSuccess = dispatch(addToCart(userId,itemInfo))
       console.log(isSuccess)
       if(isSuccess) {
        removeItemFromWishlist(itemId)
       }
       
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  }
  const removeItemFromWishlist =async (itemId)=>{
    try{
      console.log(itemId)
      setSelectedItemId(null)
      if(!userId){
        navigate('/login')
        toast.error("login First for Remove From Wislist")
      }
      await axiosWishlistInstance.put(`/${userId}/remove-item`,{itemId})
      setWislist((wishlist)=>{
        return wishlist.filter((item)=>{
          return item._id != itemId
        })
      })
      dispatch(decWishlistItemsCount())
    }catch(error){
      toast.error(error?.response?.data?.message)
    }
  }
  const onCancel =()=>{
    setSelectedItemId(null)
  }
  const getPrice=(book)=>{
    if(book?.appliedOffer?.isActive && book.formats.physical.offerPrice){
      return book.formats.physical.offerPrice
    }
    return book.formats.physical.price
  }

  return (
    <section className="wishlist section--lg">
      {
        selectedItemId  &&
        <ConfirmationModal
          title={`Are You Sure to Remove This Item From Wishlist ?`}
          onConfirm={()=>removeItemFromWishlist(selectedItemId)}
          onCancel={onCancel} />

      }
      <Container>
      {
          wishlist?.length == 0 ?
            <h1 className='empty-msg'>Your Wishlist is Empty</h1>
          : <div className="table__container">
          <Table responsive className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Stock Status</th>
                <th>Price</th>
                <th>Add To Cart</th>
              </tr>
            </thead>
            <tbody>
              {wishlist?.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img  src={item?.images[0].secure_url}  className="table__img" />
                  </td>
                  <td>
                    <h3 className="table__title">{item.title}</h3>
                  </td>
                  <td>
                    <span className="table__price">{item.stockStatus}</span>
                  </td>
                  <td>
                    <span className="table__stock">{getPrice(item)}</span>
                  </td>
                  <td>
                    <button className='primary-btn' onClick={(e)=>handleAddToCart(item._id)}>
                      Add to Cart
                    </button>
                  </td>
                  <td onClick={()=>setSelectedItemId(item._id)}>
                    <i className="fi fi-rs-trash table__trash" style={{ cursor: 'pointer' }}></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      }
       
      </Container>
    </section>
  );
};

export default WishlistItems;
