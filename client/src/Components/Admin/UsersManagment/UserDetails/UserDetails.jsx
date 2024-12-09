import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './UserDetails.css'
import { CCard, CCardBody } from '@coreui/react'
import { cilArrowThickFromRight } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
function UserDetails({user}) {
    
  return (
    <CCard>
       <CCardBody>
      
       <div>
    <h1 className="card-title">User Details</h1>
    <br />
   <div>
    <div>
    <h4>{user.username}</h4>
    <h5>{user.email}</h5>
    </div>
    
    <hr />
    <table>
      <tr>
        <th>Phone </th>
        <th className='user-data-text'>{user.phone ? user.phone : "Not Added"}</th>
      </tr>
      <tr>
        <th>Address </th>
        <th className='user-data-text'>{user.address ? user.address : "Not Added"}</th>
      </tr>
      <tr>
        <th>Membership </th>
        <th className='user-data-text'>{user.memberShipType}</th>
      </tr>
      <tr>
        <th>Is Blocked </th>
        <th className='user-data-text'>{user.isBlocked ?  "YES": "NO"}</th>
      </tr>
      <tr>
        <th>Joined Data </th>
        <th className='user-data-text'> {user.createdAt}</th>
      </tr>
    </table>
   </div>
   </div>
   </CCardBody>
  </CCard>
  )
}

export default UserDetails