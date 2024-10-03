import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import TableHOC from "../../components/Admin/TableHOC";
import { Skeleton } from "../../components/Loader";
import { useAllOrdersQuery } from "../../redux/api/orderAPI";
import { CustomError } from "../../types/api-types";
import { UserReducerInitialState } from "../../types/reducers-types";

interface DataType{
 userId:string ;
 amount:number;
 discount:number;
 quantity:number;
 status:string;
 action:ReactElement;
}

const columns:Column<DataType>[]=[
  {
    Header:"User",
    accessor:"userId"
  },
  {
    Header:"Amount",
    accessor:"amount"
  },
  {
    Header:"Discount",
    accessor:"discount"
  },
  {
    Header:"Quantity",
    accessor:"quantity"
  },
  {
    Header:"Status",
    accessor:"status"
  },
  {
    Header:"Action",
    accessor:"action"
  },
]
const arr:DataType[]=[
  {
    userId:"nik",
    amount:6000,
    discount:600,
    quantity:2,
    status:"processing",
    action:<Link to="/admin/transaction/:id">Manage</Link>
  }
]


const Transaction = () => {

  const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
  
 const {isLoading,data,isError,error}=useAllOrdersQuery(user?._id!);

 const [rows,setRows]=useState<DataType[]>(arr);

 useEffect(()=>{
  if(data && data.orders) {
  setRows(data.orders.map((i)=>(
  {
     userId:i.userId,
     amount:i.total,
     discount:i.discount,
      quantity:i.orderItems.length,
      status:i.status,
      action:<Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
  }
  )) 
  ) 
}
 },[data]);
 if(isError){
  const err=error as CustomError;
  toast.error(err.data.message);
 }

 
const table=TableHOC(columns,rows,"transactionTable","Transaction",true)()

  return (
    <div className="adminContainer">
    <AdminSideBar/>
    <main>
        {
          isLoading ? (
            <Skeleton />
          ) :( 
            table
          )
        } 
    </main>
  </div>
  )
}

export default Transaction
