import { useFileHandler } from "6pp";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "../../../components/Admin/AdminSideBar";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import { UserReducerInitialState } from "../../../types/reducers-types";
import { responseToast } from "../../../utils/features";



const NewProduct = () => {
  
  const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
  const [isLoading,setIsLoading]=useState(false)
  const [name,setName]=useState<string>("");
  const [price,setPrice]=useState<number>();
  const [stock,setStock]=useState<number>();
  const [category,setCategory]=useState<string>("");
  const [description,setDescription]=useState<string>("");
  const [brand,setBrand]=useState<string>("");
  const [os,setOs]=useState<string>("");
  const [ram,setRam]=useState<number>();
  const [cpu_model,setCpuModel]=useState<string>("");
  const [cpu_speed,setCpuSpeed]=useState<string>("");

const [newProduct]=useNewProductMutation();

const navigate=useNavigate()

const photos=useFileHandler("multiple",10,5);


const submitHandler=async(e:FormEvent<HTMLFormElement>)=>{
   try {
    e.preventDefault();
    setIsLoading(true)
    if(!name||!price||!stock||!category || !description||!photos.file || photos.file.length===0) return toast.error("Please enter all fields");
     
    const formData=new FormData()
 
    formData.set("name",name);
    formData.set("description",description);
    formData.set("price",price.toString());
    formData.set("stock",stock.toString());
   //  formData.set("photo",photo);
    formData.set("category",category);
    formData.set("brand",brand);
    formData.set("ram",ram!.toString());
    formData.set("os",os);
    formData.set("cpu_model",cpu_model);
    formData.set("cpu_speed",cpu_speed);
 
    photos.file.forEach((file)=>{
     formData.append("photos",file)
    })
    const res=await newProduct({id:user?._id!,formData});
 
    responseToast(res,navigate,"/admin/product")
   } catch (error) {
        toast.error("something wrong in server")
   }
   finally{
    setIsLoading(false)
   }
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
              <label >Description</label>
              <textarea required placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)}/>
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
              <label >Brand</label>
              <input required type="text" placeholder="Brand Name" value={brand} onChange={(e)=>setBrand(e.target.value)}/>
            </div>
            <div>
              <label >RAM</label>
              <input required type="number" placeholder="RAM only Give Size (ex:- 4GB then fill only 4)" value={ram===0?"":ram} onChange={(e)=>setRam(Number(e.target.value))}/>
            </div>
            <div>
              <label >Operating System</label>
              <input required type="text" placeholder="Operating System" value={os} onChange={(e)=>setOs(e.target.value)}/>
            </div>
            <div>
              <label >CPU Model</label>
              <input required type="text" placeholder="CPU Model" value={cpu_model} onChange={(e)=>setCpuModel(e.target.value)}/>
            </div>
            <div>
              <label >CPU Speed</label>
              <input required type="text" placeholder="CPU Speed only Give Value (ex:- 2.5GHZ then fill only 2.5)" value={cpu_speed} onChange={(e)=>setCpuSpeed(e.target.value)}/>
            </div>
            <div>
              <label >photos</label>
              <input required accept="image/*" type="file" multiple  onChange={photos.changeHandler}/>
            </div>
            {
              photos.error && <p>{photos.error}</p>
            }
            {
              photos.preview && photos.preview.map((img,i)=>(
                 <img key={i} src={img} alt="New Image"/>
            ))
            }
            <button type="submit" disabled={isLoading}>Create</button>
           </form>
         </article>
      </main>
    </div>
  )
}

export default NewProduct
