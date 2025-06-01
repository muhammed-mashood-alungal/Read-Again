import React, { useEffect, useState } from "react";
import { CCard, CCardBody, CRow, CCol, CContainer } from "@coreui/react";
import CircularProgress from "../CircularProgress/CircularProgress";
import { motion, useMotionValue } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrderInvoicePDF from "../OrderInvoicePDF/OrderInvoicePDF";
import { toast } from "react-toastify";
import { axiosOrderInstance } from "../../../redux/Constants/axiosConstants";
import { Button } from "reactstrap";

const OrderSuccess = ({}) => {
  const location = useLocation();
  const orderId = location?.state?.orderId;
  const [orderData, setOrderData] = useState({});
  const navigate = useNavigate();
  let progress = useMotionValue(90);
  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const { data } = await axiosOrderInstance.get(`/${orderId}/order-data`);
        setOrderData(data.orderData);
      } catch (err) {
        toast.error(err?.response?.data?.message);
      }
    }
    fetchOrderDetails();
  }, [orderId]);

  return (
    <CContainer className="d-flex justify-content-center">
      <CCard className="text-center  w-75 m-5">
        <div className="d-flex justify-content-center align-items-center mt-3">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: 100 }}
            style={{ x: progress }}
            transition={{ duration: 1 }}
          />
          <CircularProgress progress={progress} />
        </div>
        <CCardBody>
          <h4 className="mb-4">Order Placed Successfully!</h4>
          <CContainer>
            <CRow className="mb-3 bg-light p-3 rounded">
              <CCol xs={12} className="text-left text-muted">
                Order ID:
              </CCol>
              <CCol xs={12} className="text-right font-weight-bold">
                {orderData.orderId ? orderData.orderId : orderData._id}
              </CCol>
            </CRow>

            <CRow className="mb-4 bg-light p-3 rounded">
              <CCol xs={12} className="text-left text-muted">
                Payment Status:
              </CCol>
              <CCol xs={12} className="text-right">
                <span
                  className={`font-weight-bold ${
                    orderData?.paymentStatus === "Successful"
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {orderData?.paymentStatus}
                </span>
              </CCol>
            </CRow>
            <div>
              <PDFDownloadLink
                className="mt-2"
                document={<OrderInvoicePDF orderData={orderData} />}
                fileName={`order-invoice-${
                  new Date().toISOString().split("T")[0]
                }.pdf`}
              >
                {({ blob, url, loading, error }) => (
                  <button
                    style={{
                      backgroundColor: loading ? "#cccccc" : "#4CAF50",
                      color: "white",
                      padding: "11px 19px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: loading ? "not-allowed" : "pointer",
                      margin:'1px'
                    }}
                    disabled={loading}
                  >
                    {loading ? "Generating PDF..." : "Download Invoice"}
                  </button>
                )}
              </PDFDownloadLink>
              <button
                style={{
                  backgroundColor:"#088179",
                  color: "white",
                  padding: "11px 19px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  margin:'1px'
                }}
                onClick={()=>navigate("/library")}
              >
                Keep Shopping
              </button>
            </div>
          </CContainer>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default OrderSuccess;
