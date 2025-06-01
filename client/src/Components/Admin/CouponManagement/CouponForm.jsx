//import { CButton, CCard, CCardBody, CCardHeader, CForm, CFormInput, CFormLabel } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormInput,
    CFormLabel,
    CButton,
    CCol,
    CRow,
    CFormFeedback,
    CContainer
} from '@coreui/react';
import { format } from 'date-fns';
import { axiosCategoryInstance, axiosCouponInstance } from '../../../redux/Constants/axiosConstants';
import { toast } from 'react-toastify';
import { cilArrowThickFromRight } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingComponent from '../../LoadingSpinner/LoadingComponent';


function CouponForm() {
    const location = useLocation()
    const coupon = location?.state?.coupon
    const [formData, setFormData] = useState({
        code: '',
        discountValue: '',
        maxDiscount: '',
        maxUsage: '',
        minimumPrice: '',
        startDate: '',
        expirationDate: '',
        applicableTo: [],
        isActive: true
    });


    const [validated, setValidated] = useState(false)
    const [searchedProduct, setSearchedProduct] = useState('')
    const [searchedProducts, setSearchedProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [isCreateForm, setIsCreateForm] = useState(true)
    const navigate = useNavigate()
    const [loading , setLoading] = useState(false)

    useEffect(() => {
        if (coupon) {
            setFormData({
                code: coupon.code || '',
                discountValue: coupon.discountValue || '',
                maxUsage: coupon.maxUsage || '',
                minimumPrice: coupon.minimumPrice || '',
                maxDiscount: coupon.maxDiscount || '',
                expirationDate: coupon.expirationDate
                    ? format(new Date(coupon.expirationDate), 'yyyy-MM-dd')
                    : '',
                startDate: coupon.startDate
                    ? format(new Date(coupon.startDate), 'yyyy-MM-dd')
                    : '',
                isActive: coupon.isActive !== undefined ? coupon.isActive : true
            });
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
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }
        const now = new Date()
        if ((formData.startDate >= formData.expirationDate) ||
            !formData.startDate || !formData.expirationDate ||
            formData.expirationDate < now) {
            return toast.error("Enter a valid Starting and Ending Date")
        }

        const couponData = {
            code: formData.code,
            discountValue: formData.discountValue,
            maxDiscount: formData.maxDiscount,
            startDate: formData.startDate,
            expirationDate: formData.expirationDate,
            maxUsage: formData.maxUsage,
            minimumPrice: formData.minimumPrice
        }
        setLoading(true)
        if (isCreateForm) {
            createCoupon(couponData)
        } else {
            updateCoupon(couponData)
        }
        

    };


    const createCoupon = async (couponData) => {
        try {
            await axiosCouponInstance.post('/', { couponData })
            navigate('/admin/coupons')
            toast.success('Saved Successfully')
        } catch ({ response }) {

            toast.error(response?.data?.message)
        }finally{
            setLoading(false)
        }
    }

    const updateCoupon = async (newCouponData) => {
        try {
            await axiosCouponInstance.put(`/${coupon._id}`, { newCouponData })
            navigate('/admin/coupons')
            toast.success('Saved Successfully')

        } catch ({ response }) {
            toast.error(response?.data?.message)
        }finally{
            setLoading(false)
        }
    }

    return (
        <>
            <CContainer className='mt-5'>
                 {loading && <LoadingComponent />}
                <CButton onClick={() => { navigate('/admin/coupons') }}>
                    <CIcon icon={cilArrowThickFromRight} /> Go Back
                </CButton>
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
                                        max="90"
                                        placeholder="Enter discount percentage"
                                    />
                                    <CFormFeedback invalid>
                                        Discount must be between 1 and 90
                                    </CFormFeedback>
                                </CCol>
                            </CRow>

                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel>Starting Date</CFormLabel>
                                    <CFormInput
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                    />
                                    <CFormFeedback invalid>
                                        Please select an valid date
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
                            <CRow>
                                <CCol md={6}>
                                    <CFormLabel>Usage Limit</CFormLabel>
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
                                    <CFormLabel>Minimum Purchase</CFormLabel>
                                    <CFormInput
                                        type="number"
                                        name="minimumPrice"
                                        value={formData.minimumPrice}
                                        onChange={handleChange}
                                        required
                                        min="500"
                                        placeholder="Enter Minimum Purchase Price "
                                    />
                                    <CFormFeedback invalid>
                                        Please provide a valid Minimum Price (greater than 500)
                                    </CFormFeedback>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol md={6}>
                                    <CFormLabel>Maximum Discount</CFormLabel>
                                    <CFormInput
                                        type="number"
                                        name="maxDiscount"
                                        value={formData.maxDiscount}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        placeholder="Enter maximum Discount Price"
                                    />
                                    <CFormFeedback invalid>
                                        Please provide a valid Maximum Discount 
                                    </CFormFeedback>
                                </CCol>
                            </CRow>
                            <CButton
                                color="primary"
                                type="submit"
                                className='mt-3'
                            >
                                {coupon ? 'Update Coupon' : 'Create Coupon'}
                            </CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CContainer>
        </>
    );
}

export default CouponForm