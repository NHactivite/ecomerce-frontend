import { FaTrash } from "react-icons/fa"
import { useSelector } from "react-redux"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import AdminSideBar from "../../../components/Admin/AdminSideBar"
import { Skeleton } from "../../../components/Loader"
import { useDeleteOrderMutation, useOrderDetalisQuery, useUpdateOrderMutation } from "../../../redux/api/orderAPI"
import { OrderItemType } from "../../../types"
import { UserReducerInitialState } from "../../../types/reducers-types"
import { Order } from "../../../types/types"
import { responseToast } from "../../../utils/features"

const defaultData:Order={
  shippingInfo:{
    address:"",
      city:"",
      state:"",
      country:"",
      pinCode:"",
  },
      status:"",
     subtotal:0,
     discount:0,
     shippingCharges:0,
     total:0,
     orderItems:[],
     userId:"",
     _id:""
}

const TransactionManagement = () => {
 
  const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
  
  const params=useParams();
  const navigate=useNavigate();
  
  
  const {isLoading,data,isError}=useOrderDetalisQuery(params.id!);
 
  const {shippingInfo:{address,city,country,state,pinCode},orderItems,status,discount,total,shippingCharges,subtotal}=data?.order || defaultData;
  
  const [updateOrder]=useUpdateOrderMutation()
  const [deleteOrder]=useDeleteOrderMutation()

  const updateHandler=async()=>{
      const res=await updateOrder({
        userId: user?._id!,
        orderId:data?.order._id!
      });
      responseToast(res,navigate,"/admin/transaction")
  }
  const deleteHandler=async()=>{
    const res=await deleteOrder({
      userId: user?._id!,
      orderId:data?.order._id!
    });
    responseToast(res,navigate,"/admin/transaction")
  }
 
  if(isError) return <Navigate to={"/404"}/>
  


  return (
    <div className="adminContainer">
    <AdminSideBar/>
    <main className="productManagement">
          
              {
                isLoading?<Skeleton/> :<>
                    <section style={{
                padding:"2rem",
               }}>
                 <h2>Order Items</h2>
                    {
                      orderItems.map((i)=>(
                        <ProductCard key={i._id} name={i.name} photo={i.photos} price={i.price} quantity={i.quantity} _id={i._id}/>
                      ))
                    }
               </section>
               <article className="shippingInfoCard" ><span onClick={deleteHandler}><FaTrash/></span>
                <h1>Oder Info </h1>
                <h5>User Info</h5>
                <p>Address : {`${address}, ${city}, ${state}, ${country} ${pinCode}`}</p>
                <p>Amount Info </p>
                <p>Subtotal : {subtotal}</p>
                <p>ShippingCharges : {shippingCharges}</p>
                <p>Discount : {discount}</p>
                <p>Total : {total}</p>
                <p> Status:{" "} 
                   <span className={status==="delivered"?"purple":status==="shipped"?"red":"green"}>{status}</span>
                </p>
                <button  onClick={updateHandler}>Process Order</button>
               </article>
                </>
              }
      </main>
    </div>
  )
};

const ProductCard=({name,photo,price,quantity,_id}:OrderItemType)=>(
  <div className="transactionProductCard">
    <img src={photo} alt={name} /> 
    <Link to={`/product/${_id}`}>{name}</Link>
    <span>$ {price} X {quantity} = $ {price*quantity}</span>
  </div>
)

export default TransactionManagement
