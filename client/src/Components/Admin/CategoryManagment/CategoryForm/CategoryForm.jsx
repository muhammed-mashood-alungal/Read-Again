import React, { useEffect, useState } from 'react';
import { axiosAdminInstance, axiosUserInstance } from '../../../../redux/Constants/axiosConstants';
import { categoryImages } from '../../../../redux/Constants/imagesDir';

const CategoryForm = ({categoryData ,onChildUpdate}) => {
  const [name, setName] = useState("")
  const [image, setImage] = useState(null)
  const [imageUrl , setImageUrl] = useState("")
  const [isCreateForm , setIsCreateForm] = useState(true)
  const [err , setErr] = useState("")
  const [success , setSuccess] = useState(false)

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
      const response = await axiosAdminInstance.post('/categories/create',formData,{
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
      setErr(err?.respons?.data?.message)
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
      const response = await axiosAdminInstance.put(`/categories/${categoryData._id}/edit`,formData,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data)
      if(response.status ==200){
        setSuccess(true)
      }
    }catch(err){
      console.log(err)
      setErr(err?.respons?.data?.message)
    }
  };
 


  const handleInputChange = (e) => {
    setName(e.target.value)
  };

  const handlePhoto = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
      console.log(e.target.files[0])
      setImageUrl(URL.createObjectURL(e.target.files[0]))
    } 
  };
  

  return (
    <div className="category-form ">
        <h4 className="card-title">{isCreateForm ? "Create New " : "Update "}Category</h4>
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
              onChange={handlePhoto}
              className="form-control"
              placeholder="Image URL"
            />
          </div>
          <div>
             <img src={imageUrl} alt="" />
           
          </div>
          <button type="submit" className="primary-btn">
            {isCreateForm ? "Create" : "Update"}
          </button>
        </form>
      </div>
  );
};

export default CategoryForm;
