import React, { FormEvent, useState } from "react";
import AdminSideBar from "../../../components/Admin/AdminSideBar"
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducers-types";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import { responseToast } from "../../../utils/features";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";



const NewProduct = () => {
  
  const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)

  const [name,setName]=useState<string>("");
  const [price,setPrice]=useState<number>();
  const [stock,setStock]=useState<number>();
  const [category,setCategory]=useState<string>("");
  const [photo,setPhoto]=useState<File>();
  const [prevPhoto,setPrevPhoto]=useState<string>("");

const [newProduct]=useNewProductMutation();

const navigate=useNavigate()

const changeImgHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file:File|undefined=e.target.files?.[0];
    const reader:FileReader=new FileReader();
    if(file){
      reader.readAsDataURL(file);
      reader.onloadend=()=>{
        if(typeof reader.result==="string")  
         { 

           setPrevPhoto(reader.result)
           setPhoto(file)

         }
      }
    }
}

const submitHandler=async(e:FormEvent<HTMLFormElement>)=>{
   e.preventDefault();
   
   if(!name||!price||!stock||!photo||!category) return toast.error("Please enter all fields");
    
   const formData=new FormData()

   formData.set("name",name);
   formData.set("price",price.toString());
   formData.set("stock",stock.toString());
   formData.set("photo",photo);
   formData.set("category",category);

   const res=await newProduct({id:user?._id!,formData});

   responseToast(res,navigate,"/admin/product")
}

  return (
    <div className="adminContainer">
    <AdminSideBar/>
    <main className="productManagement">
    <article>
           <form  onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label >Name</label>
              <input required type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}/>
            </div>
            <div>
              <label >Price</label>
              <input required type="number" placeholder="Price" min={"0"} value={price===0?" ":price} onChange={(e)=>setPrice(Number(e.target.value))}/>
            </div>
            <div>
              <label >Stock</label>
              <input required type="number" placeholder="Stock" min={"0"} value={stock===0?" ":stock} onChange={(e)=>setStock(Number(e.target.value))}/>
            </div>
            <div>
              <label >Category</label>
              <input required type="text" placeholder="Category" value={category} onChange={(e)=>setCategory(e.target.value)}/>
            </div>
            <div>
              <label >Photo</label>
              <input required type="file"  onChange={changeImgHandler}/>
            </div>
            {
              prevPhoto && <img src={prevPhoto} alt="New Image"/>
            }
            <button type="submit">Create</button>
           </form>
         </article>
      </main>
    </div>
  )
}

export default NewProduct
