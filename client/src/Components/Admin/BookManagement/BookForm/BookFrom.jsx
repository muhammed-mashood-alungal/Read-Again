import React, { useEffect, useState } from 'react';
import { bookFormValidate } from './BookFormValidate';
import path from 'path-browserify';
import { axiosAdminInstance, axiosBookInstance, axiosCategoryInstance } from '../../../../redux/Constants/axiosConstants';
import CropImage from '../../CropImage/CropImage'
import { bookImages } from '../../../../redux/Constants/imagesDir';
import './BookForm.css'

const BookForm = ({ bookDetails }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [publicationDate, setPublicationDate] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [ISBN, setISBN] = useState('');
  const [categories , setCategories] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState([]);


  const [formats, setFormats] = useState({
    physical: { isToggled: false, price: '', stock: '' },
    ebook: { isToggled: false, price: '', fileUrl: '', fileSize: '' },
    audiobook: { isToggled: false, price: '', duration: '', fileUrl: '' },
  });
  const [err, setErr] = useState("")
  const [isCreateForm, setIsCreateForm] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    }
  }, [success])



  useEffect(() => {
    if (bookDetails) {
      console.log(bookDetails.category.name)
      setTitle(bookDetails.title || '');
      setAuthor(bookDetails.author || '');
      setCategory(bookDetails.category._id || '');
      setGenre(bookDetails.genre || '');
      setDescription(bookDetails.description || '');
      setPublicationDate(bookDetails.publicationDate || '');
      setISBN(bookDetails.ISBN || '');
      setFormats(bookDetails.formats || formats);
      setIsCreateForm(false)
      setImageUrls(bookDetails.images.map(imageName => {
        return bookImages + bookDetails._id + "/" + imageName
      }))
    }
  }, [bookDetails]);

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
          setErr(err?.response?.data?.message)
       }
    }
    fetchCategories()
  },[])

  const popularLanguages = [
    { value: "English" },
    { value: "Hindi" },
    { value: "Spanish" },
    { value: "French" },
    { value: "Chinese" },
    { value: "Arabic" },
  ];

 

  const handleCropComplete = async(croppedImage) => {
    const newImages = [...images];
    console.log(croppedImage)
    newImages[selectedImageIndex] = croppedImage;
    setImages(newImages);
    if (isCreateForm) {
      console.log("createForm")
      const newImageUrls = [...imageUrls];
      newImageUrls[selectedImageIndex] = URL.createObjectURL(croppedImage);
      setImageUrls(newImageUrls);
      setIsModalOpen(false);
    } else {
      try{
        const oldUrl = path.basename(imageUrls[selectedImageIndex])
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
          return bookImages + bookDetails._id + "/" + imageName
        }))
        setIsModalOpen(false);
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

      e.preventDefault();
      setErr("")
      console.log(imageUrls.length)
      const bookData = {
        title, author, category, genre, description, imageUrls, publicationDate, ISBN, formats
      }

      const result =  bookFormValidate(bookData, !isCreateForm)
      if (!result.success) {
        setErr(result.message)
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
        setSuccess(true)
        console.log("success")
      } else {

        const formData = new FormData()
        formData.append('type', "books")
        formData.append("ISBN", ISBN)
        formData.append("title", title)
        formData.append("author", author)
        formData.append("category", category)
        formData.append("genre", genre)
        formData.append("description", description)
        formData.append("publicationDate", publicationDate)

        formData.append("formats", JSON.stringify(formats))
        console.log(images)
        if (images.length > 0) {
          images.forEach((image, index) => {
            console.log(image)
            formData.append(`image-${index + 1}`, image);
          })
        }

        await axiosBookInstance.post("/create", formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setSuccess(true)
        console.log("success")
      }
    } catch (err) {
      setErr(err?.response?.data?.message)
    }
  };


  const handleImageRemove = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
    setImages(images.filter((_, i) => i !== index));
  };
  const handleSetImage = (index, file) => {
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
    <div>
      {isModalOpen && <CropImage
        isOpen={isModalOpen}
        imageSrc={selectedImage}
        onClose={() => setIsModalOpen(false)}
        onCropComplete={handleCropComplete}
      />}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          {err && <p>{err}</p>}
          {success && <p>Success...!</p>}
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            placeholder="Enter Title"
          />
        </div>
        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="form-control"
            placeholder="Enter Author"
          />
        </div>
        <div className="form-group">
  <label>Category</label>
  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="form-control"
   >
    <option value="">Select a Category</option>
    {categories.map((cat) => (
      <option key={cat._id} value={cat._id}>
        {cat.name}
      </option>
    ))}
  </select>
</div>
        <div className="form-group">
          <label>Genre</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="form-control"
            placeholder="Enter Genre"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            placeholder="Enter Description"
          />
        </div>
        <div className="form-group">
          <label>Images</label>
          <div className="image-upload">
            {
              new Array(5).fill(null).map((_, index) => (
                <div key={index} className="image-input">
                  <input
                    type="file"
                    className="form-control book-image-input"
                    onChange={(e) => { handleSetImage(index, e.target.files[0])}}
                  />
                  {imageUrls[index] && (
                    <img
                      src={imageUrls[index]}
                      alt=""
                      className='book-image'
                    //  onClick={() => handleImageClick(images[index], index)}
                    />
                  )}
                  <div>
                  {imageUrls[index] &&
                    <button type="button" className='remove-btn' onClick={() => handleImageRemove(index)}>Remove</button>
                  }
                  {images[index] &&
                    <button className='crop-btn' role="button" onClick={() => handleImageClick(images[index], index)}> Crop Image</button>
                  }
                  </div>
                 

                </div>
              ))
            }

            {/* {images.map((image, index) => (
            <div key={index} className="image-input">
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => { handleSetImage(index, e.target.files[0])}}
                />
                {imageUrls[index] && (
                    <img 
                        src={imageUrls[index]} 
                        alt="" 
                        onClick={() => handleImageClick(images[index], index)}
                    />
                )}
                <button type="button" onClick={() => handleImageRemove(index)}>-</button>
            </div>
        ))}
        {images.length < 5 && (
            <button type="button" onClick={handleImageAdd}>+</button>
        )} */}
          </div>

        </div>
        <div className="form-group">
          <label>Publication Date</label>
          <input
            type="date"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>ISBN</label>
          <input
            type="text"
            value={ISBN}
            onChange={(e) => setISBN(e.target.value)}
            className="form-control"
            placeholder="Enter ISBN"
          />
        </div>

        <h5>Available Formats</h5>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formats?.physical?.isToggled || formats.physical?.stock}
              onChange={() => handleToggleFormat('physical')}
            />
            Physical Books
          </label>
          {formats?.physical?.isToggled && (
            <div className="format-details">
              <label>Price</label>
              <input
                type="number"
                value={formats.physical.price}
                onChange={(e) => handleFormatChange('physical', 'price', e.target.value)}
                className="form-control"
                placeholder="Enter Price"
              />
              <label>Stock</label>
              <input
                type="number"
                value={formats.physical.stock}
                onChange={(e) => handleFormatChange('physical', 'stock', e.target.value)}
                className="form-control"
                placeholder="Enter Stock"
              />
            </div>
          )}
        </div>

        {/* eBook */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formats?.ebook?.isToggled || formats.ebook?.fileUrl}
              onChange={() => handleToggleFormat('ebook')}
            />
            eBook
          </label>
          {formats?.ebook?.isToggled && (
            <div className="format-details">
              <label>Price</label>
              <input
                type="number"
                value={formats.ebook.price}
                onChange={(e) => handleFormatChange('ebook', 'price', e.target.value)}
                className="form-control"
                placeholder="Enter Price"
              />
              <label>File URL</label>
              <input
                type="text"
                value={formats.ebook.fileUrl}
                onChange={(e) => handleFormatChange('ebook', 'fileUrl', e.target.value)}
                className="form-control"
                placeholder="Enter File URL"
              />
              <label>File Size (MB)</label>
              <input
                type="number"
                value={formats.ebook.fileSize}
                onChange={(e) => handleFormatChange('ebook', 'fileSize', e.target.value)}
                className="form-control"
                placeholder="Enter File Size"
              />
            </div>
          )}
        </div>

        {/* Audiobook */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formats?.audiobook?.isToggled}
              onChange={() => handleToggleFormat('audiobook')}
            />
            Audiobook
          </label>
          {formats.audiobook.isToggled && (
            <div className="format-details">
              <label>Price</label>
              <input
                type="number"
                value={formats.audiobook.price}
                onChange={(e) => handleFormatChange('audiobook', 'price', e.target.value)}
                className="form-control"
                placeholder="Enter Price"
              />
              <label>Duration</label>
              <input
                type="text"
                value={formats.audiobook.duration}
                onChange={(e) => handleFormatChange('audiobook', 'duration', e.target.value)}
                className="form-control"
                placeholder="Enter Duration"
              />
              <label>File URL</label>
              <input
                type="text"
                value={formats.audiobook.fileUrl}
                onChange={(e) => handleFormatChange('audiobook', 'fileUrl', e.target.value)}
                className="form-control"
                placeholder="Enter File URL"
              />
            </div>
          )}
        </div>
        <button type="submit" className="primary-btn">
          {bookDetails ? 'Update Book' : 'Create Book'}
        </button>

      </form>
    </div>
  );
};

export default BookForm;
