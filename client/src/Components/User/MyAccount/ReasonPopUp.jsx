import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ReasonPopUp = ({ type , isOpen, onClose, onConfirm }) => {
  const [otherReason, setOtherReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const cancellationReasons = [
    'Changed my mind',
    'Found a better price',
    'Delivery too slow',
    'Product no longer needed',
    'Other'
  ]
  const returnReasons = [
    'Received a damaged or defective book',
    'Wrong book delivered',
    'Product description does not match',
    'Book arrived too late',
    'Changed my mind',
    'Other'
  ]

  const handleSubmit = () => {
    const finalReason = selectedReason === 'Other' 
      ? otherReason 
      : selectedReason;

    if (finalReason.trim()) {
      onConfirm(finalReason);
      onClose();
      setOtherReason('');
      setSelectedReason('');
    } else {
      toast.error('Please provide a reason');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
        maxWidth: '90%',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          marginTop: 0,
          marginBottom: '20px',
          textAlign: 'center',
          color: '#333'
        }}>
          Cancel Order
        </h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}>
            Reason for {type}
          </label>
          <select 
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            
            {
              type == "Cancel" ? 
              <>
              <option value="">Select a reason</option>
              {cancellationReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))} 
              </>:
              <>
              <option value="">Select a reason</option>
              {returnReasons.map((reason) => (
                <option key={reason} value={reason}>
                {reason}
                </option>
              ))}
            </>
            }
            
          </select>

          {selectedReason === 'Other' && (
            <textarea
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Please provide more details"
              style={{
                width: '100%',
                padding: '10px',
                minHeight: '100px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                resize: 'vertical'
              }}
            />
          )}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <button 
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px',
              marginRight: '10px',
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
          <button 
            onClick={handleSubmit}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Confirm {type}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReasonPopUp;