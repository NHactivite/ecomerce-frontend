import { useFileHandler } from "6pp";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSideBar from "../../../components/Admin/AdminSideBar";
import { Skeleton } from "../../../components/Loader";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../redux/api/productAPI";
import { UserReducerInitialState } from "../../../types/reducers-types";
import { responseToast } from "../../../utils/features";

const ProductManagement= () => {

  const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
  const [btnLoading,setBtnLoading]=useState(false)
  const params=useParams();
  const navigate=useNavigate()

  const {data,isLoading,isError}=useProductDetailsQuery(params.id!)

  const {photos,price,stock,name,category, description,brand,os,cpu_model,cpu_speed,ram}=data?.product || {
    photos:[],
    category:"",
    name:"",
    price:"",
    stock:"",
    description:"",
    brand:"",
    os:"",
    cpu_model:"",
    cpu_speed:"",
    ram:""
  };

  const [nameUpdate,setNameUpdate]=useState<string>(name);
  const [priceUpdate,setPriceUpdate]=useState<number|string>(price);
  const [stockUpdate,setStockUpdate]=useState<number|string>(stock);
  const [categoryUpdate,setCategoryUpdate]=useState<string>(category);
  const [descriptionUpdate,setDescription]=useState<string>(description);
  const [brandUpdate,setBrand]=useState<string>(brand);
  const [osUpdate,setOs]=useState<string>(os);
  const [ramUpdate,setRam]=useState<number>(Number(ram));
  const [cpu_modelUpdate,setCpuModel]=useState<string>(cpu_model);
  const [cpu_speedUpdate,setCpuSpeed]=useState<string>(cpu_speed);

const [updateProduct]=useUpdateProductMutation();
const [deleteProduct]=useDeleteProductMutation();
const photosfile=useFileHandler("multiple",10,5);
useEffect(()=>{
              
  if(data){
    setNameUpdate(data.product.name);
    setPriceUpdate(data.product.price); 
    setStockUpdate(data.product.stock);
    setCategoryUpdate(data.product.category);
    setDescription(data.product.description);
    setBrand(data.product.brand);
    setRam(data.product.ram);
    setCpuModel(data.product.cpu_model);
    setCpuSpeed(data.product.cpu_speed);
    setOs(data.product.os);
  }
  
  },[data])
  
const submitHandler=async(e:FormEvent<HTMLFormElement>)=>{
 try {
  e.preventDefault();
  setBtnLoading(true)
  const formData=new FormData();
  if(nameUpdate) formData.set("name",nameUpdate)
  if(descriptionUpdate) formData.set("description",descriptionUpdate)
  if(priceUpdate) formData.set("price",priceUpdate.toString())
  if(stockUpdate !== undefined) formData.set("stock",stockUpdate.toString())
  if(categoryUpdate) formData.set("category",categoryUpdate)
  if(brandUpdate)formData.set("brand",brandUpdate);
  if(ramUpdate)formData.set("ram",ramUpdate!.toString());
  if(osUpdate)formData.set("os",osUpdate);
  if(cpu_modelUpdate)formData.set("cpu_model",cpu_modelUpdate);
  if(cpu_speedUpdate)formData.set("cpu_speed",cpu_speedUpdate!.toString());
  // new photo
  if(photosfile.file && photosfile.file.length > 0) {
    photosfile.file.forEach((file)=>{
      formData.append("photos",file)
    })
  }
  const res=await updateProduct({formData,userId:user?._id!,productId:data?.product._id!})

    responseToast(res,navigate,"/admin/product")
 } catch (error) {
  toast.error("something wrong in server")
 }
 finally{
  setBtnLoading(false)
 }
}

const deleteHandler=async()=>{
  
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
           <img src={photos[0]?.url} alt="product img" />
           <p>{name}</p>
           {
            Number(stock)>0?(
              <span className="green">{stock} Available</span>
            ):<span className="red">Not Available</span>
           }
           <h3>${price}</h3>
      </section>


    <article>
      <button className="backBtn" onClick={deleteHandler}>
        <FaTrash/>
      </button>
           <form onSubmit={submitHandler}>
            <h2>Manage</h2>
            <div>
              <label >Name</label>
              <input required type="text" placeholder="Name" value={nameUpdate} onChange={(e)=>setNameUpdate(e.target.value)}/>
            </div>
            <div>
              <label >Description</label>
              <textarea required placeholder="Description" value={descriptionUpdate} onChange={(e)=>setDescription(e.target.value) }/>
            </div>
            <div>
              <label >Price</label>
              <input required type="text" placeholder="Price" min={"0"} value={priceUpdate=== 0? "": priceUpdate} onChange={(e)=>setPriceUpdate(Number(e.target.value))}/>
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
              <label >Brand</label>
              <input required type="text" placeholder="Brand" value={brandUpdate} onChange={(e)=>setBrand(e.target.value)}/>
            </div>
            <div>
              <label >RAM</label>
              <input required type="text" placeholder="RAM only Give Size (ex:- 4GB then fill only 4)" value={ramUpdate===0?"":ramUpdate} onChange={(e)=>setRam(Number(e.target.value))}/>
            </div>
            <div>
              <label >Operating System</label>
              <input required type="text" placeholder="Operating System" value={osUpdate} onChange={(e)=>setOs(e.target.value)}/>
            </div>
            <div>
              <label >CPU Model</label>
              <input required type="text" placeholder="CPU Model" value={cpu_modelUpdate} onChange={(e)=>setCpuModel(e.target.value)}/>
            </div>
            <div>
              <label >CPU Speed</label>
              <input required type="text" placeholder="CPU Speed only Give Value (ex:- 2.5GHZ then fill only 2.5)" value={cpu_speedUpdate} onChange={(e)=>setCpuSpeed(e.target.value)}/>
            </div>
            <div>
              <label >Photos</label>
              <input type="file" accept="image/*" multiple onChange={photosfile.changeHandler}/>
            </div>
            {
              photosfile.error && <p>{photosfile.error}</p>
            }
             {
              photosfile.preview && 
              (
               <div style={{display:"flex",gap:"1rem", overflowX:"auto"}}  >
                 {
                   photos.map((img,i)=>(
                    <img key={i} src={img.url} alt="New Image" style={{width:100,height:60,objectFit:"contain"}} />
                   ))
                 }
               </div>
              )
            }
             
            <button disabled={btnLoading} type="submit" >Update</button>
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
