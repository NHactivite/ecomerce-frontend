import { FormEvent, useEffect, useState } from "react"
import { UserReducerInitialState } from "../../../types/reducers-types"
import { useSelector } from "react-redux"
import AdminSideBar from "../../../components/Admin/AdminSideBar"
import { FaTrash } from "react-icons/fa"
import { useDeleteCouponMutation, useOneCouponQuery, useUpdateCouponMutation } from "../../../redux/api/couponApi"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { responseToast } from "../../../utils/features"
import { Skeleton } from "../../../components/Loader"


const DiscountManagement = () => {
  const navigate=useNavigate()
    const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
    const [code,setCode]=useState<string>("")
    const [amount,setPrice]=useState<number>(0)
    const params=useParams()
    const {data,isLoading,isError}=useOneCouponQuery({couponId:params.id!,userId:user?._id!})
    const [updateCoupon]=useUpdateCouponMutation()
    const [deleteCoupon]=useDeleteCouponMutation()
    if(isError) return <Navigate to={"/404"}/>
   useEffect(()=>{
       if(data){
        setCode(data.coupon.code)
        setPrice(data.coupon.amount)
       }
   },[data])
   const submitHandler=async(e:FormEvent<HTMLFormElement>)=>{
try {
    e.preventDefault();
   
    if(data?.coupon.code!=code|| data?.coupon.amount!=amount){
    
      const Payload = {
        code: code,
        amount: amount,
        _id: user?._id!,
      };
      const res=await updateCoupon({Payload,userId:user?._id!,couponId:data?.coupon._id!})
      responseToast(res,navigate,"/admin/discount")
    }
    
} catch (error) {
  toast.error("something wrong in server")
}

   }
   const deleteHandler=async()=>{
     try {
      const res=await deleteCoupon({userId:user?._id!,couponId:data?.coupon._id!})
      responseToast(res,navigate,"/admin/discount")
     } catch (error) {
      toast.error("something wrong in server")
     }
   }
  return (
    <div className="adminContainer">
    <AdminSideBar/>
    <main className="productManagement mobile">

    {
          isLoading?<Skeleton/>:
          <article>
      <button className="backBtn" onClick={deleteHandler}>
        <FaTrash/>
      </button>
           <form onSubmit={submitHandler}>
            <h2>Manage</h2>
            <div>
              <label >Name</label>
              <input required type="text" placeholder="Name" value={code} onChange={(e)=>setCode(e.target.value)}/>
            </div>
            <div>
              <label >Price</label>
              <input required type="number" placeholder="Price" min={"0"} value={amount=== 0? "": amount} onChange={(e)=>setPrice(Number(e.target.value))}/>
            </div>
            <button type="submit" >Update</button>
           </form>
         </article>
    }
      </main>
    </div>
  )
}

export default DiscountManagement
