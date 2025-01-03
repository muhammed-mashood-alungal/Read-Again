import React from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CContainer,
  CButton
} from '@coreui/react';
import { format } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';
import { cilArrowThickFromRight } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const CouponDetails = ({ }) => {
  const location = useLocation()
  const coupon = location.state.coupon
  const navigate = useNavigate()


  return (
    <CContainer className='mt-5' >
      <CButton onClick={() => { navigate('/admin/coupons') }}>
        <CIcon icon={cilArrowThickFromRight} /> Go Back
      </CButton>

      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="m-0">Coupon Details</h5>
          {
            coupon.isActive ?
              <CBadge color="success">Active</CBadge>
              :
              <CBadge color="danger">Expired</CBadge>
          }
        </CCardHeader>
        <CCardBody>
          <CTable striped hover responsive>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell>Coupon Code</CTableHeaderCell>
                <CTableDataCell className="text-end">{coupon.code}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Discount Value</CTableHeaderCell>
                <CTableDataCell className="text-end">
                  {coupon.discountValue}%
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Usage Limit</CTableHeaderCell>
                <CTableDataCell className="text-end">
                  {coupon.maxUsage}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Minimum Purchase</CTableHeaderCell>
                <CTableDataCell className="text-end">
                  {coupon.minimumPrice}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Maximum Discount</CTableHeaderCell>
                <CTableDataCell className="text-end">
                  {coupon.maxDiscount}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Expiration Date</CTableHeaderCell>
                <CTableDataCell className="text-end">
                  {format(new Date(coupon.expirationDate), 'PPP')}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Created At</CTableHeaderCell>
                <CTableDataCell className="text-end">
                  {format(new Date(coupon.createdAt), 'PPP')}
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>Applicable To</CTableHeaderCell>
                <CTableDataCell className="text-end">
                  {coupon.applicableTo?.length > 0
                    ? coupon.applicableTo?.join(', ')
                    : 'All Products'}
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default CouponDetails;