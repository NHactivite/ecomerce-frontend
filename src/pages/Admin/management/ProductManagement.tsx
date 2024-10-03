import { useState ,ChangeEvent,FormEvent, useEffect} from "react";
import AdminSideBar from "../../../components/Admin/AdminSideBar"
import { UserReducerInitialState } from "../../../types/reducers-types";
import { useSelector } from "react-redux";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../redux/api/productAPI";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { server } from "../../../redux/store";
import { Skeleton } from "../../../components/Loader";
import { responseToast } from "../../../utils/features";
import { FaTrash } from "react-icons/fa";

const ProductManagement= () => {

  const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)

  const params=useParams();
  const navigate=useNavigate()

  const {data,isLoading,isError}=useProductDetailsQuery(params.id!)

  const {photo,price,stock,name,category}=data?.product || {
    photo:"",
    category:"",
    name:"",
    price:"",
    stock:""
  };

  const [nameUpdate,setNameUpdate]=useState<string>(name);
  const [priceUpdate,setPriceUpdate]=useState<number|string>(price);
  const [stockUpdate,setStockUpdate]=useState<number|string>(stock);
  const [photoUpdate,setPhotoUpdate]=useState<string>("");
  const [photoFile,setPhotoFile]=useState<File>();
  const [categoryUpdate,setCategoryUpdate]=useState<string>(category);

const [updateProduct]=useUpdateProductMutation();
const [deleteProduct]=useDeleteProductMutation();
useEffect(()=>{
              
  if(data){
    setNameUpdate(data.product.name);
    setPriceUpdate(data.product.price); 
    setStockUpdate(data.product.stock);
    setCategoryUpdate(data.product.category);
  }
  
  },[data,photoUpdate])


const changeImgHandler=(e:ChangeEvent<HTMLInputElement>)=>{
    const file:File|undefined=e.target.files?.[0];
    const reader:FileReader=new FileReader();
    if(file){ 
      reader.readAsDataURL(file);
      reader.onloadend=()=>{
        if(typeof reader.result==="string") {
          setPhotoUpdate(reader.result)
          setPhotoFile(file);
        }
      }
    }
}
const submitHandler=async(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  const formData=new FormData();
  if(nameUpdate) formData.set("name",nameUpdate)
  if(priceUpdate) formData.set("price",priceUpdate.toString())
  if(stockUpdate !== undefined) formData.set("stock",stockUpdate.toString())
  if(photoFile) {
    formData.set("photo",photoFile)
  }
  if(categoryUpdate) formData.set("category",categoryUpdate)

    const res=await updateProduct({formData,userId:user?._id!,productId:data?.product._id!})

    responseToast(res,navigate,"/admin/product")
}

const daleteHandler=async()=>{
  
  const res=await deleteProduct({userId:user?._id!,productId:data?.product._id!})

    responseToast(res,navigate,"/admin/product")
}



if(isError) return <Navigate to={"/404"}/>

  return (
    <div className="adminContainer">
    <AdminSideBar/>
    <main className="productManagement mobile">

          {
            isLoading?<Skeleton/>:(
            <>
                
      <section>
           <strong>ID - {data?.product._id}</strong>
           <img src={`${server}/${photo}`} alt="product img" />
           <p>{name}</p>
           {
            Number(stock)>0?(
              <span className="green">{stock} Available</span>
            ):<span className="red">Not Available</span>
           }
           <h3>${price}</h3>
      </section>


    <article>
      <button className="backBtn" onClick={daleteHandler}>
        <FaTrash/>
      </button>
           <form onSubmit={submitHandler}>
            <h2>Manage</h2>
            <div>
              <label >Name</label>
              <input required type="text" placeholder="Name" value={nameUpdate} onChange={(e)=>setNameUpdate(e.target.value)}/>
            </div>
            <div>
              <label >Price</label>
              <input required type="number" placeholder="Price" min={"0"} value={priceUpdate=== 0? "": priceUpdate} onChange={(e)=>setPriceUpdate(Number(e.target.value))}/>
            </div>
            <div>
              <label >Stock</label>
              <input required type="number" placeholder="Stock" min={"0"} value={stockUpdate=== 0 ? "" : stockUpdate} onChange={(e)=>setStockUpdate(Number(e.target.value))}/>
            </div>
            <div>
              <label >Category</label>
              <input required type="string" placeholder="Category" value={categoryUpdate} onChange={(e)=>setCategoryUpdate(e.target.value)}/>
            </div>
            <div>
              <label >Photo</label>
              <input type="file"  onChange={changeImgHandler}/>
            </div>
            
            {
               photoUpdate && <img src={photoUpdate} alt="updated photo" />
            }
            <button type="submit">Update</button>
           </form>
         </article>
            </>
            )
          }

      </main>
    </div>
  )
}


export default ProductManagement
