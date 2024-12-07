import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './ConfirmationModal.css'
import { CButton } from '@coreui/react';
function ConfirmationModal({title,message,onConfirm ,onCancel}) {
  return (
   <>
   

  
    <Dialog
        open={true}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        class="confirmation-modal"
      >
        <div className='bg-dark text-white'>
        <DialogTitle id="alert-dialog-title">
        {title}
        </DialogTitle>
        <DialogContent >
          <DialogContentText id="alert-dialog-description" className='text-white'>
           {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <CButton color="secondary" onClick={onCancel}>Cancel</CButton>
          <CButton color="primary" onClick={onConfirm} autoFocus>
            Proceed
          </CButton>
        </DialogActions>
        </div>
      </Dialog>
     
   </>
  )
}

export default ConfirmationModal
