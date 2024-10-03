import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { Skeleton } from "../components/Loader"
import { useLatestProductsQuery } from "../redux/api/productAPI"
import { addToCart } from "../redux/reducer/cartReducer"
import { CartItem } from "../types/types"
import ProductCard from "./ProductCard"


const Home = () => {

  const {data,isLoading,isError}=useLatestProductsQuery("")
  const dispatch=useDispatch();
  
 const addCartHandler=(cartItem:CartItem)=>{
    if(cartItem.stock < 1) return toast.error("out Of Stock");
    dispatch(addToCart(cartItem))
    toast.success("Added to Cart")
 }

 if(isError) toast.error("Connot Load the product")

  return (
    <div className="home">
        <section></section>

        <h1>Latest Products
          <Link to={"/search"} className="findMore">More</Link>
        </h1>
        <main id="home">
          {isLoading?<Skeleton />:
            data?.product.map((i,idx)=>(
              
                  <ProductCard
                  key={idx}
                  productId={i._id}
                  name={i.name}
                   price={i.price} 
                  stock={i.stock} 
                  photo={i.photo} 
                  handler={addCartHandler} 
              />
            ))
          }
        </main>
    </div>
  )
}

export default Home
