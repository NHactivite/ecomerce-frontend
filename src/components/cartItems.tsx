import { FaTrash } from "react-icons/fa"
import { Link } from "react-router-dom"
import { CartItem } from "../types/types"
import { useSelector } from "react-redux";
import { darkReducerInitialState } from "../types/reducers-types";

type CartItemsProps={
            cartItem:CartItem,
            incrementHandler:(CartItem:CartItem)=>void;
            decrementHandler:(CartItem:CartItem)=>void;
            removeHandler:(id:string)=>void;
}

const CartItems = ({cartItem,incrementHandler,decrementHandler,removeHandler}:CartItemsProps) => {
  const {dark}=useSelector((state:{darkReducer:darkReducerInitialState})=>state.darkReducer)
 
 const {photos,productId,name,price,quantity}=cartItem
  return (
    <div className="cartItem">
       <img src={photos} alt={name} />
       <article>
        <Link className={`${dark ? 'darkList' : ''}`} to={`/product/${productId}`}>{name}</Link>
        <span>&#x20B9;{price}</span>
       </article>
       <div>
        <button onClick={()=>decrementHandler(cartItem)}>-</button>
        <p>{quantity}</p>
        <button onClick={()=>incrementHandler(cartItem)}>+</button>
       </div>
       <button onClick={()=>removeHandler(productId)} ><FaTrash/></button>
    </div> 
  )
}

export default CartItems


