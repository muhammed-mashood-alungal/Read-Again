import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react';
import { cilArrowThickFromRight } from '@coreui/icons';
import { Col, Container, Row } from 'reactstrap';
import { CButton, CTable } from '@coreui/react';
import { toast } from 'react-toastify';
import CouponDetails from '../../CouponManagement/CouponDetails';
import { axiosCouponInstance, axiosOfferInstance } from '../../../../redux/Constants/axiosConstants';
import ConfirmationModal from '../../../ConfirmationModal/ConfirmationModal';
import OfferForm from '../OfferForm/OfferForm';
import ViewOffer from '../ViewOffer/ViewOffer';


function ListOffers() {
    const [currentAction , setCurrrentAction ]=useState("list-offers")
    const [selectedOfferId,setSelectedOfferId]=useState(null)
    const [offers ,setOffers]=useState([])
    const [offerData,setOfferData]=useState({})

    useEffect(()=>{
       async function fetchOffers(){
         try{
            const {data} = await axiosOfferInstance.get('/')
            setOffers(data.offers)
         }catch(err){
           toast.error(err?.response?.data?.message)
         }
       }
       fetchOffers()
    },[])

    const handleOfferActivation=async()=>{
         try {
           setSelectedOfferId(null)
            await axiosOfferInstance.patch(`/${selectedOfferId}/handle-activation`)
            setOffers((offers)=>{
                return offers.map((offer)=>{
                    return offer._id == selectedOfferId ? {...offer,isActive:!offer.isActive} : offer
                })
            })
            
        } catch (error) {
             toast.error(error?.response?.data?.message)
        }
    }

    const onCancel=()=>{
        setSelectedOfferId(null)
    }
    const handleSearch=()=>{
        ///search 
    }
    const handleCoupenAdd=()=>{
      ///adddd...
    }
   
    const confirmAction=(offerId)=>{
        setSelectedOfferId(offerId)
    }
    const showUpdateForm=(offerData)=>{
        setOfferData(offerData)
        setCurrrentAction("update-offer")
    }
    const viewOfferData=(couponData)=>{
         setOfferData(couponData)
         setCurrrentAction("view-offer")
    }


    return (
        <Container className='content'>
          <Row className="category-management">
            {
              currentAction == "list-offers" ? <Col >
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
                          <CButton onClick={() => { setCurrrentAction("create-offer") }}
                            color="success"
                            variant="outline">
                            Add Offer
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
                                  <td>{offer.isActive ? "Active" :"Expired"}</td>
                                  <td>
                                  <CButton color="info" variant="outline"
                                      onClick={() => viewOfferData(offer)}
                                    >
                                      View
                                    </CButton>
                                  </td>
                                  <td>
                                    <CButton color="success" variant="outline"
                                      onClick={() => showUpdateForm(offer)}
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
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
                : <Col >
                  <div>
    
    
                    {currentAction == "view-offer" && <>
                        <CButton onClick={() => { setCurrrentAction("list-offers") }}>
                          <CIcon icon={cilArrowThickFromRight} /> Go Back
                        </CButton>
                        <ViewOffer offer={offerData} onChildUpdate={handleCoupenAdd} />
                      </>
                     }
                     {
                        currentAction == 'update-offer' && <>
                        <CButton onClick={() => { setCurrrentAction("list-offers") }}>
                          <CIcon icon={cilArrowThickFromRight} /> Go Back
                        </CButton>
                        <OfferForm onChildUpdate={handleCoupenAdd} offer={offerData} />
                      </>
                    }
                    {
                        currentAction == 'create-offer' && <>
                        <CButton onClick={() => { setCurrrentAction("list-offers") }}>
                          <CIcon icon={cilArrowThickFromRight} /> Go Back
                        </CButton>
                        <OfferForm onChildUpdate={handleCoupenAdd} />
                      </>
                    }
                  </div>
                </Col>
            }
          </Row>
        </Container>
      )
}

export default ListOffers