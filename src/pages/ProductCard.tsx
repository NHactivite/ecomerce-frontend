import toast from "react-hot-toast";
import { CiHeart } from "react-icons/ci";
import { FaExpandAlt, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { newWishRequest } from "../types/api-types";
import { darkReducerInitialState } from "../types/reducers-types";
import { CartItem } from "../types/types";
type ProductProps={
  userId:string
  productId:string,
  name:string,
  photos:{
    public_id:string,
    url:string
  }[],
  price:number,
  stock:number,
  handler:(cartItem: CartItem) => string | undefined;
  wishHandler:(newWishRequest: newWishRequest) => Promise<void>;
}

const ProductCard = ({productId,price,photos,stock,handler,name,wishHandler,userId}:ProductProps) => {
  const {dark}=useSelector((state:{darkReducer:darkReducerInitialState})=>state.darkReducer)

  const handleWishClick = async () => {
    if (!userId) {
      return alert("You need to be logged in to add to your wishlist."); // or use a toast notification
    }

    const wishRequest: newWishRequest = {
      userId: userId,
      productId: productId,
    };

    try {
      await wishHandler(wishRequest);
      // Optionally, you could add feedback here (like a toast)
    } catch (error) {
      // console.error("Failed to add wish:", error);
      toast.error("Failed to add to wishlist. Please try again."); // or use a toast notification
    }
  };
 
  return (
   <div  className={`productCard ${dark ? 'darkHeader' : ''}`}>
    {/* uploads\7ea5a9dd-0fcc-42c2-b601-667e67ea433a.jpg */}
    
       <img src={photos && photos[0] ? photos[0].url : 'default-image-url'} alt={name}  className={`${dark ? 'darkHeader' : ''}`}/>
       <p>{name}</p>
       <span>&#x20B9;{" "}{price}</span>
       <div>
        <button onClick={()=>handler({photos:photos[0].url,price,productId,quantity:1,name,stock})}><FaPlus/></button>
        <button onClick={handleWishClick}><CiHeart/></button>
        <Link to={`/product/${productId}`}><FaExpandAlt/></Link>
       </div>
   </div>
  )
}

export default ProductCard
