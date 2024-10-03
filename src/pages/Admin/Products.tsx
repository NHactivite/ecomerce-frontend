import { ReactElement, useEffect, useState } from "react";
import AdminSideBar from "../../components/Admin/AdminSideBar"
import TableHOC from "../../components/Admin/TableHOC"
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import { server } from "../../redux/store";
import toast from "react-hot-toast";
import { CustomError } from "../../types/api-types";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducers-types";
import { Skeleton } from "../../components/Loader";
interface DataType{
  photo:ReactElement;
  name:string;
  price:number;
  stock:number;
  action:ReactElement;
}

const columns:Column<DataType>[]=[
  {
  Header:"Photo",
  accessor:"photo",
  },
  {
  Header:"Name",
  accessor:"name",
  },
  {
  Header:"Price",
  accessor:"price",
  },
  {
  Header:"Stock",
  accessor:"stock",
  },
  {
  Header:"Action",
  accessor:"action",
  }
]



const Products = () => {

  const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)

 const{data,isLoading,error}=useAllProductsQuery(user?._id!);

  const [rows,setRows]=useState<DataType[]>([]);

  if(error) toast.error((error as CustomError).data.message);
  useEffect(()=>{
    if(data && data.product) {
    setRows(data.product.map((i)=>(
    {
    photo: <img src={`${server}/${i.photo}`}/>,
    name:i.name,
    price:i.price,
    stock:i.stock,
    action: <Link to={`/admin/product/${i._id}`}>Manage</Link>,
    }
    )) 
    ) 
  }
   },[data]);

   if (error) toast.error((error as CustomError).data.message);

   let Table=TableHOC<DataType>(columns, rows, "dashboardProductBox", "Products",true)()
 
  
   
  return (
    <div className="adminContainer">
    <AdminSideBar/>
    <main>
        {
          isLoading ? (
            <Skeleton />
          ) :( 
            Table
          )
        } 
    </main>
    <Link to="/admin/product/new" className="createNewProduct"><FaPlus/></Link>
  </div>
  )
}

export default Products;
