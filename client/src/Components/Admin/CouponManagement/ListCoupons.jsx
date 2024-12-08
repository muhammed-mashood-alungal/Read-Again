import React, { useEffect, useState } from 'react'
import CouponForm from './CouponForm'
import ConfirmationModal from '../../ConfirmationModal/ConfirmationModal'
import CIcon from '@coreui/icons-react';
import { cilArrowThickFromRight } from '@coreui/icons';
import { Col, Container, Row } from 'reactstrap';
import { CButton, CTable } from '@coreui/react';
import { axiosCouponInstance } from '../../../redux/Constants/axiosConstants';
import { toast } from 'react-toastify';
import CouponDetails from './CouponDetails';

function ListCoupons() {
    const [currentAction , setCurrrentAction ]=useState("list-coupons")
    const [selectedCoupenId,setSelectedCouponId]=useState(null)
    const [coupons ,setCoupens]=useState([])
    const [couponData,setCouponData]=useState({})

    useEffect(()=>{
       async function fetchCoupens(){
         try{
            const {data} = await axiosCouponInstance.get('/')
            setCoupens(data.coupons)
         }catch(err){
           toast.error(err?.response?.data?.message)
         }
       }
       fetchCoupens()
    },[])

    const handleCouponListing=async()=>{
         try {
            setSelectedCouponId(null)
            console.log(selectedCoupenId)
            await axiosCouponInstance.put(`/handle-activation/${selectedCoupenId}`)
            console.log(selectedCoupenId)
            setCoupens((coupons)=>{
                return coupons.map((coupon)=>{
                    return coupon._id == selectedCoupenId ? {...coupon,isActive:!coupon.isActive} : coupon
                })
            })
            
        } catch (error) {
             toast.error(error?.response?.data?.message)
        }
    }

    const onCancel=()=>{
        setSelectedCouponId(null)
    }
    const handleSearch=()=>{
        ///search 
    }
    const handleCoupenAdd=()=>{
        //
    }
    const confirmAction=(coupondId)=>{
        setSelectedCouponId(coupondId)
    }
    const showUpdateForm=(couponData)=>{
        setCouponData(couponData)
        setCurrrentAction("update-coupon")
    }
    const viewCouponData=(couponData)=>{
         setCouponData(couponData)
         setCurrrentAction("view-coupon")
    }

  return (
    <Container className='content'>
      <Row className="category-management">
        {
          currentAction == "list-coupons" ? <Col >
            {selectedCoupenId &&
              <ConfirmationModal
                title={`Are You Sure to Proceed ?`}
                onConfirm={handleCouponListing}
                onCancel={onCancel} />
            }
            <div className="row p-3">
              <div className="col-12 grid-margin">
                <div className="card category-table">
                  <div className="card-body">
                    <div className='d-flex  justify-content-between'>
                      <h4 className="table-title">All Coupons</h4>
                      <CButton onClick={() => { setCurrrentAction("create-coupon") }}
                        color="success"
                        variant="outline">
                        Add Coupon
                      </CButton>
                    </div>
                    <form className="nav-link mt-2 mt-md-0 d-lg-flex search">
                      <input
                        type="text"
                        className="form-control mt-1"
                        placeholder="Search Coupons"
                        onChange={handleSearch}
                      />
                    </form>
                    <br />
                    <div className="table-responsive">

                    <CTable striped> 
                        <thead>
                          <tr>
                            <th>Coupon Code</th>
                            <th>Discount Value</th>
                            <th>Limit</th>
                            <th>Status</th>
                            <th>View</th>
                            <th>Update</th>
                            <th>Listing</th>
                          </tr>
                        </thead>
                        <tbody>
                          {coupons.map(coupon => (
                            <tr key={coupon._id}>
                            
                              <td>{coupon.code}</td>
                              <td>{coupon.discountValue}</td>
                              <td>{coupon.limit}</td>
                              <td>{coupon.isActive ? "Active" :"Expired"}</td>
                              <td>
                              <CButton color="info" variant="outline"
                                  onClick={() => viewCouponData(coupon)}
                                >
                                  View
                                </CButton>
                              </td>
                              <td>
                                <CButton color="success" variant="outline"
                                  onClick={() => showUpdateForm(coupon)}
                                >
                                  Update
                                </CButton>
                              </td>
                              <td>
                               <CButton color="danger" variant="outline"
                                  onClick={() => confirmAction(coupon._id)}
                                >
                                  {coupon.isActive ? "Deactivate" : "Activate"}
                                </CButton>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </CTable>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
            : <Col >
              <div>


                {currentAction == "view-coupon" && <>
                    <CButton onClick={() => { setCurrrentAction("list-coupons") }}>
                      <CIcon icon={cilArrowThickFromRight} /> Go Back
                    </CButton>
                    <CouponDetails coupon={couponData} onChildUpdate={handleCoupenAdd} />
                  </>
                 }
                 {
                    currentAction == 'update-coupon' && <>
                    <CButton onClick={() => { setCurrrentAction("list-coupons") }}>
                      <CIcon icon={cilArrowThickFromRight} /> Go Back
                    </CButton>
                    <CouponForm onChildUpdate={handleCoupenAdd} coupon={couponData} />
                  </>
                }
                {
                    currentAction == 'create-coupon' && <>
                    <CButton onClick={() => { setCurrrentAction("list-coupons") }}>
                      <CIcon icon={cilArrowThickFromRight} /> Go Back
                    </CButton>
                    <CouponForm onChildUpdate={handleCoupenAdd} />
                  </>
                }
              </div>
            </Col>
        }


      </Row>
    </Container>
  )
}

export default ListCoupons