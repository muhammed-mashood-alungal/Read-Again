import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'reactstrap';
import { CButton, CTable } from '@coreui/react';
import { toast } from 'react-toastify';
import { axiosOfferInstance } from '../../../../redux/Constants/axiosConstants';
import ConfirmationModal from '../../../CommonComponents/ConfirmationModal/ConfirmationModal';
import { useNavigate } from 'react-router-dom';


function ListOffers() {
  const [selectedOfferId, setSelectedOfferId] = useState(null)
  const [offers, setOffers] = useState([])
  const [offerData, setOfferData] = useState({})
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  useEffect(() => {
    async function fetchOffers() {
      try {
        const { data } = await axiosOfferInstance.get(`/?page=${currentPage}&limit=${limit}`)
        setOffers(data.offers)
        let pages = Math.ceil(data?.totalOffers / limit)
        setTotalPages(pages)
      } catch (err) {
        toast.error(err?.response?.data?.message)
      }
    }
    fetchOffers()
  }, [currentPage])

  const handleSearch = async (e) => {
    try {
      const name = e.target.value
      const response = await axiosOfferInstance.get(`/?page=${currentPage}&limit=${limit}&name=${name}`)
      let pages = Math.ceil(response?.data?.totalOffers / limit)
      setTotalPages(pages)
      setOffers(response?.data?.offers)
    } catch (err) {
      console.log(err)
    }
  }

  const handleOfferActivation = async () => {
    try {
      setSelectedOfferId(null)
      await axiosOfferInstance.patch(`/${selectedOfferId}/handle-activation`)
      setOffers((offers) => {
        return offers.map((offer) => {
          return offer._id == selectedOfferId ? { ...offer, isActive: !offer.isActive } : offer
        })
      })

    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const onCancel = () => {
    setSelectedOfferId(null)
  }

  const confirmAction = (offerId) => {
    setSelectedOfferId(offerId)
  }

  return (
    <Container className='content'>
      <Row className="category-management">
        <Col >
          {selectedOfferId &&
            <ConfirmationModal
              title={`Are You Sure to Proceed ?`}
              onConfirm={handleOfferActivation}
              onCancel={onCancel} />
          }
          <div className="row p-3">
            <div className="col-12 grid-margin">
              <div className="card category-table">
                <div className="card-body">
                  <div className='d-flex  justify-content-between'>
                    <h4 className="table-title">All Offers</h4>
                    <CButton onClick={() => { navigate('/admin/offers/form') }}
                      color="success"
                      variant="outline">
                      Add Offer
                    </CButton>
                  </div>
                  <form className="nav-link mt-2 mt-md-0 d-lg-flex search">
                    <input
                      type="text"
                      className="form-control mt-1"
                      placeholder="Search Offer"
                      onChange={handleSearch}
                    />
                  </form>
                  <br />
                  <div className="table-responsive">

                    <CTable striped>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Discount</th>
                          <th>Applicable To</th>
                          <th>Status</th>
                          <th>View</th>
                          <th>Update</th>
                          <th>Listing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {offers.map(offer => (
                          <tr key={offer._id}>

                            <td>{offer.name}</td>
                            <td>{offer.discountValue}%</td>
                            <td>{offer.applicableTo}</td>
                            <td>{offer.isActive ? "Active" : "Expired"}</td>
                            <td>
                              <CButton color="info" variant="outline"
                                onClick={() => {
                                  navigate('/admin/offers/view', { state: { offer: offer } })
                                }}
                              >
                                View
                              </CButton>
                            </td>
                            <td>
                              <CButton color="success" variant="outline"
                                onClick={() => {
                                  navigate('/admin/offers/form', { state: { offer: offer } })
                                }}
                              >
                                Update
                              </CButton>
                            </td>
                            <td>
                              <CButton color="danger" variant="outline"
                                onClick={() => confirmAction(offer._id)}
                              >
                                {offer.isActive ? "Deactivate" : "Activate"}
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

export default ListOffers