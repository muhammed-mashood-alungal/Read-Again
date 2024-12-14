import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { validateAddress } from '../../../validations/accountValidation'
import { toast } from 'react-toastify'
import { axiosUserInstance } from '../../../redux/Constants/axiosConstants';
import ConfirmationModal from '../../ConfirmationModal/ConfirmationModal';
import './MyAccount.css'
import { CCardBody, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHeaderCell, CTableRow } from '@coreui/react';
function Addresses({ userAddresses, userId }) {
  const [currentAction , setCurrentAction] = useState("view")
  const [city, setCity] = useState("")
  const [landmark, setLandmark] = useState("")
  const [district, setDistrict] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")
  const [phoneNumbers, setPhoneNumbers] = useState([])
  const [postalCode, setPostalCode] = useState("")
  const [addressId,setAddressId]=useState("")
  const [addresses,setAddresses ]= useState([])
  const [showModal , setShowModal]=useState(false)
  const [addressError, setAddressError]=useState({
    city:"",landmark:"",district:"",state:"",state:"",country:"",phoneNumbers:[],postalCode:""
  })

  useEffect(()=>{
    if(userAddresses?.length ){
      setAddresses(userAddresses)
    }
   
  },[userAddresses])

  const handleAddAddress = async (formData) => {
    try {
        const {data} = await axiosUserInstance.post(`/${userId}/address/add`, formData)
        toast.success("Address Saved", {
          autoClose: 1000
        })
        const newAddress = data.newAddress
        setAddresses(addresses =>{
          return [...addresses,newAddress]
        })
        setTimeout(() => {
          setCurrentAction("view")
          resetStates()
        }, 1000)
     
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.message)
    }

  }

  const handlePhone=(value,idx)=>{
    const tempArr = [...phoneNumbers]
    tempArr[idx]=value
    setPhoneNumbers(tempArr)
  }
 
  const resetStates=()=>{
    setCity("")
    setLandmark("")
    setCountry("")
    setState("")
    setDistrict("")
    setPostalCode("")
    setPhoneNumbers([])
    setAddressId("")
  }


  const handleSubmit=async(e)=>{
      e.preventDefault()
      setAddressError({})
      const formData = {
        city, phoneNumbers, country, landmark, state, postalCode, state, district
      }
      const result = validateAddress(formData)

      if (!result.hasError) {
        if(currentAction == 'creating'){
          handleAddAddress(formData)
        }else{
          handleEditAddres(formData)
        }
        
      
        setTimeout(() => {
          setCurrentAction("view")
          resetStates()
        }, 1000)
      } else {
        //toast.error(result.message)
        setAddressError(result.addressError)
        console.log(addressError)
      }
   

  }
  const handleEditAddres=async(formData)=>{
    try {
      await axiosUserInstance.put(`/address/${addressId}/edit`, formData)
      toast.success("Address Saved", {
        autoClose: 1000
      })
      setAddresses(addresses=>{
        return addresses.map((address)=>{
          return address._id == addressId ? {...formData} : address
        })
      })
      setTimeout(() => {
        setCurrentAction("view")
        resetStates()
      }, 1000)
   
  } catch (err) {
    toast.error(err?.response?.message)
  }
  }
  const setEditingMode =(address)=>{
    setCity(address.city)
    setCountry(address.country)
    setDistrict(address.district)
    setLandmark(address.landmark)
    setPhoneNumbers(address.phoneNumbers)
    setState(address.state)
    setPostalCode(address.postalCode)
    setAddressId(address._id)
    setCurrentAction("editing")
  } 

  const deleteAddress=async()=>{
    try{
      setShowModal(false)
      console.log(addressId)
       await axiosUserInstance.delete(`/address/${addressId}/delete`)
       toast.success("Address Deleted")
       setAddresses(addresses=>{
        return addresses.filter(address=>address._id != addressId)
       })
       
    }catch(err){
      console.log(err)
      toast.error(err?.response?.data?.message || "Internal Error!")
    }
  }

  const onCancel=()=>{
    setShowModal(false)
    setAddressId("")
  }

  const handleDefaultAddress=async(addressId,index)=>{
    try{
      await axiosUserInstance.put(`/${userId}/address/change-default`,{addressId})
      setAddresses(addresses=>{
        return  addresses.map((address)=>{
          return address._id == addressId ? {...address,isDefault:true} : {...address,isDefault:false}
        })
      })
    }catch(err){
      console.log(err)
    }
  }
  


  return (
    <>
      {
        currentAction === "view" &&(
          <div className='address-div'>
           {showModal && 
           <ConfirmationModal 
           title={`Are You Sure to delete this Address ?`}
           onConfirm={deleteAddress} 
           onCancel={onCancel}/>
           }
            <h3 className="tab__header">Shipping Address</h3>
            
            {
              
              addresses.map((address,index) => {
                return <div className="tab__body ">
                  <input
                type="radio"
                name="idDefault"
                id="idDefault"
                checked={address.isDefault}
                className="payment__input"
                onClick={(e)=>{handleDefaultAddress(address._id,index)}}
              /> &nbsp;
              <label htmlFor="idDefault" className="default_label">
                  Delivery Address
              </label>
             
                  <address className="address mt-3">
                     <CTable  hover responsive>
                      <CTableBody>
                                <CTableRow>
                                  <CTableHeaderCell>City</CTableHeaderCell>
                                  <CTableDataCell className="text-end">{address?.city}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                  <CTableHeaderCell> Land Mark</CTableHeaderCell>
                                  <CTableDataCell className="text-end">{address?.landmark} </CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                  <CTableHeaderCell>District</CTableHeaderCell>
                                  <CTableDataCell className="text-end">{address?.district}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                  <CTableHeaderCell>State</CTableHeaderCell>
                                  <CTableDataCell className="text-end">{address?.state}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                  <CTableHeaderCell>Country</CTableHeaderCell>
                                  <CTableDataCell className="text-end">{address?.country} </CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                  <CTableHeaderCell>Postal Code</CTableHeaderCell>
                                  <CTableDataCell className="text-end">{address?.postalCode}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                  <CTableHeaderCell>Phone</CTableHeaderCell>
                                  <CTableDataCell className="text-end"> {address?.phoneNumbers[0] } {`${address?.phoneNumbers[1] ? ", "+ address?.phoneNumbers[1] : ""}`}</CTableDataCell>
                                </CTableRow>
                                

                      </CTableBody>
                     </CTable>
                    
                  </address>
                 
                  <button className="link-button" onClick={()=>{setEditingMode(address)}}>Edit</button> 
                  <button className="delete-btn" onClick={()=>{
                    setAddressId(address._id)

                    console.log(address)
                    setShowModal(true)}}>Delete</button>
                <hr />
                </div>
              })
            }

            <button className="primary-btn" onClick={() => { setCurrentAction("creating") }}>Add Address</button>

          </div>
        ) 
      }
      {
        currentAction === "creating" &&  (
          <div className='p-3'>
            <h4>Add New Address</h4>
            <form className="form grid " >
              <input type="text" placeholder="Your City"
                className="form__input"
                value={city}
                onChange={(e) => { setCity(e.target.value) }}
              />
              <p className='err-msg'>{addressError.city}</p>
              <input type="text" placeholder="Land mark , eg:near Hypermarket..."
                className="form__input"
                value={landmark}
                onChange={(e) => { setLandmark(e.target.value) }}
              />
               <p className='err-msg'>{addressError.landmark}</p>
              <input type="text" placeholder="District"
                className="form__input"
                value={district}
                onChange={(e) => { setDistrict(e.target.value) }}
              />
               <p className='err-msg'>{addressError.district}</p>
              <input type="text" placeholder="State"
                className="form__input"
                value={state}
                onChange={(e) => { setState(e.target.value) }}
              />
               <p className='err-msg'>{addressError.state}</p>
              <input type="text" placeholder="Country"
                className="form__input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
               <p className='err-msg'>{addressError.country}</p>
              <input type="number" placeholder="Post Code"
                className="form__input"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
               <p className='err-msg'>{addressError.postalCode}</p>
              <input type="text" placeholder="Phone Number"
                className="form__input"
                value={phoneNumbers[0]}
                onChange={(e) => {handlePhone(e.target.value , 0)}}
              />
               <p className='err-msg'>{addressError?.phoneNumbers && addressError?.phoneNumbers[0]}</p>
              <input type="text" placeholder="Phone Number"
                className="form__input"
                value={phoneNumbers[1]}
                onChange={(e) => {handlePhone(e.target.value , 1)}}
              />
               <p className='err-msg'>{addressError?.phoneNumbers && addressError?.phoneNumbers[1]}</p>

            </form>
            <button className='primary-btn' role="submit" onClick={handleSubmit}>Save</button>
            <button className='secondary-btn' onClick={
              ()=>{
                setCurrentAction("view")
                resetStates()
              }
            }>Cancel</button>
          </div>
        )
      }
      {
        currentAction === "editing"  && (
          <div className='p-3'>
            <h4>Edit Address</h4>
            <form className="form grid " >
              <input type="text" placeholder="Your City"
                className="form__input"
                value={city}
                onChange={(e) => { setCity(e.target.value) }}
              />
              <p className='err-msg'>{addressError.city}</p>
              <input type="text" placeholder="Land mark , eg:near Hypermarket..."
                className="form__input"
                value={landmark}
                onChange={(e) => { setLandmark(e.target.value) }}
              />
                <p className='err-msg'>{addressError.landmark}</p>
              <input type="text" placeholder="District"
                className="form__input"
                value={district}
                onChange={(e) => { setDistrict(e.target.value) }}
              />
              <p className='err-msg'>{addressError.district}</p>
              <input type="text" placeholder="State"
                className="form__input"
                value={state}
                onChange={(e) => { setState(e.target.value) }}
              />
               <p className='err-msg'>{addressError.state}</p>
              <input type="text" placeholder="Country"
                className="form__input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
                <p className='err-msg'>{addressError.country}</p>
              <input type="number" placeholder="Post Code"
                className="form__input"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
              <p className='err-msg'>{addressError.postalCode}</p>
              <input type="text" placeholder="Phone Number"
                className="form__input"
                value={phoneNumbers[0]}
                onChange={(e) => {handlePhone(e.target.value , 0)}}
              />
               <p className='err-msg'>{addressError?.phoneNumbers && addressError?.phoneNumbers[0]}</p>
              <input type="text" placeholder="Phone Number"
                className="form__input"
                value={phoneNumbers[1]}
                onChange={(e) => {handlePhone(e.target.value , 1)}}
              />
               <p className='err-msg'>{addressError?.phoneNumbers && addressError?.phoneNumbers[1]}</p>
            </form>
            <button className='primary-btn' role="submit" onClick={handleSubmit}>Save</button>
            <button className='secondary-btn' onClick={
              ()=>{
                setCurrentAction("view")
                resetStates()
              }
            }>Cancel</button>
          </div>
        )
      }
    </>
  )
}

export default Addresses