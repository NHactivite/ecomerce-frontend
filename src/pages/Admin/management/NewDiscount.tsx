import { FormEvent, useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import AdminSideBar from "../../../components/Admin/AdminSideBar"
import { Skeleton } from "../../../components/Loader"
import { useNewCouponMutation } from "../../../redux/api/couponApi"
import { UserReducerInitialState } from "../../../types/reducers-types"
import { responseToast } from "../../../utils/features"


const NewDiscount = () => {
  const navigate=useNavigate()
  const isLoading=false
  const [code,setCode]=useState<string>("")
  const [amount,setPrice]=useState<number>(0)
 const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
const [newCoupon]=useNewCouponMutation()
const submitHandler=async(e:FormEvent<HTMLFormElement>)=>{
try {
  e.preventDefault();
  const Payload = {
    code: code,
    amount: amount,
    _id: user?._id!,
  };
  const res=await newCoupon({_id:user?._id!,Payload})
  responseToast(res,navigate,"/admin/discount")
} catch (error) {
  toast.error("Coupon not Created");
}
}

  return (
    <div className="adminContainer " >
    <AdminSideBar/>
    <main className="productManagement">
        {
          isLoading?
          <Skeleton  height="30px" width="100%" length={5} />:
             
          <article className="discountArticle">
               <form onSubmit={submitHandler} >
                <h2>New Coupon</h2>
                <div>
                  <label >Name</label>
                  <input required type="text" placeholder="Coupon Code" value={code} onChange={(e)=>setCode(e.target.value)}/>
                </div>
                <div>
                  <label >Amount</label>
                  <input required type="number" placeholder="Amount" min={"0"} value={amount=== 0? "": amount} onChange={(e)=>setPrice(Number(e.target.value))}/>
                </div>
               
                <button type="submit" >create</button>
               </form>
             </article>
        }
    </main>
    
  </div>
  )
}

export default NewDiscount
