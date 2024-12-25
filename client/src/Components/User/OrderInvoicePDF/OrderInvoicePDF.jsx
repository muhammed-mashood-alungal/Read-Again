import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { 
    padding: 20, 
    fontSize: 12 
  },
  title: { 
    textAlign: "center", 
    fontSize: 18, 
    marginBottom: 20 
  },
  section: { 
    marginBottom: 10,
    flexDirection: "row"
  },
  label: { 
    fontWeight: "bold",
    width: "30%"
  },
  value: {
    width: "70%"
  },
  table: { 
    display: "table", 
    width: "100%", 
    marginTop: 10 
  },
  tableRow: { 
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeader: { 
    backgroundColor: "#e0e0e0", 
    fontWeight: "bold",
    borderBottomWidth: 2,
  },
  tableCell: {
    width: "20%",
    padding: 5,
    border: 1,
    textAlign: "center",
  },
  productCell: {
    width: "40%",
    padding: 5,
    border: 1,
    textAlign: "left",
  },
  summary: {
    marginTop: 20,
    alignItems: 'flex-end'
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  summaryLabel: {
    width: 150,
    textAlign: 'right',
    marginRight: 10,
    fontWeight: 'bold'
  },
  summaryValue: {
    width: 100,
    textAlign: 'right'
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    color: '#666'
  }
});

const OrderInvoicePDF = ({ orderData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Order Invoice</Text>

      {/* Order Information Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Order ID: </Text>
        <Text style={styles.value}>{orderData._id}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Order Date: </Text>
        <Text style={styles.value}>{new Date(orderData.orderDate).toLocaleDateString()}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Customer Name: </Text>
        <Text style={styles.value}>{orderData?.userId?.username}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Email: </Text>
        <Text style={styles.value}>{orderData?.userId?.email}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Payment Method: </Text>
        <Text style={styles.value}>{orderData?.paymentMethod}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Payment Status: </Text>
        <Text style={styles.value}>{orderData?.paymentStatus}</Text>
      </View>
      {/* Products Table */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.productCell}>Product</Text>
          <Text style={styles.tableCell}>Quantity</Text>
          <Text style={styles.tableCell}>Unit Price</Text>
          <Text style={styles.tableCell}>Total</Text>
        </View>
        {orderData?.items?.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.productCell}>{item?.bookId?.title}</Text>
            <Text style={styles.tableCell}>{item?.quantity}</Text>
            <Text style={styles.tableCell}>{item?.unitPrice}</Text>
            <Text style={styles.tableCell}>
              ₹{(item.totalPrice).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Order Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>{orderData?.totalAmount?.toFixed(2)}</Text>
        </View>
        {orderData.coupon && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Coupon Discount :</Text>
            <Text style={styles.summaryValue}>-{orderData?.totalAmount?.toFixed(2) - orderData?.payableAmount?.toFixed(2)}</Text>
          </View>
        )}
         <View style={[styles.summaryRow, { marginTop: 5, borderTopWidth: 1 }]}>
          <Text style={styles.summaryLabel}>Shipping Amount:</Text>
          <Text style={styles.summaryValue}>0</Text>
        </View>
        <View style={[styles.summaryRow, { marginTop: 5, borderTopWidth: 1 }]}>
          <Text style={styles.summaryLabel}>Payable Amount:</Text>
          <Text style={styles.summaryValue}>{orderData?.payableAmount?.toFixed(2)}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Thank you for your purchase!</Text>
        
      </View>
    </Page>
  </Document>
);

export default OrderInvoicePDF;