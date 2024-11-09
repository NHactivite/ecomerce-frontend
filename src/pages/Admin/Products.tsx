import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSideBar from "../../components/Admin/AdminSideBar";
import TableHOC from "../../components/Admin/TableHOC";
import { Skeleton } from "../../components/Loader";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import { CustomError } from "../../types/api-types";
import { UserReducerInitialState } from "../../types/reducers-types";
interface DataType{
  photo:ReactElement;
  name:string;
  price:number;
  stock:number;
  brand:string;
 os:string;
 ram:number;
 cpu_model:string;
 cpu_speed:string;
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
  Header:"Brand",
  accessor:"brand",
  },
  {
  Header:"Os",
  accessor:"os",
  },
  {
  Header:"RAM",
  accessor:"ram",
  },
  {
  Header:"CPU_Model",
  accessor:"cpu_model",
  },
  {
  Header:"CPU_Speed",
  accessor:"cpu_speed",
  },
  {
    Header:"Action",
    accessor:"action"
  },
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
    photo: <img src={i.photos?.[0]?.url}/>,
    name:i.name,
    price:i.price,
    stock:i.stock,
    brand:i.brand,
    ram:i.ram,
    cpu_model:i.cpu_model,
    cpu_speed:i.cpu_speed,
    os:i.os,
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
