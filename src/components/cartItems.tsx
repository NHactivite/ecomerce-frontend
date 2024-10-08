import { FaTrash } from "react-icons/fa"
import { Link } from "react-router-dom"
import { server } from "../redux/store"
import { CartItem } from "../types/types"

type CartItemsProps={
            cartItem:CartItem,
            incrementHandler:(CartItem:CartItem)=>void;
            decrementHandler:(CartItem:CartItem)=>void;
            removeHandler:(id:string)=>void;
}

const CartItems = ({cartItem,incrementHandler,decrementHandler,removeHandler}:CartItemsProps) => {
 const {photo,productId,name,price,quantity}=cartItem
  return (
    <div className="cartItem">
       <img src={`${server}/${photo}`} alt={name} />
       <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>&#x20B9;{price}</span>
       </article>
       <div>
        <button onClick={()=>decrementHandler(cartItem)}>-</button>
        <p>{quantity}</p>
        <button onClick={()=>incrementHandler(cartItem)}>+</button>
       </div>
       <button onClick={()=>removeHandler(productId)}><FaTrash/></button>
    </div> 
  )
}

export default CartItems


