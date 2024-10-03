import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItems from "../components/cartItems";
import { addToCart, calculatePrice, discountApplied, removeCartItem } from "../redux/reducer/cartReducer";
import { CartReducerInitialState } from "../types/reducers-types";
import { CartItem } from "../types/types";
import axios from "axios";
import { server } from "../redux/store";

const Cart = () => {

  const dispatch=useDispatch()

  const {cartItems,subtotal,shippingCharges,tax,total,discount}=useSelector((state:{cartReducer:CartReducerInitialState})=>state.cartReducer)

  const [couponCode, setcouponCode] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);

  const incrementHandler=(cartItem:CartItem)=>{
  
    if(cartItem.quantity>=cartItem.stock) return;
    dispatch(addToCart({...cartItem,quantity:cartItem.quantity+1}))
 }
  const decrementHandler=(cartItem:CartItem)=>{
    if(cartItem.quantity<=1) return;
    dispatch(addToCart({...cartItem,quantity:cartItem.quantity-1}))
 }
  const removeHandler=(productId:string)=>{
    dispatch(removeCartItem(productId))
 }
 
  useEffect(()=>{
           
    const {token,cancel}=axios.CancelToken.source()

         const TimeoutId=setTimeout(()=>{
            
          axios.get(`${server}/api/v1/payment/discount/${couponCode}`,{cancelToken:token})
          .then((res)=>{
            dispatch(discountApplied(res.data.discount));
            setIsValid(true);
            dispatch(calculatePrice()) 
          })
          .catch(()=>{
            dispatch(discountApplied(0));
            dispatch(calculatePrice()) 
             setIsValid(false)
            })

         },1000)

     return ()=>{
      clearTimeout(TimeoutId);
      cancel();
      setIsValid(false)
     }
  },[couponCode])

 useEffect(()=>{
     dispatch(calculatePrice())  
 },[cartItems])


  return (
    <div className="cart">
      <main>
        {
         cartItems.length >0 ? ( cartItems.map((i,idx)=>(
          <CartItems key={idx} cartItem={i} incrementHandler={incrementHandler} decrementHandler={decrementHandler} removeHandler={removeHandler}/>
        ))) :(<h1>No Items Add</h1>)
        }
      </main>
      <aside>
        <div>
        <p>Subtotal: &#x20B9;{subtotal}</p>
        <p>Shipping Charges: &#x20B9;{shippingCharges}</p>
        <p>Tax: &#x20B9;{tax}</p>

        <p>
          Discount: <em className="red"> - &#x20B9;{discount}</em>
        </p>
        <p>
          <b>Total :&#x20B9; {total}</b>
        </p>
        </div>
        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setcouponCode(e.target.value)}
        />

        {couponCode &&
          (isValid ? (
            <span className="green">
              &#x20B9;{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}

          {
            cartItems.length>0 && <Link to={"/shipping"}>Checkout</Link>
          }
      </aside>
    </div>
  );
};

export default Cart;
