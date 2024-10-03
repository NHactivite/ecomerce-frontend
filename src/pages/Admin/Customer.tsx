import { ReactElement, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaTrash } from "react-icons/fa"
import { useSelector } from "react-redux"
import { Column } from "react-table"
import AdminSideBar from "../../components/Admin/AdminSideBar"
import TableHOC from "../../components/Admin/TableHOC"
import { Skeleton } from "../../components/Loader"
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/userAPI"
import { CustomError } from "../../types/api-types"
import { UserReducerInitialState } from "../../types/reducers-types"
import { responseToast } from "../../utils/features"
interface DataType{
  photo:ReactElement;
  name:string;
  gender:string;
  Email:string;
  role:string;
  action:ReactElement;
}

const columns:Column<DataType>[]=[
  {
    Header:"Photo",
    accessor:"photo"
  },
  {
    Header:"Name",
    accessor:"name"
  },
  {
    Header:"Gender",
    accessor:"gender"
  },
  {
    Header:"Email",
    accessor:"Email"
  },
  {
    Header:"Role",
    accessor:"role"
  },
  {
    Header:"Action",
    accessor:"action"
  }
]


const Customer = () => {
  const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
   
  const {isLoading,data,isError,error}=useAllUsersQuery(user?._id!);

  const [row,setRows]=useState<DataType[]>([])

  const [deleteUser]=useDeleteUserMutation()

   const deleteHandler=async(userId:string)=>{
    const res=await deleteUser({userId,adminUserId:user?._id!})
    responseToast(res,null,"");
   }

   if(isError){
    const err=error as CustomError;
    toast.error(err.data.message);
   }
  useEffect(()=>{
   if(data && data.users){
    setRows(data.users.map((i)=>(
      {
        photo:<img src={i.photo}/>,
        name:i.name,
        Email:i.email,
        gender:i.gender,
        role:i.role,
        action:(<button onClick={()=>deleteHandler(i._id)}><FaTrash/></button>)
      }
    )))
   }
  },[data])

const table=TableHOC<DataType>(columns,row,"customerTable","Customer",true)()

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

export default Customer
