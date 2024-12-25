import React from 'react';
import { CRow, CCol, CCard, CCardBody, CPlaceholder } from '@coreui/react';
import { Container } from 'reactstrap';

const ProductLoading = () => {
  return (
    <Container>
    <CRow xs={{ cols: 1 }} md={{ cols: 2 }} xl={{ cols: 4 }} className="g-4">
      {[...Array(8)].map((_, index) => (
        <CCol key={index}>
          <CCard>
            <CPlaceholder 
            
              component="img"
              animation="glow"
              xs={12}
              className="card-img-top"
              style={{ height: '260px' }}
            />
            <CCardBody>
              <CPlaceholder animation="glow">
                <CPlaceholder xs={8} size="lg" className="mb-3" />
                <CPlaceholder xs={12} size="sm" className="mb-3" />
                <div className="d-flex justify-content-between align-items-center">
                  <CPlaceholder xs={4} />
                  <CPlaceholder xs={2} className="rounded-circle" style={{ height: '32px' }} />
                </div>
              </CPlaceholder>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
    </Container>
  );
};

export default ProductLoading;