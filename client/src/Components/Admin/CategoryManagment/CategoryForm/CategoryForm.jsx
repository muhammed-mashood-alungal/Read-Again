import React, { useEffect, useState } from 'react';
import { axiosAdminInstance, axiosCategoryInstance, axiosUserInstance } from '../../../../redux/Constants/axiosConstants';
import { categoryImages } from '../../../../redux/Constants/imagesDir';
import CropImage from '../../CropImage/CropImage';
import './CategoryForm.css'
import Toast from '../../../Toast/Toast'
import {  toast } from 'react-toastify';
import { validateImage } from '../../../../validations/imageValidation';


const CategoryForm = ({categoryData ,onChildUpdate}) => {
  const [name, setName] = useState("")
  const [image, setImage] = useState(null)
  const [imageUrl , setImageUrl] = useState("")
  const [isCreateForm , setIsCreateForm] = useState(true)
  const [err , setErr] = useState("")
  const [success , setSuccess] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(()=>{
    if(categoryData.name){
      setIsCreateForm(false)
      setName(categoryData.name)
      setImageUrl(categoryImages+categoryData.image)
    }
  },[categoryData])


  useEffect(()=>{
   if(success){
   onChildUpdate(true)
   setName("")
   setImage(null)
   setImageUrl("")
   setErr("")
    setTimeout(()=>{
     setSuccess(false)
   
    },3000)
   }
  },[success])

  const handleCreateCategory = async(e) => {
    try{
      e.preventDefault()
      setErr('')
      if(name.trim() == ""){
        setErr("Enter a Category Name")
        return
      }
      if(!image && !imageUrl){
        setErr("Select  category Image")
        return 
      }
      const formData =new FormData()
      formData.append("type", "category")
      formData.append("image" ,image )
      formData.append("name",name)
      
      
      console.log(formData)
      const token=localStorage.getItem("token")
      const response = await axiosCategoryInstance.post('/create',formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data)
      if(response.status ==200){
        setSuccess(true)
      }
    }catch(err){
      console.log(err)
      setErr(err?.response?.data?.message)
    }
  };
  

  const handleUpdateCategory =async (e) => {
    try{
      e.preventDefault()
      setErr('')
      if(name.trim() ==""){
        setErr("Enter a Category Name")
        return
      }
      const formData =new FormData()
      formData.append("type", "category")
      formData.append("name",name)
      if (image) {
        formData.append('image', image)
      }
      
      console.log(categoryData._id)
      const token= localStorage.getItem("token")
      const response = await axiosCategoryInstance.put(`/${categoryData._id}/edit`,formData,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data)
      if(response.status ==200){
        setSuccess(true)
        setIsCreateForm(true)
      }
    }catch(err){
      console.log(err)
      setErr(err?.respons?.data?.message)
    }
  };
 


  const handleInputChange = (e) => {
    setName(e.target.value)
  };

 
  const handleImageClick = () => {
    setSelectedImage(image);
    setIsModalOpen(true);
};

  const handleSetImage=(file)=>{
        if(!validateImage(file)){
          toast.error("Make sure the image is either .png , .jpg or .jpeg")
          return 
        }
        setImage(file)
        setImageUrl(URL.createObjectURL(file))
        setSelectedImage(file); 
        setIsModalOpen(true);
 }
 const handleCropComplete = (croppedImage) => {
 console.log(croppedImage)
  setImage(croppedImage)
  setImageUrl(URL.createObjectURL(croppedImage))
  setIsModalOpen(false);
  // Update imageUrls array
  if(!isCreateForm){
    const oldUrl = URL.createObjectURL(selectedImage)
    const formData = new FormData()
    formData.append("oldUrl",oldUrl)
    formData.append("newImage",croppedImage)
   // axiosBookInstance.put('/update-book-image',formData)
    
  }
  
};
  

  return (
    <div className="category-form ">
      <Toast/>
        <h4 className="card-title">{isCreateForm ? "Create New " : "Update "}Category</h4>
        {isModalOpen && <CropImage
                isOpen={isModalOpen}
                imageSrc={selectedImage}
                onClose={() => setIsModalOpen(false)}
                onCropComplete={handleCropComplete}
            />} 
           
        {success && <p>Success .....!</p>}
        {err && <p className='err-msg'>{err}</p>}
        <form onSubmit={isCreateForm ?handleCreateCategory : handleUpdateCategory}  encType='multipart/form-data'>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text"
              name="name"
              value={name}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Category name"
              />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="file"
              accept='.png, .jpg, .jpeg'
              name="image"
              onChange={(e) => { handleSetImage(e.target.files[0])}}
              className="form-control"
              placeholder="Image URL"
            />
          </div>
          <div>
             <img src={imageUrl} alt=""/>
             {image && 
              <button className='crop-btn' role="button"  type="button" onClick={()=>{handleSetImage(image)}}> Crop Image</button>
             }
          </div>
          <button type="submit" className="primary-btn">
            {isCreateForm ? "Create" : "Update"}
          </button>
        </form>
      </div>
  );
};

export default CategoryForm;
