import React, { useState } from 'react';
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

const WalletPage = ({userWallet}) => {
  const [isAddMoneyModal, setIsAddMoneyModal] = useState(false);
  const [isWithdrawModal, setIsWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState(userWallet)
  const handleAddMoney = () => {
   ///
  };

  const handleWithdraw = () => {
   ///
  };

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
    <CContainer fluid className="p-3">
      <CRow>
        <CCol>
          <CCard className="shadow-sm">
            <CCardHeader className="bg-white d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <CIcon icon={cilWallet} className="me-2" size="xl"/>
                <h3 className="mb-0">My Wallet</h3>
              </div>
              <div>
                <CButton 
                  color="primary" 
                  className="me-2"
                  onClick={() => setIsAddMoneyModal(true)}
                >
                  <CIcon icon={cilPlus} className="me-1"/> Add Money
                </CButton>
                <CButton 
                  color="danger" 
                  variant="outline"
                  onClick={() => setIsWithdrawModal(true)}
                >
                  <CIcon icon={cilCreditCard} className="me-1"/> Withdraw
                </CButton>
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

      {/* Add Money Modal */}
      <CModal 
        visible={isAddMoneyModal} 
        onClose={() => setIsAddMoneyModal(false)}
      >
        <CModalHeader>
          <CModalTitle>Add Money to Wallet</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>Enter Amount</CFormLabel>
          <CFormInput 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to add"
          />
          <div className="mt-3 d-grid">
            <CButton color="primary" onClick={handleAddMoney}>
              Add Money
            </CButton>
          </div>
        </CModalBody>
      </CModal>

      {/* Withdraw Modal */}
      <CModal 
        visible={isWithdrawModal} 
        onClose={() => setIsWithdrawModal(false)}
      >
        <CModalHeader>
          <CModalTitle>Withdraw from Wallet</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>Enter Amount</CFormLabel>
          <CFormInput 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to withdraw"
          />
          <div className="mt-3 d-grid">
            <CButton color="danger" onClick={handleWithdraw}>
              Withdraw
            </CButton>
          </div>
        </CModalBody>
      </CModal>
    </CContainer>
  );
};

export default WalletPage;