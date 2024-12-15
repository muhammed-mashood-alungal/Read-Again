import React, { useEffect } from 'react'
import { dotPulse } from 'ldrs'

import { InfinitySpin } from 'react-loader-spinner';



function LoadingComponent() {
    return (
        <div
            className="vh-100 w-100 d-flex justify-content-center align-items-center z-1000 position-fixed"
            style={{
                top: 0,
                left: 0,
                backgroundColor: "rgba(0, 0, 0, 0.13)",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
            }}
        >
            <div className='d-flex flex-column align-items-center' >
                <InfinitySpin
                    visible={true}
                    width="200"
                    color="#4fa94d"
                    ariaLabel="infinity-spin-loading"
                /> 
                  <p>Loading...</p>
            </div>
          
        </div>
    )
}

export default LoadingComponent