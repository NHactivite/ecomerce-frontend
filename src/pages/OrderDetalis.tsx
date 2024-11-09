import { Navigate, useParams } from 'react-router-dom'
import { Skeleton } from '../components/Loader'
import { useOrderDetalisQuery } from '../redux/api/orderAPI'
import { server } from '../redux/store'
import { OrderItemType } from '../types'
import { Order } from '../types/types'

const defaultData:Order={
    shippingInfo:{
      address:"",
        city:"",
        state:"",
        country:"",
        pinCode:"",
    },
        status:"",
       subtotal:0,
       discount:0,
       shippingCharges:0,
       total:0,
       orderItems:[],
       userId:"",
       _id:""
  }

const OrderDetalis = () => {
    const params=useParams()
    const {isLoading,data,isError}=useOrderDetalisQuery(params.id!);

    const {shippingInfo:{address,city,country,state,pinCode},orderItems,status,discount,total,shippingCharges,subtotal}=data?.order || defaultData;
   
    
    if (isError) return (
       <Navigate to={"/404"}/>
    );
  return (
    <div className="orderDetalisContainer">
    <main className="productManagement">
          
              {
                isLoading?<Skeleton/> :<>
                    <section style={{
                padding:"2rem",
               }}>
                 <h2>Order Items</h2>
                    {
                      orderItems.map((i)=>(
                        <ProductCard key={i._id} name={i.name} photo={i.photos} price={i.price} quantity={i.quantity} _id={i._id}/>
                      ))
                    }
               </section>
               <article >
                <h1>Oder Info </h1>
                <h5>User Info</h5>
                <p>Address : {`${address}, ${city}, ${state}, ${country} ${pinCode}`}</p>
                <p>Amount Info </p>
                <p>Subtotal : {subtotal}</p>
                <p>ShippingCharges : {shippingCharges}</p>
                <p>Discount : {discount}</p>
                <p>Total : {total}</p>
                <p> Status:{" "} 
                   <span className={status==="delivered"?"purple":status==="shipped"?"red":"green"}>{status}</span>
                </p>
               </article>
                </>
              }
      </main>
    </div>
  )
}
const ProductCard=({name,photo,price,quantity}:OrderItemType)=>(
    <div className="transactionProductCard">
      <img src={photo} alt={name} /> 
      {/* <Link to={`/product/${_id}`}>{name}</Link> */}
      <span>$ {price} X {quantity} = $ {price*quantity}</span>
    </div>
  )

export default OrderDetalis
