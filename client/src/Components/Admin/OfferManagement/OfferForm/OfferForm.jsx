import React, { useEffect, useState } from 'react'
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
    CListGroup,
    CListGroupItem,
    CContainer
} from '@coreui/react';
import { format } from 'date-fns';
import { axiosBookInstance, axiosCategoryInstance, axiosOfferInstance } from '../../../../redux/Constants/axiosConstants';
import { toast } from 'react-toastify';
import { cilArrowThickFromRight, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';

function OfferForm() {
    const location = useLocation()
    const offer = location?.state?.offer
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        discountValue: '',
        applicableTo: '',
        maxUsage: '',
        startDate: '',
        expirationDate: ''
    })

    const [validated, setValidated] = useState(false)
    const [applicableProducts, setApplicableProducts] = useState([])
    const [applicableCategories, setApplicableCategories] = useState([])
    const [searchedProduct, setSearchedProduct] = useState('')
    const [searchedProducts, setSearchedProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [isEditMode, setIsEditMode] = useState(false)

    const navigate = useNavigate()
    useEffect(() => {
        if (offer) {
            setFormData({
                name: offer.name || '',
                description: offer.description || '',
                discountValue: offer.discountValue || '',
                maxDiscount: offer.maxDiscount || '',
                maxUsage: offer.maxUsage || '',
                applicableTo: offer.applicableTo || '',
                startDate: offer.startDate
                    ? format(new Date(offer.startDate), 'yyyy-MM-dd')
                    : '',
                expirationDate: offer.expirationDate
                    ? format(new Date(offer.expirationDate), 'yyyy-MM-dd')
                    : ''
            });
            if (offer.applicableTo == "CATEGORY") {
                setApplicableCategories(offer.applicableCategories || [])
            } else {
                setApplicableProducts(offer.applicableProducts || [])
            }

            setIsEditMode(true)
        }
    }, []);


    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await axiosCategoryInstance.get('/')
                if (response.status === 200) {
                    setCategories(response.data.categories)
                }
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch categories')
            }
        }
        fetchCategories()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const searchForProducts = async (e) => {
        try {
            const value = e.target.value
            setSearchedProduct(value)
            const { data } = await axiosBookInstance.get(`/search/?title=${value}`)
            setSearchedProducts(data.products)
        } catch (err) {
            toast.error("Something Went Wrong")
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }
        if (formData.applicableTo == "PRODUCT") {
            if (applicableProducts.length == 0) {
                toast.error("Please Select applicable Products")
                return
            }
        }
        if (formData.applicableTo == "CATEGORY") {
            if (applicableCategories.length === 0) {
                toast.error("Please Select applicable Categries")
                return
            }
        }
        const today = new Date()
        const startDate = new Date(formData.startDate)
        today.setHours(0, 0, 0, 0)
        if (startDate < today) {
            return toast.error("Please Select a Valid Start Date")
        }
        if (new Date(formData.expirationDate) < new Date(formData.startDate)) {
            toast.error("Please Select a Valid Expiration Date");
            return;
        }
        const offerData = {
            name: formData.name,
            description: formData.description,
            discountValue: formData.discountValue,
            maxDiscount: formData.maxDiscount,
            maxUsage: formData.maxUsage,
            startDate: formData.startDate,
            expirationDate: formData.expirationDate,
            applicableTo: formData.applicableTo,
            applicableProducts: applicableProducts.map(prod => prod._id),
            applicableCategories: applicableCategories.map(cat => cat._id)
        }
        if (isEditMode) {
            updateOffer(offerData)
        } else {
            createOffer(offerData)
        }
    };

    const createOffer = async (offerData) => {
        try {
            await axiosOfferInstance.post('/', { offerData })
            toast.success('Offer Created Successfully')
            navigate('/admin/offers')
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.message || 'Failed to create offer')
        }
    }

    const updateOffer = async (newOfferData) => {
        try {
            await axiosOfferInstance.put(`/${offer._id}`, { newOfferData })
            toast.success('Offer Updated Successfully')
            navigate('/admin/offers')
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.message || 'Failed to update offer')
        }
    }

    const addToApplicableProducts = (product) => {
        const isExist = applicableProducts.some((prod) => prod._id === product._id)
        setSearchedProduct('')
        setSearchedProducts([])
        if (!isExist) {
            setApplicableProducts([...applicableProducts, product])
        }
    }

    const removeApplicableProduct = (productId) => {
        setApplicableProducts((products) =>
            products.filter((product) => product._id !== productId)
        )
    }

    const addToApplicableCategories = (e) => {
        const { value } = e.target
        if (!value) return

        const category = JSON.parse(value)
        const isExist = applicableCategories.some((cat) => cat._id === category._id)

        if (!isExist) {
            setApplicableCategories([...applicableCategories, category])
        }
    }

    const removeApplicableCategory = (categoryId) => {
        setApplicableCategories((categories) =>
            categories.filter((category) => category._id !== categoryId)
        )
    }
    const handleTypeChange = (e) => {
        setFormData(data => {
            return { ...data, applicableTo: e.target.value }
        })
    }

    return (
        <>
            <CContainer className='mt-5'>
                <CButton onClick={() => { navigate('/admin/offers') }}>
                    <CIcon icon={cilArrowThickFromRight} /> Go Back
                </CButton>
                <CCard>
                    <CCardHeader>
                        {isEditMode ? 'Update Offer' : 'Create New Offer'}
                    </CCardHeader>
                    <CCardBody>
                        <CForm
                            noValidate
                            validated={validated}
                            onSubmit={handleSubmit}
                        >
                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel>Offer Name</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter offer name"
                                    />
                                    <CFormFeedback invalid>
                                        Please provide an offer name
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
                                <CCol md={12}>
                                    <CFormLabel>Description</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter offer description"
                                    />
                                    <CFormFeedback invalid>
                                        Please provide an offer description
                                    </CFormFeedback>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel>Maximum Usage</CFormLabel>
                                    <CFormInput
                                        type="number"
                                        name="maxUsage"
                                        value={formData.maxUsage}
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
                                    <CFormLabel>Start Date</CFormLabel>
                                    <CFormInput
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                    />
                                    <CFormFeedback invalid>
                                        Please select a start date
                                    </CFormFeedback>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
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
                                <CCol md={6}>
                                    <CFormLabel>Max Discount Price</CFormLabel>
                                    <CFormInput
                                        type="number"
                                        name="maxDiscount"
                                        value={formData.maxDiscount}
                                        onChange={handleChange}
                                        max="500"
                                        placeholder='Maximum discount Price'
                                        required
                                    />
                                    <CFormFeedback invalid>
                                        Please Enter a Valid Maximum discount Price
                                    </CFormFeedback>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel>Offer Type</CFormLabel>
                                    <CFormSelect onChange={handleTypeChange}>
                                        <option value="CATEGORY" >CATEGORY</option>
                                        <option value="PRODUCT" selected={formData.applicableTo === "PRODUCT"} >PRODUCT</option>
                                    </CFormSelect>
                                    <CFormFeedback invalid>
                                        Please select an expiration date
                                    </CFormFeedback>
                                </CCol>
                            </CRow>
                            
                            {
                                formData?.applicableTo == "PRODUCT" ?
                                    <CRow className="mb-3">
                                        <CCol md={12}>

                                            <CFormLabel>Applicable Products</CFormLabel>
                                            <CFormInput
                                                onChange={searchForProducts}
                                                value={searchedProduct}
                                                placeholder="Search for products"
                                            />

                                            {searchedProducts.length > 0 && (
                                                <CListGroup className='position-absolute z-1000 select'>
                                                    {searchedProducts.map((product) => (
                                                        <CListGroupItem
                                                            key={product._id}
                                                            onClick={() => addToApplicableProducts(product)}
                                                        >
                                                            {product.title}
                                                        </CListGroupItem>
                                                    ))}
                                                </CListGroup>
                                            )}

                                            <CListGroup className="mt-2">
                                                {applicableProducts.map((product) => (
                                                    <CListGroupItem
                                                        key={product._id}
                                                        className="d-flex justify-content-between align-items-center"
                                                    >
                                                        {product.title}
                                                        <CButton
                                                            color="danger"
                                                            size="sm"
                                                            onClick={() => removeApplicableProduct(product._id)}
                                                        >
                                                            <CIcon icon={cilX} size="lg" />
                                                        </CButton>
                                                    </CListGroupItem>
                                                ))}
                                            </CListGroup>
                                        </CCol>
                                    </CRow>
                                    :
                                    <CRow className="mb-3">
                                        <CCol md={12}>
                                            <CFormLabel>Applicable Categories</CFormLabel>
                                            <CFormSelect onChange={addToApplicableCategories}>
                                                <option value="">Select Applicable Categories</option>
                                                {categories.map((category) => (
                                                    <option
                                                        key={category._id}
                                                        value={JSON.stringify(category)}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </CFormSelect>

                                            <CListGroup className="mt-2">
                                                {applicableCategories.map((category) => (
                                                    <CListGroupItem
                                                        key={category._id}
                                                        className="d-flex justify-content-between align-items-center"
                                                    >
                                                        {category.name}
                                                        <CButton
                                                            color="danger"
                                                            size="sm"
                                                            onClick={() => removeApplicableCategory(category._id)}
                                                        >
                                                            <CIcon icon={cilX} size="lg" />
                                                        </CButton>
                                                    </CListGroupItem>
                                                ))}
                                            </CListGroup>
                                        </CCol>
                                    </CRow>
                            }
                            <CButton
                                color="primary"
                                type="submit"
                            >
                                {isEditMode ? 'Update Offer' : 'Create Offer'}
                            </CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CContainer>
        </>
    );
}

export default OfferForm;