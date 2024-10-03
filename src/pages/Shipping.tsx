import { load } from "@cashfreepayments/cashfree-js"
import axios from "axios"
import { ChangeEvent, useEffect, useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useNewOrderMutation } from "../redux/api/orderAPI"
import { resetCart, saveShippingInfo } from "../redux/reducer/cartReducer"
import { NewOrderRequest } from "../types/api-types"
import { CartReducerInitialState, UserReducerInitialState } from "../types/reducers-types"
import { responseToast } from "../utils/features"
import toast from "react-hot-toast"


const Shipping = () => {

  let navigate=useNavigate();
  const {cartItems,total,subtotal,tax,discount,shippingCharges,}=useSelector((state:{cartReducer:CartReducerInitialState})=>state.cartReducer)

  const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)

  const [disable,setDisable]=useState<boolean>(true);
  const [shippingInfo,setShippingInfo]=useState({
    address:"",
    city:"",
    state:"",
    country:"",
    pinCode:"",
})
   

     useEffect(()=>{ 
        const { address, city, state, country, pinCode } = shippingInfo;
        if (address && city && state && country && pinCode && cartItems.length>0){
          setDisable(false)  // Enable button
        }
         else {
          setDisable(true)  // Disable button
        }
        
     },[cartItems,shippingInfo])

    

  const changeHandler=(e:ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
      e.preventDefault();
      setShippingInfo(prev=>({...prev,[e.target.name]:e.target.value}))
  }
 //          payment---------------------------------------
 const orderData: NewOrderRequest = {
  shippingInfo,
  orderItems: cartItems,
  subtotal,
  tax,
  discount,
  shippingCharges,
  total,
  userId: user?._id!,
};
const [newOrder] = useNewOrderMutation();

  //  const[order_id,setOrder_id]=useState<string>("")

  const dispatch=useDispatch()
  let cashfree:any;
  let insitialzeSDK = async function () {

    cashfree = await load({
      mode: "sandbox",
    })
  }

  insitialzeSDK()
  const getSessionId = async () => {
    try {
      let res = await axios.post(`${import.meta.env.VITE_SERVER}/api/v1/payment/pay`,{
        customer_id:user?._id,
        order_amount:total
      }
    )
    
      if(res.data && res.data.payment_session_id){
           return {
            paymentSessionId: res.data.payment_session_id,
            orderId: res.data.order_id, // Return order_id directly
            order_status:res.data.order_status
          };
      }

    } catch (error) {
      toast.error("something Wrong")
    }
  }

  const verifyPayment = async ( _id:string) => {
    
    try {
      
      let res = await axios.post(`${import.meta.env.VITE_SERVER}/api/v1/payment/verify`, {
        order_id:_id
      })
        
      if(res && res.data[0].payment_status){
        toast.success("payment verified")
         const response = await  newOrder(orderData);
         responseToast(response,navigate,"/");
         dispatch(resetCart());
      }

    } catch (error) {
      toast.error("payment Cancel")
    }
  }



   const handleClick=async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    e.preventDefault();
    dispatch(saveShippingInfo(shippingInfo));

       try {
        
        let sessionId = await getSessionId()   
        let checkoutOptions = {
          paymentSessionId : sessionId?.paymentSessionId,
          redirectTarget:"_modal",
        }
  
        cashfree.checkout(checkoutOptions).then(() => {
            verifyPayment(sessionId?.orderId); // Now it's safe to verify the payment
          
        })
      } catch (error) {
        toast.error("payment failed")
      }
  
    }
   
  
//--------------------------------------------------------

  return (
    <div className="shipping">
        <button className="backBtn" onClick={()=>navigate("/cart")}><BiArrowBack/></button>
        <form >
             <h1>Shipping Address</h1>
             <input type="text"  placeholder="Address" name="address" value={shippingInfo.address} onChange={changeHandler} required/>
             <input type="text"  placeholder="City" name="city" value={shippingInfo.city} onChange={changeHandler} required/>
             <input type="text"  placeholder="State" name="state" value={shippingInfo.state} onChange={changeHandler} required/>
             <input type="text"  placeholder="Country" name="country" value={shippingInfo.country} onChange={changeHandler} required/>
             <select name="country" required value={shippingInfo.country} onChange={changeHandler}>
                <option value="">Choose Country</option>
                <option value="india">India</option>
             </select>
             <input type="number"  placeholder="Pincode" name="pinCode" value={shippingInfo.pinCode} onChange={changeHandler} required/>
             <button type="submit" onClick={handleClick} disabled={disable}>Pay Now</button>
        </form>
    </div>
  )
}

export default Shipping
