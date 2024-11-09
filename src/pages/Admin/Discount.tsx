import { ReactElement, useEffect, useState } from "react"
import AdminSideBar from "../../components/Admin/AdminSideBar"
import TableHOC from "../../components/Admin/TableHOC"
import { Skeleton } from "../../components/Loader"
import { Column } from "react-table"
import { Link } from "react-router-dom"
import { FaPlus } from "react-icons/fa"
import { useCouponsQuery } from "../../redux/api/couponApi"
import { useSelector } from "react-redux"
import { UserReducerInitialState } from "../../types/reducers-types"


interface DataType{
    code:string,
    amount:number,
    _id:string,
    action:ReactElement
}
const columns:Column<DataType>[]=[
    {
        Header:"Id",
        accessor:"_id",
    },
    {
    Header:"Code",
    accessor:"code",
    },
    {
    Header:"Amount",
    accessor:"amount",
    },
    {
    Header:"Action",
    accessor:"action",
    }
  ]

const Discount = () => {

  const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)

 const{data,isLoading}=useCouponsQuery(user?._id!);
    const [rows,setRows]=useState<DataType[]>([]);
    let Table=TableHOC<DataType>(columns, rows, "dashboardProductBox", "Products",false)()

    useEffect(()=>{
      if(data){
        setRows(
          data.coupons.map((i)=>({
            _id:i._id,
            code:i.code,
            amount:i.amount,
            action:<Link to={`/admin/discount/${i._id}`}>Manage</Link>
          }))
        )
      }
         
    },[data])
 
  return (
    <div className="adminContainer">
    <AdminSideBar/>
    <main>
        {
          isLoading ? (
            <Skeleton  height="30px" width="100%" length={5} />
          ) :( 
            Table
          )
        } 
    </main>
    <Link to={`/admin/discount/new`} className="createNewProduct"><FaPlus/></Link>
  </div>
  )
}

export default Discount
