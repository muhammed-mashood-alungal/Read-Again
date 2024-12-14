import React, { useState, useEffect } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CBadge,
    CButton,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CContainer
} from '@coreui/react';
import { format } from 'date-fns';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosOfferInstance } from '../../../../redux/Constants/axiosConstants';
import { cilArrowThickFromRight } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

function ViewOffer({}) {
    const location = useLocation()
    const offer = location?.state?.offer
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    // useEffect(() => {
    //     fetchOfferDetails();
    // }, [id]);

    // const fetchOfferDetails = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await axiosOfferInstance.get(`/${id}`);
    //         setOffer(response.data.offer);
    //         setLoading(false);
    //     } catch (err) {
    //         toast.error(err.response?.data?.message || 'Failed to fetch offer details');
    //         setLoading(false);
    //         navigate('/admin/offers');
    //     }
    // };

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // if (!offer) {
    //     return <div>No offer found</div>;
    // }

    return (
        <CContainer className='mt-5'>
            <CButton onClick={()=>{navigate('/admin/offers')}}>
                   <CIcon icon={cilArrowThickFromRight} /> Go Back
         </CButton>
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <h4>Offer Details</h4>
                        <CButton 
                            color="primary" 
                            onClick={() => navigate(`/admin/offers/edit/${id}`)}
                        >
                            Edit Offer
                        </CButton>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="mb-3">
                            <CCol md={6}>
                                <strong>Name:</strong> {offer.name}
                            </CCol>
                            <CCol md={6}>
                                <strong>Discount Value:</strong> {offer.discountValue}%
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <strong>Applicable To:</strong> {offer.applicableTo}
                            </CCol>
                            <CCol md={6}>
                                <strong>Status:</strong>{' '}
                                <CBadge color={offer.isActive ? 'success' : 'danger'}>
                                    {offer.isActive ? 'Active' : 'Inactive'}
                                </CBadge>
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <strong>Start Date:</strong>{' '}
                                {format(new Date(offer.startDate), 'dd MMM yyyy')}
                            </CCol>
                            <CCol md={6}>
                                <strong>Expiration Date:</strong>{' '}
                                {format(new Date(offer.expirationDate), 'dd MMM yyyy')}
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol md={6}>
                                <strong>Max Usage:</strong> {offer.maxUsage}
                            </CCol>
                            <CCol md={6}>
                                <strong>Current Usage:</strong> {offer.currentUsage || 0}
                            </CCol>
                        </CRow>

                        {offer.applicableTo === 'PRODUCT' && offer.applicableProducts && (
                            <CRow className="mb-3">
                                <CCol xs={12}>
                                    <h5>Applicable Products</h5>
                                    <CTable striped hover>
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell>Title</CTableHeaderCell>
                                                <CTableHeaderCell>Author</CTableHeaderCell>
                                                <CTableHeaderCell>Original Price</CTableHeaderCell>
                                                <CTableHeaderCell>Offer Price</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {offer.applicableProducts.map((product) => (
                                                <CTableRow key={product._id}>
                                                    <CTableDataCell>{product.title}</CTableDataCell>
                                                    <CTableDataCell>{product.author}</CTableDataCell>
                                                    <CTableDataCell>{product?.formats?.physical?.price}</CTableDataCell>
                                                    <CTableDataCell>{product?.formats?.physical?.price - ((offer.discountValue/100)*product?.formats?.physical?.price)}</CTableDataCell>
                                                </CTableRow>
                                            ))}
                                        </CTableBody>
                                    </CTable>
                                </CCol>
                            </CRow>
                        )}

                        {offer.applicableTo === 'CATEGORY' && offer.applicableCategories && (
                            <CRow className="mb-3">
                                <CCol xs={12}>
                                    <h5>Applicable Categories</h5>
                                    <CTable striped hover>
                                        <CTableHead>
                                            <CTableRow>
                                                <CTableHeaderCell>Category Name</CTableHeaderCell>
                                                <CTableHeaderCell>Description</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {offer.applicableCategories.map((category) => (
                                                <CTableRow key={category._id}>
                                                    <CTableDataCell>{category.name}</CTableDataCell>
                                                    <CTableDataCell>{category.listed ? "Listed" : "Unlisted"}</CTableDataCell>
                                                </CTableRow>
                                            ))}
                                        </CTableBody>
                                    </CTable>
                                </CCol>
                            </CRow>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
        </CContainer>
    );
}

export default ViewOffer;