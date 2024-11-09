import { FaShoppingBag, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useProductDetailsQuery } from '../redux/api/productAPI';
import { newWishRequest } from '../types/api-types';
import { darkReducerInitialState } from '../types/reducers-types';
import { CartItem } from '../types/types';
import { useCallback, useMemo } from 'react';

type WishItemsProps={
   userID:string,
    productID:string,
    removeHandler:(newWishRequest: newWishRequest) => Promise<void>,
    handler:(cartItem: CartItem) => string | undefined;
}

const WishItems = ({productID,removeHandler,handler,userID}:WishItemsProps) => {
  const {dark}=useSelector((state:{darkReducer:darkReducerInitialState})=>state.darkReducer)
    const {data}=useProductDetailsQuery(productID);
  
    const product=useMemo(()=>{
        return data?.product
    },[data])


    const handleWishClick = useCallback(async () => {
      const wishRequest: newWishRequest = {
        userId: userID,
        productId: productID,
      }
        await removeHandler(wishRequest);  
    },[userID,productID,removeHandler]);

    const handleAddToCart = useCallback(() => {
      if (product) {
        handler({
          photos: product.photos[0].url!,
          price: product.price!,
          productId: productID,
          quantity: 1,
          name: product.name!,
          stock: product.stock!,
        });
      }
    }, [product, productID, handler]);

  return (
    <div className={`wishItem ${dark ? 'darkHeader' : ''}`}>
         <img src={product?.photos[0].url} alt={product?.name} />
      
        <Link className={`${dark ? 'darkList' : ''}`}   to={`/product/${productID}`}>{product?.name}</Link>
        <span>&#x20B9;{product?.price}</span>
       
       <button onClick={handleWishClick} ><FaTrash/></button>
       <span onClick={handleAddToCart} className='wishToCart' ><FaShoppingBag/></span>
    </div>
  )
}

export default WishItems
