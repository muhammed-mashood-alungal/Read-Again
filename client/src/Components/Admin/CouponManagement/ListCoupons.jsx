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
import { useNavigate } from 'react-router-dom';

function ListCoupons() {
  const [currentAction, setCurrrentAction] = useState("list-coupons")
  const [selectedCoupenId, setSelectedCouponId] = useState(null)
  const [coupons, setCoupens] = useState([])
  const [currentPage,setCurrentPage] = useState(1)
  const [couponData, setCouponData] = useState({})
  const [totalPages,setTotalPages]=useState(1)
  const limit = 10
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchCoupens() {
      try {
        const response = await axiosCouponInstance.get(`/?page=${currentPage}&limit=${limit}}`)
      let pages = Math.ceil(response?.data?.totalCoupons / limit)
      setTotalPages(pages)
      setCoupens(response?.data?.coupons)
      } catch (err) {
        toast.error(err?.response?.data?.message)
      }
    }
    fetchCoupens()
  }, [])

  const handleCouponListing = async () => {
    try {
      setSelectedCouponId(null)
      console.log(selectedCoupenId)
      await axiosCouponInstance.put(`/handle-activation/${selectedCoupenId}`)
      console.log(selectedCoupenId)
      setCoupens((coupons) => {
        return coupons.map((coupon) => {
          return coupon._id == selectedCoupenId ? { ...coupon, isActive: !coupon.isActive } : coupon
        })
      })

    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const onCancel = () => {
    setSelectedCouponId(null)
  }
  const handleSearch = async (e) => {
    try {
      const name = e.target.value
      const response = await axiosCouponInstance.get(`/?page=${currentPage}&limit=${limit}&name=${name}`)
      let pages = Math.ceil(response?.data?.totalCoupons / limit)
      setTotalPages(pages)
      setCoupens(response?.data?.coupons)
    } catch (err) {
      console.log(err)
    }
  }
  const handleCoupenAdd = () => {
    //
  }
  const confirmAction = (coupondId) => {
    setSelectedCouponId(coupondId)
  }
  const showUpdateForm = (couponData) => {
    setCouponData(couponData)
    setCurrrentAction("update-coupon")
  }
  const viewCouponData = (couponData) => {
    setCouponData(couponData)
    setCurrrentAction("view-coupon")
  }

  return (
    <Container className='content'>
      <Row className="category-management">
  <Col >
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
                      <CButton onClick={() => { navigate('/admin/coupons/form')}}
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
                            <th>Current Usage</th>
                            <th>Max Usage</th>
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
                              <td>{coupon.discountValue}%</td>
                              <td>{coupon.currentUsage}</td>
                              <td>{coupon.maxUsage}</td>
                              <td>{coupon.isActive ? "Active" : "Expired"}</td>
                              <td>
                                <CButton color="info" variant="outline"
                                  onClick={() =>  navigate('/admin/coupons/view',{state:{coupon:coupon}})}
                                >
                                  View
                                </CButton>
                              </td>
                              <td>
                                <CButton color="success" variant="outline"
                                  onClick={() => navigate('/admin/coupons/form',{state:{coupon:coupon}})}
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
                    <div className="pagination">
               <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                 Previous
               </button>
               <span> Page {currentPage} of {totalPages} </span>
               <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                 Next
               </button>
             </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
      </Row>
    </Container>
  )
}

export default ListCoupons