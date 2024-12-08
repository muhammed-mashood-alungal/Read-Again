//import { CButton, CCard, CCardBody, CCardHeader, CForm, CFormInput, CFormLabel } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import CropImage from '../CropImage/CropImage'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CButton,
    CCol,
    CRow,
    CFormFeedback,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CBadge,
    CListGroup,
    CListGroupItem
} from '@coreui/react';
import { format } from 'date-fns';
import { axiosBookInstance, axiosCategoryInstance, axiosCouponInstance } from '../../../redux/Constants/axiosConstants';
import { toast } from 'react-toastify';
import { Col } from 'reactstrap';
import { cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom';


function CouponForm({ isCreate, coupon, onSubmit }) {
    // Initial state for form
    const [formData, setFormData] = useState({
        code: '',
        discountValue: '',
        limit: '',
        expirationDate: '',
        applicableTo: [],
        isActive: true
    });

    // Validation state
    const [validated, setValidated] = useState(false)
    const [applicableProducts, setApplicableProducts] = useState([])
    const [searchedProduct, setSearchedProduct] = useState('')
    const [searchedProducts, setSearchedProducts] = useState([])
    const [categories,setCategories]=useState([])
    const [applicableCategories,setApplicableCategories]=useState([])
    const [isCreateForm,setIsCreateForm]=useState(true)
    const navigate = useNavigate()
    // Populate form if editing existing coupon
    useEffect(() => {
        if (coupon) {
            setFormData({
                code: coupon.code || '',
                discountValue: coupon.discountValue || '',
                limit: coupon.limit || '',
                expirationDate: coupon.expirationDate
                    ? format(new Date(coupon.expirationDate), 'yyyy-MM-dd')
                    : '',
                 isActive: coupon.isActive !== undefined ? coupon.isActive : true
            });
            setApplicableProducts(coupon.applicableProducts || [])
            setApplicableCategories(coupon.applicableCategories || [])
            setIsCreateForm(false)
        }
    }, [coupon]);
   
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axiosCategoryInstance.get('/')
        if (response.status == 200) {
          setCategories(response.data.categories)
        }
      } catch (err) {
        toast.error(err.response.data.message)
      }
    }
    fetchCategories()

  }, [])

    

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log(name,value)
     
        setFormData((prev)=>({
            ...prev,
            [name]:value
        }))

        // setFormData(prev => ({
        //     ...prev,
        //     [name]: type === 'checkbox' ? checked : value
        // }));
    };

    const searchForProducts = async (e) => {
        try {
            const value = e.target.value
            setSearchedProduct(value)
            const { data } = await axiosBookInstance.get(`/search/?title=${value}`)
            setSearchedProducts(data.products)
        } catch (err) {
            console.log(err)
            toast.error("Something Went Wrong")
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }
        if(applicableProducts.length == 0 && applicableCategories.length == 0){
          return toast.error('Please Select Applicable Products or Categories')
        }
        console.log(formData)
        const couponData ={
            code :formData.code,
            discountValue : formData.discountValue,
            expirationDate:formData.expirationDate,
            limit:formData.limit,
            applicableProducts:applicableProducts.map((prod)=>prod._id),
            applicableCategories:applicableCategories.map((cat)=>cat._id)
        }
        console.log(couponData)
        if(isCreateForm){
            createCoupon(couponData)
        }else{
            updateCoupon(couponData)
        }
        toast.success('Saved Successfully')
    };


    const createCoupon=async(couponData)=>{
      try{
        console.log(couponData)
        await axiosCouponInstance.post('/',{couponData})
        navigate('/admin/coupons')
      }catch({response}){
        console.log(response)
        toast.error(response?.data?.message)
      }
    }

    const updateCoupon=async(newCouponData)=>{
        try{
          await axiosCouponInstance.put(`/${coupon._id}`,{newCouponData})
        }catch({response}){
          console.log(response)
          toast.error(response?.data?.message)
        }
      }

    const addToApplicableProducts = (product) => {
        const isExist = applicableProducts.some((prod) => prod._id == product._id)
        setSearchedProduct('')
        setSearchedProducts([])
        if (!isExist) {

            setApplicableProducts([...applicableProducts, product])
        }
    }
    const removeApplicablePrducts =(productId)=>{
        setApplicableProducts((products)=>{
          return products.filter((product)=>{
            return product._id != productId
          })
        })
    }

    const addToApplicableCategories =(e)=>{
        const {value} = e.target
        if(!value){
            return
        }
        const category = JSON.parse(e.target.value )
        if(!category){
            console.log("sdfas")
            return
        }
        console.log(category)
        const isExist = applicableCategories.some((cat) => cat._id == category._id)
        if(!isExist){
            setApplicableCategories([...applicableCategories,category])
        }
    }
    const removeApplicableCategory=(categoryId)=>{
        setApplicableCategories((categories)=>{
            return categories.filter((category)=>{
              return category._id != categoryId
            })
          })
    }

    return (
        <>
            <CCard>
                <CCardHeader>
                    {coupon ? 'Update Coupon' : 'Create New Coupon'}
                </CCardHeader>
                <CCardBody>
                    <CForm
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                    >
                        <CRow className="mb-3">
                            <CCol md={6}>
                                <CFormLabel>Coupon Code</CFormLabel>
                                <CFormInput
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter coupon code"
                                />
                                <CFormFeedback invalid>
                                    Please provide a coupon code
                                </CFormFeedback>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Discount Value (%)</CFormLabel>
                                <CFormInput
                                    type="number"
                                    name="discountValue"
                                    value={formData.discountValue}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    max="100"
                                    placeholder="Enter discount percentage"
                                />
                                <CFormFeedback invalid>
                                    Discount must be between 1 and 100
                                </CFormFeedback>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <CFormLabel>Usage Limit</CFormLabel>
                                <CFormInput
                                    type="number"
                                    name="limit"
                                    value={formData.limit}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    placeholder="Enter maximum usage count"
                                />
                                <CFormFeedback invalid>
                                    Please provide a valid usage limit
                                </CFormFeedback>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Expiration Date</CFormLabel>
                                <CFormInput
                                    type="date"
                                    name="expirationDate"
                                    value={formData.expirationDate}
                                    onChange={handleChange}
                                    required
                                />
                                <CFormFeedback invalid>
                                    Please select an expiration date
                                </CFormFeedback>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={12}>
                                <CFormLabel>Applicable Products</CFormLabel>
                                <CFormInput
                                    onChange={searchForProducts}
                                    value={searchedProduct}
                                >
                                </CFormInput>


                                {searchForProducts.length && <CListGroup className='position-absolute z-1000 select'>
                                    {
                                        searchedProducts?.map((product) => {
                                            return <CListGroupItem value={product._id}
                                                onClick={(e) => { addToApplicableProducts(product) }}>{product.title}</CListGroupItem>
                                        })
                                    }

                                </CListGroup>
                                }

                                <Col>
                                    <CListGroup>
                                        {applicableProducts.map((product) => (
                                            <CListGroupItem key={product._id} className="d-flex justify-content-between align-items-center">
                                                {product.title}
                                                <CButton
                                                    color="danger"
                                                    size="sm"
                                                    onClick={()=>{removeApplicablePrducts(product._id)}}
                                                >
                                                <CIcon icon={cilX} size="lg" />  
                                                </CButton>
                                            </CListGroupItem>
                                        ))}
                                    </CListGroup>
                                </Col>
                                <Col>
                                <CFormLabel>Applicable Categories</CFormLabel>
                                <CFormSelect  onChange={addToApplicableCategories} >
                                <option value="" >Select Applicable Categories</option>
                                    {  
                                        categories.map((category)=>{
                                           return <option value={JSON.stringify(category)} >{category.name}</option>
                                        })
                                    }
                                </CFormSelect>
                                </Col>
                                <Col>
                                    <CListGroup>
                                        {applicableCategories.map((category) => (
                                            <CListGroupItem key={category._id} className="d-flex justify-content-between align-items-center">
                                                {category.name}
                                                <CButton
                                                    color="danger"
                                                    size="sm"
                                                    onClick={()=>{removeApplicableCategory(category._id)}}
                                                >
                                                <CIcon icon={cilX} size="lg" />  
                                                </CButton>
                                            </CListGroupItem>
                                        ))}
                                    </CListGroup>
                                </Col>
                            </CCol>
                        </CRow>
                        <CButton
                            color="primary"
                            type="submit"
                        >
                            {coupon ? 'Update Coupon' : 'Create Coupon'}
                        </CButton>
                    </CForm>
                </CCardBody>
            </CCard>
        </>
    );
}

export default CouponForm