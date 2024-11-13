import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './BookDetails.css'
import { bookImages } from '../../../../redux/Constants/imagesDir'
function BookDetails({book}) {
    
  return (
    <div className="category-form ">
    <h1 className="card-title">Book Details</h1>
    <br />
   <div>
    <div>
    <h4>{book?.title}</h4>
    <h5>{book?.author}</h5>
    </div>
    
    <hr />
    <table>
      <tr>
        <th>Category </th>
        <th className='book-data-text'>{book?.category}</th>
      </tr>
      <tr>
        <th>Genre </th>
        <th className='book-data-text'>{book?.genre}</th>
      </tr>
      <tr>
        <th>ISBN </th>
        <th className='book-data-text'>{book?.ISBN}</th>
      </tr>
      <tr>
        <th>Publication </th>
        <th className='book-data-text'>{book?.publicationDate}</th>
      </tr>
      <tr>
        <th>Description</th>
        <th className='book-data-text'> {book?.description}</th>
      </tr>
      <tr>
        <h6>Images</h6>
        {book?.images.map((imageName)=>{
             return <img src={bookImages+book._id+"/"+imageName} alt="Category" className="category-image mb-3" />
        })}
      </tr>
    </table>
   
   
   </div>
     
   
  </div>
  )
}

export default BookDetails