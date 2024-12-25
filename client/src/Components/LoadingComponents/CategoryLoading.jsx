import React from 'react'
import { CRow, CCol, CCard, CCardBody, CPlaceholder } from '@coreui/react';
function CategoryLoading() {
    return (
        <CRow xs={{ cols: 2 }} md={{ cols: 4 }} xl={{ cols: 6 }} className="g-4">
          {[...Array(6)].map((_, index) => (
            <CCol key={index}>
              <CCard>
                <CPlaceholder 
                  component="img"
                  animation="glow"
                  xs={12}
                  className="card-img-top"
                  style={{ height: '160px' }}
                />
                <CCardBody>
                  <CPlaceholder animation="glow">
                    <CPlaceholder xs={8} className="mb-2" />
                    <CPlaceholder xs={12} size="sm" />
                  </CPlaceholder>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      );
}

export default CategoryLoading