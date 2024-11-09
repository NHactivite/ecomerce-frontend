import { CarouselButtonType, MyntraCarousel, Slider, useRating } from "6pp";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaRegStar, FaStar, FaTrash } from "react-icons/fa";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { Skeleton } from "../components/Loader";
import Rating from "../components/Rating";
import { useDeleteReviewMutation, useNewReviewMutation, useNewWishMutation, useProductDetailsQuery, useProductReviewQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { newWishRequest } from "../types/api-types";
import { darkReducerInitialState, UserReducerInitialState } from "../types/reducers-types";
import { CartItem } from "../types/types";
import { responseToast } from "../utils/features";
import ProductCard from "./ProductCard";
const ProductDetails = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
  const params = useParams();
  const { isLoading, isError, data } = useProductDetailsQuery(params.id!); 
  const {dark}=useSelector((state:{darkReducer:darkReducerInitialState})=>state.darkReducer)
  const search=data?.product?.brand??"samsung"
  const {data:searchData,isLoading:searchLoading}=useSearchProductsQuery({search})
  
  const [addWish]=useNewWishMutation()
 const addWishHandler = async (newWishRequest: newWishRequest) => {
  const res = await addWish(newWishRequest);
  responseToast(res,null,"");
}

const newSearchData=searchData?.products.filter(i=>i._id!=data?.product._id)

  const reviewsRes=useProductReviewQuery(params.id!)

  if (isError) return (
    <Navigate to={"/404"}/>
 );
  const [carousalOpen, setCarousalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [PlusActive,setPlusActive]=useState(false)
  const [MinsActive,setMinsActive]=useState(false)
   const [reviewComment,setReviewComment]=useState("")
  const reviewDialogRef=useRef<HTMLDialogElement>(null)

 const showDialog=()=>{ reviewDialogRef.current?.showModal();}
 const reviewCloesdHandler=()=>reviewDialogRef.current?.close()

 const [newReview]=useNewReviewMutation()
 const [deleteReview]=useDeleteReviewMutation()
  const {Ratings:RatingEdit,rating,setRating}=useRating({IconFilled:<FaStar/>,
    IconOutline:<FaRegStar/>,
    value:0,
    selectable:true,
   styles:{fontSize:"1.5rem",color:"coral" ,justifyContent:"flex-start"}
  })

  const increment = () => {
    setMinsActive(false)
    if(data?.product.stock===quantity)  {
      setPlusActive(true)
      return toast.error("Exceeds available stock")
  }
 
    setQuantity((prev) => prev + 1)

  };
  const decrement = () =>{
    setPlusActive(false)
    if(quantity===0){
      return setMinsActive(true)
    }
    setQuantity((prev) => prev - 1)
  };

  const dispatch = useDispatch();

  const addCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("out Of Stock");
   
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };
  
  
  const submitReview=async(e:React.FormEvent<HTMLFormElement>)=>{
     e.preventDefault();
     reviewCloesdHandler()

     const reviewData={
      comment:reviewComment,
      rating,
     };
    
    const res=await newReview({comment:reviewData.comment,rating:reviewData.rating,userId:user?._id!,productId:data?.product._id!})

responseToast(res,null,"")
     setRating(0);
     setReviewComment("")
  }

  const deleteHandler=async(reviewId:string)=>{
    const res=await deleteReview({userId:user?._id!,reviewId})
      responseToast(res,null,"")
  }


  return (
    <div  className={`productDetails ${dark ? 'dark' : ''}`}>
      {isLoading ? (
        <ProductLoader />
      ) : (
        <>
          <main>
            <section>
              <Slider
                showThumbnails
                objectFit="contain"
                showNav={false}
                onClick={() => setCarousalOpen(true)}
                images={data?.product.photos.map((i) => i.url) || []}
                
              />
              {carousalOpen && (
                <MyntraCarousel
                  NextButton={NextButton}
                  PrevButton={PrevButton}
                  setIsOpen={setCarousalOpen}
                  images={data?.product.photos.map((i) => i.url) || []}
                />
              )}
            </section>
            <section>
            <code>{data?.product.category}</code>
              <h1>{data?.product.name}</h1>
              <h3> ₹{data?.product.price}</h3>
              <em style={{display:"flex",gap:"1rem",alignItems:"center",margin:".5rem 0"}}>
              <Rating value={data?.product.rating || 0} />
              ({data?.product.numOfReviews} reviews)
              </em>
              <article>
                <div>
                  <button className="Qantitybutton " onClick={decrement} disabled={MinsActive}>
                    -
                  </button>
                  <span>{quantity}</span>
                  <button className="Qantitybutton " onClick={increment} disabled={PlusActive}>
                    +
                  </button>
                </div>

                <button
                  className={`${dark?"AddtoCartBtnDark":"AddtoCartBtn"}`}
                  onClick={() => addCartHandler({
                       productId:data?.product?._id!,
                       name:data?.product?.name!,
                       stock:data?.product?.stock!,
                       price:data?.product?.price!,
                       quantity:quantity,
                       photos:data?.product.photos[0].url!
                       
                  })}
                >
                  ADD to Cart
                </button>
              </article>
            <div>
            <p> <strong>Band</strong><span>{data?.product.brand}</span></p>
             <p> <strong>Cpu Model</strong><span>{data?.product.cpu_model}</span></p>
              <p>  <strong>CPU Speed</strong><span>{data?.product.cpu_speed}GHZ</span></p>
              <p><strong>RAM</strong><span>{data?.product.ram}GB</span></p>
             <p> <strong>Operating System</strong><span>{data?.product.os}</span></p>
            </div>
            <strong>About this item</strong><p>{data?.product.description}</p>
            </section>
          </main>
        </>
      )}

      <dialog ref={reviewDialogRef} className="reviewDialog">
           <div>
           <h2>Write a Review</h2>
           <span onClick={()=>reviewCloesdHandler()}>X</span>
           </div>
           <form onSubmit={submitReview}>
            <textarea value={reviewComment} onChange={(e)=>setReviewComment(e.target.value)} placeholder="Review...."></textarea>
            <RatingEdit/>
            <button type="submit">Submit</button>
           </form>
      </dialog>
      
      <section >
       <article>
         <h2>Reviews</h2>
         {
          reviewsRes.isLoading ?null:
            user && (<button onClick={showDialog}>
            <FiEdit/>
           </button>
          )
         }
       </article>
        <div className="reviewContainer">
        {
          reviewsRes.isLoading?<Skeleton width="100%" length={5}/> :(
            reviewsRes.data?.reviews.map((review,idx)=>(
              
            <>
            <div className="review" key={idx}>
               <Rating value={review.rating}/>
                <p>{review.comment}</p>
               <div style={{ display:"flex",alignItems:"center",gap:".5rem",marginTop:"0.6rem"}}>
                 <img src={review.user.photo} alt="user photo"  style={{width:"2rem",height:"2rem",borderRadius:"2rem"}}/>
                 <small>{review.user.name}</small> 
               </div>
              {  user?._id===review.user._id &&
                <button onClick={()=>deleteHandler(review._id)}>
                <FaTrash/>
                </button>}
             </div>
            </>
            ))
          )
        }
        </div>
      </section>
      <h1>Related Products</h1>
      <section className="relatedProduct">

     
        
           {searchLoading? (
            <>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ height: "25rem" }}>
                  <Skeleton width="18.75rem" length={1} height="20rem" />
                  <Skeleton width="18.75rem" length={2} height="1.95rem" />
                </div>
              ))}
            </>
          ):
            newSearchData!.map((i,idx)=>(
                  <ProductCard
                  key={idx}
                  userId={user?._id!}
                  productId={i._id}
                  name={i.name}
                   price={i.price} 
                  stock={i.stock} 
                  photos={i.photos} 
                  handler={addCartHandler} 
                  wishHandler={addWishHandler}
              />
            ))
          }
        
      </section>
    </div>
      
  );

};


const ProductLoader = () => {
  return (
    <div style={{ display: "flex", gap: "2rem", height: "100vh" }}>
      <section style={{ width: "100%" }}>
        <Skeleton height="100%" containerHeight="80%" width="100%" length={1} />
      </section>
      <section
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
          padding: "2rem",
        }}
      >
        <Skeleton height="30px" width="100%" length={3} />
        <Skeleton height="30px" width="100%" length={5} />
      </section>
    </div>
  );
};

const NextButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="sliderArrow">
    <FaArrowRightLong />
  </button>
);
const PrevButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="sliderArrow">
    <FaArrowLeftLong />
  </button>
);

export default ProductDetails;
