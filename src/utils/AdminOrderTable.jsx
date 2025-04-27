import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { FaEye } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";

export default function AdminOrderTable({ paginatedOrders, handleViewDetails }) {

  const columns = [
    { field: "_id", headerName: "Order ID", width: 180 },
    { field: "location", headerName: "Location", width: 200 },
    { 
      field: "orderStatus", 
      headerName: "Status", 
      width: 150,
      renderCell: (params) => (
        <span
          style={{
            color:
              params.value === "Completed"
                ? "green"
                : params.value === "Pending"
                ? "orange"
                : "blue",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </span>
      ),
    },
    { field: "totalPrice", headerName: "Amount (D.A)", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleViewDetails(params.row.fullOrder)}>
          <FaEye style={{ color: "blue" }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={paginatedOrders.map((order, index) => ({
          id: index + 1, 
          _id: order._id,
          location: order.shippingInfo?.address || "N/A",
          orderStatus: order.orderStatus,
          totalPrice: `D.A ${order.totalPrice}`,
          fullOrder: order, // Attach the full order object
        }))}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
