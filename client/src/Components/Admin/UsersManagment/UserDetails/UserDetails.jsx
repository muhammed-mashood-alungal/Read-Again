import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import './UserDetails.css'
import { CButton, CCard, CCardBody, CContainer, CTable, CTableBody, CTableDataCell, CTableHeaderCell, CTableRow } from '@coreui/react'
import { cilArrowThickFromRight } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
function UserDetails({}) {
    const location = useLocation()
    const navigate = useNavigate()
    const user = location?.state?.user
    if(!user){
      navigate('/admin/users')
    }
  return (
    <CContainer className='mt-5'>
       <CButton onClick={()=>{navigate('/admin/users')}}>
                    <CIcon icon={cilArrowThickFromRight} /> Go Back
       </CButton>
    <CCard>
       <CCardBody>
       <div>
    <h3 className="card-title">User Details</h3>
    <br />
   <div>
    <CTable striped hover responsive>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>Username</CTableHeaderCell>
                  <CTableDataCell className="text-end">{user.username}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableDataCell className="text-end">
                    {user.email}%
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Member Ship</CTableHeaderCell>
                  <CTableDataCell className="text-end">
                    {user.memberShipType}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>is Blocked</CTableHeaderCell>
                  <CTableDataCell className="text-end">
                    {user.isBlocked ? "True" : "False"}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Joined Data</CTableHeaderCell>
                  <CTableDataCell className="text-end">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
   </div>
   </div>
   </CCardBody>
  </CCard>
  </CContainer>
  )
}

export default UserDetails