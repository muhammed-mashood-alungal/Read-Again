import React, { useEffect, useState } from 'react';
import { 
  CCard, 
  CCardBody, 
  CCardHeader, 
  CTable, 
  CTableHead, 
  CTableRow, 
  CTableHeaderCell, 
  CTableBody, 
  CTableDataCell,
  CContainer,
  CRow,
  CCol,
  CBadge,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormInput,
  CFormLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilWallet, cilPlus, cilCreditCard } from '@coreui/icons';
import { axiosUserInstance } from '../../../redux/Constants/axiosConstants';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const WalletPage = ({}) => {
  const [isAddMoneyModal, setIsAddMoneyModal] = useState(false);
  const [isWithdrawModal, setIsWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState({})
  const {userId} = useSelector(state=>state.auth)

   useEffect(() => {
      const getUserWallet = async () => {
        try {
          const response = await axiosUserInstance.get(`/wallet/${userId}`);
          setWallet(response?.data?.wallet);
        } catch (err) {
          toast.error(err?.response?.data?.message);
        }
      }
      if(userId){
        getUserWallet();
      }
       
   
    }, [userId]);




  const getTransactionBadgeColor = (type) => {
    switch(type) {
      case 'credit': 
        return 'success';
      case 'debit': 
        return 'danger';
      default: 
        return 'secondary';
    }
  };

  return (
    <CContainer fluid className="p-3 my-account-container">
      <CRow>
        <CCol>
          <CCard className="shadow-sm">
            <CCardHeader className="bg-white d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <CIcon icon={cilWallet} className="me-2" size="xl"/>
                <h3 className="mb-0">My Wallet</h3>
              </div>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-4">
                <CCol>
                  <div className="bg-light p-3 rounded">
                    <h4 className="mb-2">Total Balance</h4>
                    <h2 className="text-primary">₹{wallet?.balance?.toFixed(2)}</h2>
                  </div>
                </CCol>
              </CRow>

              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Order ID</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {wallet?.transactions?.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="4" className="text-center text-muted">
                        No transactions found
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    wallet?.transactions?.map((transaction, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          
                          {new Date(transaction.date).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          
                            {transaction.associatedOrder._id}
                            </CTableDataCell>
                        <CTableDataCell>
                          <CBadge 
                            color={getTransactionBadgeColor(transaction.type)}
                          >
                            {transaction.type}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span 
                            className={
                              transaction.type === 'credit' 
                                ? 'text-success' 
                                : 'text-danger'
                            }
                          >
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                          </span>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
          </CContainer>
  );
};

export default WalletPage;