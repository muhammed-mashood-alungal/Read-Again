import React, { useEffect, useState } from 'react';
import { axiosAdminInstance, axiosBookInstance, axiosCategoryInstance } from '../../../../redux/Constants/axiosConstants';
import CropImage from '../../CropImage/CropImage'
import './BookForm.css'
import { bookFormValidate } from '../../../../validations/BookFormValidate';
import { validateImage } from '../../../../validations/imageValidation';
import {  toast } from 'react-toastify';
import {
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CFormCheck,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormLabel,
  CImage,
  CContainer
} from '@coreui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilArrowThickFromRight } from '@coreui/icons';
import  LoadingComponent from '../../../LoadingComponent/LoadingComponent';

const BookForm = ({  }) => {
  const location =useLocation()
  const bookDetails = location.state.bookDetails
  console.log(bookDetails)
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [publicationDate, setPublicationDate] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [ISBN, setISBN] = useState('');
  const [categories , setCategories] = useState([])
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate()


  const [formats, setFormats] = useState({
    physical: { isToggled: false, price: '', stock: '' },
    ebook: { isToggled: false, price: '', fileUrl: '', fileSize: '' },
    audiobook: { isToggled: false, price: '', duration: '', fileUrl: '' },
  });
  const [isCreateForm, setIsCreateForm] = useState(true)




  useEffect(() => {
    if (bookDetails) {
      console.log(bookDetails.category.name)
      setTitle(bookDetails.title || '');
      setAuthor(bookDetails.author || '');
      setCategory(bookDetails.category._id || '');
      setLanguage(bookDetails.language || '');
      setDescription(bookDetails.description || '');
      setPublicationDate(bookDetails.publicationDate || '');
      setISBN(bookDetails.ISBN || '');
      setFormats(bookDetails.formats || formats);
      setIsCreateForm(false)
      setImageUrls(bookDetails.images.map(imageName => {
        return imageName.secure_url
      }))
    }
  }, [bookDetails])

  useEffect(() => {
    console.log(imageUrls)
  }, [imageUrls])

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  useEffect(()=>{
    async function fetchCategories(){
      try{
        const response = await axiosCategoryInstance.get('/listed')
        if(response.status == 200){
          setCategories(response.data.categories)
        }
       }catch(err){
          toast.error(err?.response?.data?.message)
       }
    }
    fetchCategories()
  },[])

  // const popularLanguages = [
  //   { value: "English" },
  //   { value: "Hindi" },
  //   { value: "Spanish" },
  //   { value: "French" },
  //   { value: "Chinese" },
  //   { value: "Arabic" },
  // ];

 

  const handleCropComplete = async(croppedImage) => {
    const newImages = [...images];
    console.log(croppedImage)
    newImages[selectedImageIndex] = croppedImage;
    setImages(newImages);
    if (isCreateForm) {
      const newImageUrls = [...imageUrls];
      newImageUrls[selectedImageIndex] = URL.createObjectURL(croppedImage);
      setImageUrls(newImageUrls);
      
      setIsModalOpen(false);
    } else {
      try{
        setIsModalOpen(false)
        setLoading(true)
        const oldUrl = imageUrls[selectedImageIndex]
        console.log(oldUrl)
        const newImages = [...images];
        newImages[selectedImageIndex] = croppedImage
        const newUrls = [...imageUrls]
        newUrls[selectedImageIndex] = URL.createObjectURL(croppedImage)
        setImages(newImages)
        setImageUrls(newUrls)
        const formData = new FormData()
        formData.append("type","update-book")
        formData.append("oldUrl", oldUrl)
        formData.append("image", croppedImage)
        const response = await axiosBookInstance.put(`/update-book-image/${bookDetails._id}`,formData)
        setImageUrls(response.data.newImages.map(imageName => {
          return imageName.secure_url
        }))
        setLoading(false)
      }catch(err){
        console.log(err)
      }
    }

  };

  const handleToggleFormat = (formatType) => {
    setFormats({
      ...formats,
      [formatType]: { ...formats[formatType], isToggled: !formats[formatType].isToggled },
    });
  };

  const handleFormatChange = (format, field, value) => {
    setFormats({
      ...formats,
      [format]: { ...formats[format], [field]: value },
    });
  };

  const handleSubmit = async (e) => { 
    try {

      e.preventDefault()
      setLoading(true)
      console.log(imageUrls.length)
      const bookData = {
        title, author, category, language, description, imageUrls, publicationDate, ISBN, formats
      }

      const result =  bookFormValidate(bookData, !isCreateForm)
      if (!result.success){
        toast.error(result.message)
        return
      }
      const token = localStorage.getItem("token")
      if (!isCreateForm) {
        console.log(token)
        await axiosBookInstance.put(`/${bookDetails._id}/edit`, bookData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        toast.success("Successfully updated")
        navigate('/admin/books')
      } else {

        const formData = new FormData()
        formData.append('type', "books")
        formData.append("ISBN", ISBN)
        formData.append("title", title)
        formData.append("author", author)
        formData.append("category", category)
        formData.append("language", language)
        formData.append("description", description)
        formData.append("publicationDate", publicationDate)

        formData.append("formats", JSON.stringify(formats))
        console.log(images)
        if (images.length > 0) {
          images.forEach((image, index) => {
            console.log(image)
            formData.append(`images`, image);
          })
        }

        await axiosBookInstance.post("/create", formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        navigate('/admin/books')
        toast.success("Saved Successfully")
       
      }
    } catch (err) {
      toast.error(err?.response?.data?.message)
    }finally{
      setLoading(false)
    }
  };




  const handleSetImage = (index, file) => {
    if(!validateImage(file)){
      toast.error("Make sure the image is either .png , .jpg or .jpeg")
      return 
    }
    if(isCreateForm){
      const newImages = [...images];
      newImages[index] = file
      const newUrls = [...imageUrls]
      newUrls[index] = URL.createObjectURL(file)
      setImages(newImages)
      setImageUrls(newUrls)
    }
    

    setSelectedImage(file);
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  }

 
  return (
    <>
    <CContainer className='mt-5'>
      {
        loading && <LoadingComponent/>
      }
      
    <CRow>
    
      <CCol xs={12}>
      <CButton onClick={()=>{navigate('/admin/books')}}>
          <CIcon icon={cilArrowThickFromRight} /> Go Back
      </CButton>
        <CCard>
          <CCardHeader>
            <strong>{bookDetails ? 'Update Book' : 'Create New Book'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md={6}>
                  <CFormLabel>Title</CFormLabel>
                  <CFormInput
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Title"
                    className="mb-3"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Author</CFormLabel>
                  <CFormInput
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter Author"
                    className="mb-3"
                  />
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6}>
                  <CFormLabel>Category</CFormLabel>
                  <CFormSelect
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mb-3"
                  >
                    <option value="">Select a Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Language</CFormLabel>
                  <CFormInput
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="Enter Language"
                    className="mb-3"
                  />
                </CCol>
              </CRow>

              <CFormLabel>Description</CFormLabel>
              <CFormTextarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description"
                rows={4}
                className="mb-3"
              />

              <CRow>
                <CCol md={6}>
                  <CFormLabel>Publication Date</CFormLabel>
                  <CFormInput
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="mb-3"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>ISBN</CFormLabel>
                  <CFormInput
                    type="text"
                    value={ISBN}
                    onChange={(e) => setISBN(e.target.value)}
                    placeholder="Enter ISBN"
                    className="mb-3"
                  />
                </CCol>
              </CRow>

              {/* Images Upload Section */}
              <CFormLabel>Book Images</CFormLabel>
              <CRow className="mb-3">
                {new Array(3).fill(null).map((_, index) => (
                  <CCol key={index} xs={6} md={2} className="mb-2">
                    <div className="position-relative">
                      <CFormInput
                        type="file"
                        onChange={(e) => handleSetImage(index, e.target.files[0])}
                        className="mb-2"
                      />
                      {imageUrls[index] && (
                        <div className="position-relative">
                          <CImage
                            src={imageUrls[index]}
                            alt={`Book Image ${index + 1}`}
                            className="img-fluid rounded mb-2"
                          />
                          {images[index] && (
                            <CButton
                              color="info"
                              size="sm"
                              className="position-absolute top-0 start-0 ms-2"
                              onClick={() => handleImageClick(images[index], index)}
                            >
                              Crop
                            </CButton>
                          )}
                        </div>
                      )}
                    </div>
                  </CCol>
                ))}
              </CRow>

              {/* Book Formats Section */}
              <CCard className="mb-3">
                <CCardHeader>Available Formats</CCardHeader>
                <CCardBody>
                  {/* Physical Books */}
                  <CFormCheck
                    id="physicalCheck"
                    label="Physical Books"
                    checked={formats?.physical?.isToggled || formats.physical?.stock}
                    onChange={() => handleToggleFormat('physical')}
                    className="mb-3"
                  />
                  {formats?.physical?.isToggled && (
                    <CRow>
                      <CCol md={6}>
                        <CFormLabel>Price</CFormLabel>
                        <CFormInput
                          type="number"
                          value={formats.physical.price}
                          onChange={(e) => handleFormatChange('physical', 'price', e.target.value)}
                          placeholder="Enter Price"
                          className="mb-3"
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel>Stock</CFormLabel>
                        <CFormInput
                          type="number"
                          value={formats.physical.stock}
                          onChange={(e) => handleFormatChange('physical', 'stock', e.target.value)}
                          placeholder="Enter Stock"
                          className="mb-3"
                        />
                      </CCol>
                    </CRow>
                  )}

                  {/* eBook
                  <CFormCheck
                    id="ebookCheck"
                    label="eBook"
                    checked={formats?.ebook?.isToggled || formats.ebook?.fileUrl}
                    onChange={() => handleToggleFormat('ebook')}
                    className="mb-3"
                  />
                  {formats?.ebook?.isToggled && (
                    <CRow>
                      <CCol md={4}>
                        <CFormLabel>Price</CFormLabel>
                        <CFormInput
                          type="number"
                          value={formats.ebook.price}
                          onChange={(e) => handleFormatChange('ebook', 'price', e.target.value)}
                          placeholder="Enter Price"
                          className="mb-3"
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>File URL</CFormLabel>
                        <CFormInput
                          type="text"
                          value={formats.ebook.fileUrl}
                          onChange={(e) => handleFormatChange('ebook', 'fileUrl', e.target.value)}
                          placeholder="Enter File URL"
                          className="mb-3"
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>File Size (MB)</CFormLabel>
                        <CFormInput
                          type="number"
                          value={formats.ebook.fileSize}
                          onChange={(e) => handleFormatChange('ebook', 'fileSize', e.target.value)}
                          placeholder="Enter File Size"
                          className="mb-3"
                        />
                      </CCol>
                    </CRow>
                  )}

                  <CFormCheck
                    id="audiobookCheck"
                    label="Audiobook"
                    checked={formats?.audiobook?.isToggled}
                    onChange={() => handleToggleFormat('audiobook')}
                    className="mb-3"
                  />
                  {formats.audiobook.isToggled && (
                    <CRow>
                      <CCol md={4}>
                        <CFormLabel>Price</CFormLabel>
                        <CFormInput
                          type="number"
                          value={formats.audiobook.price}
                          onChange={(e) => handleFormatChange('audiobook', 'price', e.target.value)}
                          placeholder="Enter Price"
                          className="mb-3"
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Duration</CFormLabel>
                        <CFormInput
                          type="text"
                          value={formats.audiobook.duration}
                          onChange={(e) => handleFormatChange('audiobook', 'duration', e.target.value)}
                          placeholder="Enter Duration"
                          className="mb-3"
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>File URL</CFormLabel>
                        <CFormInput
                          type="text"
                          value={formats.audiobook.fileUrl}
                          onChange={(e) => handleFormatChange('audiobook', 'fileUrl', e.target.value)}
                          placeholder="Enter File URL"
                          className="mb-3"
                        />
                      </CCol>
                    </CRow>
                  )} */}
                </CCardBody>
              </CCard>

              {/* Submit Button */}
              <CButton color="primary" type="submit" className="w-100">
                {bookDetails ? 'Update Book' : 'Create Book'}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* CropImage Modal (assuming it's a separate component) */}
      {isModalOpen && (
        <CropImage
          isOpen={isModalOpen}
          imageSrc={selectedImage}
          onClose={() => setIsModalOpen(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </CRow>
    </CContainer>
    </>
  );
}

export default BookForm;
