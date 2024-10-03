import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import TableHOC from "../components/Admin/TableHOC";
import { Skeleton } from "../components/Loader";
import { useMyOrdersQuery } from "../redux/api/orderAPI";
import { CustomError } from "../types/api-types";
import { UserReducerInitialState } from "../types/reducers-types";

type dataType={
         _id:string;
         amount:number;
         quantity:number;
         discount:number;
         status:string;
         action:ReactElement;
}

const column:Column<dataType>[]=[
    {
        Header:"ID",
        accessor:"_id"
    },
    {
        Header:"Quantity",
        accessor:"quantity"
    },
    {
        Header:"Discount",
        accessor:"discount"
    },
    {
        Header:"Amount",
        accessor:"amount"
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




const Order = () => {
    const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
  const {isLoading,data,isError,error}=useMyOrdersQuery(user?._id!);

  const [rows,setRows]=useState<dataType[]>([]);

  useEffect(()=>{
    if(data && data.orders) {
    setRows(data.orders.map((i)=>(
    {
       _id:i._id,
       amount:i.total,
       discount:i.discount,
        quantity:i.orderItems.length,
        status:i.status,
        action:<Link to={`/orderDetails/${i._id}`}>View</Link>,
    }
    )) 
    ) 
  }
   },[data]);

if(isError){
  const err=error as CustomError;
  toast.error(err.data.message);
 }
const table=TableHOC<dataType>(column,rows,"dashBoardProductBox","Orders",rows.length > 6)()

  return (
    <div className="container">
       <h1>My Orders</h1>
       {
          isLoading ? (
            <Skeleton />
          ) :( 
            table
          )
        }
    </div>
  )
}

export default Order
