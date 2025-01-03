import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './BookDetails.css'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CCardTitle,
  CCardText,
  CCardImage,
  CBadge,
  CListGroup,
  CListGroupItem,
  CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilBook,
  cilCalendar,
  cilTag,
  cilBarcode,
  cilInfo,
  cilDollar,
  cilArrowThickFromRight
} from '@coreui/icons';
const BookDetails = ({ }) => {
  const location = useLocation()
  const book = location?.state?.book
  const navigate = useNavigate()
  return (
    <CContainer className='mt-5'>
      <CButton onClick={() => { navigate('/admin/books') }}>
        <CIcon icon={cilArrowThickFromRight} /> Go Back
      </CButton>
      <CRow>
        <CCol md={4}>
          <CCard className="mb-4">
            <CCardImage
              orientation="top"
              src={book?.images[0]?.secure_url}
              alt={book?.title || 'Book Cover'}
            />
            <CCardBody>
              <CCardTitle>{book?.title}</CCardTitle>
              <CCardText className="text-medium-emphasis">
                by {book?.author}
                <CBadge color="info" className="ms-2">
                  {book?.language}
                </CBadge>
              </CCardText>
            </CCardBody>
          </CCard>

          {/* Additional Images */}
          {book?.images && book.images.length > 1 && (
            <CCard className="mb-4">
              <CCardHeader>Additional Images</CCardHeader>
              <CCardBody className="d-flex gap-2">
                {book.images.slice(1).map((imageName, index) => (
                  <img
                    key={index}
                    src={book?.images[index + 1]?.secure_url}
                    alt={`Book Image ${index + 2}`}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover'
                    }}
                    className="img-thumbnail"
                  />
                ))}
              </CCardBody>
            </CCard>
          )}
        </CCol>

        <CCol md={8}>
          <CCard>
            <CCardHeader>
              <strong>Book Information</strong>
            </CCardHeader>
            <CListGroup flush>
              <CListGroupItem>
                <CIcon icon={cilBook} className="me-2" />
                <strong>Category:</strong> {book?.category?.name || 'Not Specified'}
              </CListGroupItem>
              <CListGroupItem>
                <CIcon icon={cilDollar} className="me-2" />
                <strong>Hardcover Price:</strong> {book?.formats?.physical?.price || 'Not Available'}
              </CListGroupItem>
              <CListGroupItem>
                <CIcon icon={cilTag} className="me-2" />
                <strong>Language:</strong> {book?.language || 'Not Specified'}
              </CListGroupItem>
              <CListGroupItem>
                <CIcon icon={cilBarcode} className="me-2" />
                <strong>ISBN:</strong> {book?.ISBN || 'Not Available'}
              </CListGroupItem>
              <CListGroupItem>
                <CIcon icon={cilCalendar} className="me-2" />
                <strong>Publication Date:</strong> {book?.publicationDate || 'Not Specified'}
              </CListGroupItem>
            </CListGroup>

            <CCardBody>
              <CCardHeader className="mb-3">
                <CIcon icon={cilInfo} className="me-2" />
                <strong>Description</strong>
              </CCardHeader>
              <CCardText>
                {book?.description || 'No description available.'}
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default BookDetails