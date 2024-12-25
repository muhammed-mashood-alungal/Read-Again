import React, { useEffect, useState } from 'react';
import { axiosAdminInstance, axiosCategoryInstance, axiosUserInstance } from '../../../../redux/Constants/axiosConstants';
import CropImage from '../../CropImage/CropImage';
import './CategoryForm.css';
import {  toast } from 'react-toastify';
import { validateImage } from '../../../../validations/imageValidation';
import { 
  CCard, 
  CCardHeader, 
  CCardBody, 
  CForm, 
  CFormInput, 
  CFormLabel, 
  CButton, 
  CAlert, 
  CContainer
} from '@coreui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilArrowThickFromRight } from '@coreui/icons';

const CategoryForm = () => {
  const location = useLocation()
  const categoryData= location?.state?.categoryData
  const [name, setName] = useState("")
  const [image, setImage] = useState(null)
  const [imageUrl , setImageUrl] = useState("")
  const [isCreateForm , setIsCreateForm] = useState(true)
  const [success , setSuccess] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate()
  useEffect(()=>{
    if(categoryData?.name){
      setIsCreateForm(false)
      setName(categoryData.name)
      setImageUrl(categoryData?.image?.secure_url)
    }
  },[categoryData])


  useEffect(()=>{
   if(success){
   setName("")
   setImage(null)
   setImageUrl("")
    setTimeout(()=>{
     setSuccess(false)
   
    },3000)
   }
  },[success])

  const handleCreateCategory = async(e) => {
    try{
      e.preventDefault()
      if(name.trim() == ""){
        toast.error("Enter a Category")
        return
      }
      if(!image && !imageUrl){
        toast.error("Select  category Image")
        return 
      }
      const formData =new FormData()
      formData.append("type", "category")
      formData.append("image" ,image )
      formData.append("name",name)
      
      
      const response = await axiosCategoryInstance.post('/create',formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      if(response.status ==200){
        navigate('/admin/category')
        toast.success("Created Successfully")
        
      }
    }catch(err){
      toast.error(err?.response?.data?.message)
    }
  };
  

  const handleUpdateCategory =async (e) => {
    try{
      e.preventDefault()
      if(name.trim() ==""){
        toast.error("Enter a Category Name")
        return
      }
      const formData =new FormData()
      formData.append("type", "category")
      formData.append("name",name)
      if (image) {
        formData.append('image', image)
      }
      const token= localStorage.getItem("token")
      const response = await axiosCategoryInstance.put(`/${categoryData._id}/edit`,formData)
      if(response.status ==200){
        navigate('/admin/category')
        toast.success("Category Saved Successfully")
        setIsCreateForm(true)
      }
    }catch(err){
      toast.error(err?.respons?.data?.message)
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
  setImage(croppedImage)
  setImageUrl(URL.createObjectURL(croppedImage))
  setIsModalOpen(false)
  if(!isCreateForm){
    const oldUrl = URL.createObjectURL(selectedImage)
    const formData = new FormData()
    formData.append("oldUrl",oldUrl)
    formData.append("newImage",croppedImage)
  }
}
  

return (
  <CContainer className='mt-5'>
    <CButton onClick={()=>{navigate('/admin/category')}}>
        <CIcon icon={cilArrowThickFromRight} /> Go Back
    </CButton>
  <CCard className="category-form mb-4">
    <CCardHeader>
      <h4 className="card-title mb-0">
        {isCreateForm ? "Create New Category" : "Update Category"}
      </h4>
    </CCardHeader>
    
    <CCardBody>
      {isModalOpen && <CropImage
        isOpen={isModalOpen}
        imageSrc={selectedImage}
        onClose={() => setIsModalOpen(false)}
        onCropComplete={handleCropComplete}
      />}
      
     
      <CForm onSubmit={isCreateForm ? handleCreateCategory : handleUpdateCategory} encType='multipart/form-data'>
        <div className="mb-3">
          <CFormLabel>Name</CFormLabel>
          <CFormInput 
            type="text"
            name="name"
            value={name}
            onChange={handleInputChange}
            placeholder="Category name"
          />
        </div>
        
        <div className="mb-3">
          <CFormLabel>Image URL</CFormLabel>
          <CFormInput
            type="file"
            accept='.png, .jpg, .jpeg'
            name="image"
            onChange={(e) => { handleSetImage(e.target.files[0])}}
            placeholder="Image URL"
          />
        </div>
        
        <div className="mb-3">
          {imageUrl && (
            <div className="image-preview mb-2">
              <img 
                src={imageUrl} 
                alt="Category" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px', 
                  objectFit: 'cover' 
                }} 
              />
            </div>
          )}
          
          {image && (
            <CButton 
              color="info" 
              variant="outline" 
              type="button" 
              onClick={() => handleSetImage(image)}
              className="mb-2"
            >
              Crop Image
            </CButton>
          )}
        </div>
        
        <CButton 
          color="primary" 
          type="submit"
        >
          {isCreateForm ? "Create" : "Update"}
        </CButton>
      </CForm>
    </CCardBody>
  </CCard>
  </CContainer>
);
};

export default CategoryForm;
