import { Column } from "react-table";
import TableHOC from "./TableHOC"

interface DataType{
    _id:string;
    quantity:number;
    discount:number;
    total:number;
    status:string
}
const columns:Column<DataType>[]=[
    {
    Header:"Id",
    accessor:"_id"
    }
 ,
    {
    Header:"Quantity",
    accessor:"quantity"
    }
 ,
    {
    Header:"Discount",
    accessor:"discount"
    }
 ,
    {
    Header:"Amount",
    accessor:"total"
    }
 ,
    {
    Header:"Status",
    accessor:"status"
    }
 ]
const DashBoardTable = ({data=[]}:{data:DataType[]}) => {

  return TableHOC<DataType>(columns,data,"transactionBox","Top Transaction")()
}

export default DashBoardTable
