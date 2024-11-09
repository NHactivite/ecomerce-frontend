
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from '../components/Loader';
import WishItems from '../components/wishItems';
import { useGetWishListQuery, useNewWishMutation } from '../redux/api/productAPI';
import { addToCart } from '../redux/reducer/cartReducer';
import { newWishRequest } from '../types/api-types';
import { darkReducerInitialState, UserReducerInitialState } from '../types/reducers-types';
import { CartItem } from '../types/types';
import { responseToast } from '../utils/features';
import { useEffect } from 'react';


const WishListItems= () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const dispatch=useDispatch()
  const [addWish]=useNewWishMutation()
    const { user } = useSelector(
      (state: { userReducer: UserReducerInitialState }) => state.userReducer
    );
   const {data,refetch,isLoading}=useGetWishListQuery(user?._id!)
   
   useEffect(() => {
    refetch();
  }, [refetch]);
   
    const removeHandler=async(newWishRequest:newWishRequest)=>{
      const res = await addWish(newWishRequest);
      responseToast(res,null,"");
      refetch() 
   }

   const {dark}=useSelector((state:{darkReducer:darkReducerInitialState})=>state.darkReducer)

   const addCartHandler=(cartItem:CartItem)=>{
    if(cartItem.stock < 1) return toast.error("out Of Stock");
    dispatch(addToCart(cartItem))
    toast.success("Added to Cart")
 }
  return (
    <div className={`wishContainer ${dark ? 'dark' : ''}`}>
       <main>
       { isLoading?<Skeleton/>:(
        data?.wish.length!>0?( data?.wish?.map((i,idx)=>(
          //  <CartItems key={idx} cartItem={i} removeHandler={()=>{}}/>
          <WishItems key={idx}  productID={i.Product} removeHandler={removeHandler} handler={addCartHandler} userID={user?._id!} />
        ))): (<h1>No Items Add</h1>)
      )}
      </main>
    </div>
  )
}

export default WishListItems
