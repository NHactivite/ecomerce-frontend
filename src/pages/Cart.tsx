import axios from "axios";
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItems from "../components/cartItems";
import { addToCart, calculatePrice, discountApplied, removeCartItem } from "../redux/reducer/cartReducer";
import { server } from "../redux/store";
import { CartReducerInitialState, darkReducerInitialState } from "../types/reducers-types";
import { CartItem } from "../types/types";

const Cart = () => {

  const dispatch=useDispatch()

  const {cartItems,subtotal,shippingCharges,total,discount}=useSelector((state:{cartReducer:CartReducerInitialState})=>state.cartReducer)
  const {dark}=useSelector((state:{darkReducer:darkReducerInitialState})=>state.darkReducer)
 
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
    if (couponCode) {
      setcouponCode("");  // Clear the coupon code if it's set
  }
 }

  useEffect(()=>{
    
      window.scrollTo(0, 0);
      
    const {token,cancel}=axios.CancelToken.source()

         const TimeoutId=setTimeout(()=>{
          let BasePrice=0;
          
          axios.get(`${server}/api/v1/payment/discount/${couponCode}`,{cancelToken:token})
          .then((res)=>{
             BasePrice=total-res.data.discount
            if(BasePrice>200){
              dispatch(discountApplied(res.data.discount))
            }
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
  },[couponCode,cartItems])


  return (
    <div className={`cart ${dark ? 'dark' : ''}`}>
      <main>
        {
         cartItems.length >0 ? ( cartItems.map((i,idx)=>(
          <CartItems key={idx} cartItem={i} incrementHandler={incrementHandler} decrementHandler={decrementHandler} removeHandler={removeHandler}/>
        ))) :(<h1>No Items Add</h1>)
        }
      </main>
      <aside className={`${dark ? 'darkHeader' : ''}`}>
        <div>
        <p>Subtotal: &#x20B9;{subtotal}</p>
        <p>Shipping Charges: &#x20B9;{shippingCharges}</p>
        <p>
          Discount: <em className="red">{`- ${discount}`}</em>
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
          className={`${dark ? 'dark' : ''}`}
        />

        {couponCode &&
          (isValid ? (
            <span className="green">
            {`${discount} off using the`} <code>{couponCode}</code>
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
