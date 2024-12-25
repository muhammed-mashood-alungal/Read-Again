import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
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
    fontWeight: "bold"
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
    width: "25%",
    padding: 5,
    border: 1,
    textAlign: "center",
  },
  orderIdCell: {
    width: "25%",
    padding: 5,
    border: 1,
    textAlign: "left",
  },
  customerCell: {
    width: "25%",
    padding: 5,
    border: 1,
    textAlign: "left",
  },
});


const SalesPDFDocument = ({ salesReport }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Sales Report</Text>


      <View style={styles.section}>
        <Text style={styles.label}>Filter Type: </Text>
        <Text style={styles.value}>{salesReport.filterType}    </Text>
        {
          salesReport.filterType == 'custom' &&
          <>
            <Text style={styles.value}>Start Date : {salesReport.startDate}    </Text>
            <Text style={styles.value}>End Date : {salesReport.endDate}</Text>
          </>

        }
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Total Revenue: </Text>
        <Text style={styles.value}> {salesReport.totalRevenue}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Total Coupon Discount: </Text>
        <Text style={styles.value}>{salesReport.totalCouponDiscount}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Overall Discount(Coupon+Offer): </Text>
        <Text style={styles.value}>{salesReport.totalDiscount}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Total Sales: </Text>
        <Text style={styles.value}>{salesReport.totalSales}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Items Sold: </Text>
        <Text style={styles.value}>{salesReport.itemsSold}</Text>
      </View>


      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.orderIdCell}>Order ID</Text>
          <Text style={styles.customerCell}>Order Date</Text>
          <Text style={styles.tableCell}>Amount</Text>
          <Text style={styles.tableCell}>Quantity</Text>
        </View>
        {salesReport.orders.map((order, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.orderIdCell}>{order._id}</Text>
            <Text style={styles.tableCell}>
              {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
            </Text>
            <Text style={styles.tableCell}>{order.totalAmount}</Text>
            <Text style={styles.customerCell}>{order.coupon ? "Coupon Applied" : "No Coupon"}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default SalesPDFDocument;
