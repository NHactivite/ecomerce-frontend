import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem } from "../types/types";
type ProductProps={
  productId:string,
  name:string,
  photo:string,
  price:number,
  stock:number,
  handler:(cartItem: CartItem) => string | undefined;
}



const ProductCard = ({productId,price,photo,stock,handler,name}:ProductProps) => {
  return (
   <div className="productCard">
    {/* uploads\7ea5a9dd-0fcc-42c2-b601-667e67ea433a.jpg */}
       <img src={`${server}/${photo}`} alt={name} />
       <p>{name}</p>
       <span>&#x20B9;{" "}{price}</span>
       <div>
        <button onClick={()=>handler({photo,price,productId,quantity:1,name,stock})}><FaPlus/></button>
       </div>
   </div>
  )
}

export default ProductCard
