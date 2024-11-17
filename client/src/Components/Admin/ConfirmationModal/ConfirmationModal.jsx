import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './ConfirmationModal.css'
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
        <DialogTitle id="alert-dialog-title">
        {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button onClick={onCancel}>Cancel</button>
          <button className='primary-btn' onClick={onConfirm} autoFocus>
            Proceed
          </button>
        </DialogActions>
      </Dialog>
   </>
  )
}

export default ConfirmationModal