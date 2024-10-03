import {  useEffect, useState } from "react"
import ProductCard from "./ProductCard";
import { useCategoroesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";
import { HiMenuAlt4 } from "react-icons/hi";


const Search = () => {
  // ---------------for mobile---------
  const [showModel,setModel]=useState<boolean>(false);
  const[phoneActive,setPhonActive]=useState<boolean>(window.innerWidth < 1100);
  const resetHandler=()=>{
    setPhonActive(window.innerWidth < 1100);
  }
  useEffect(()=>{
    window.addEventListener("resize",resetHandler);
    return()=>{
      window.removeEventListener("resize",resetHandler)
    }
  },[])


// ---------------------------------------------

   const dispatch=useDispatch();
  const {data:categoriesResponse,isLoading,isError:categoriesError,error:categoriesErrorData}=useCategoroesQuery("")

  const [search,setsearch]=useState<string>("");
  const [maxPrice,setMaxPrice]=useState<number>(10000);
  const [sort,setSort]=useState<string>("");
  const [category,setCategory]=useState<string>("");
  const [page,setPage]=useState<number>(1);

  const {data:searchData,isLoading:searchLoading,isError:searchError,error:searchErrorData}=useSearchProductsQuery({search,sort,price:maxPrice,page,category})
   
  const addCartHandler=(cartItem:CartItem)=>{
    if(cartItem.stock < 1) return toast.error("out Of Stock");
    dispatch(addToCart(cartItem))
    toast.success("Added to Cart")
 }
 const isNextPage=page < 5;
 const isPrevPage=page > 1;
 

 if (categoriesError) toast.error((categoriesErrorData as CustomError).data.message);
 if (searchError) toast.error((searchErrorData as CustomError).data.message);


  return (
    <div className="productSearchPage">

          {/* moblile */}
<>
   {phoneActive && <button id="hamBurger" onClick={()=>setModel(true)}><HiMenuAlt4/></button>}
    <aside style={phoneActive ?
    {
      width:"20rem",
      height:"70vh",
      position:"fixed",
      top:60,
      left:showModel?"0":"-20rem",
      transition:"all 0.5s",
       
    }:{}}>
     <aside>
         <h2>Filters</h2>
         <div>
           <h4>Sorts</h4>
           <select value={sort} onChange={(e)=>setSort(e.target.value)}>
              <option value="">None</option>
              <option value="asc">Price(Low to High)</option>
              <option value="dsc">Price(High to Low)</option>
           </select>
         </div>
         <div>
           <h4>Max Price: {maxPrice || ""}</h4>
           <input type="range" min={50} max={10000} value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))}/>
         </div>

         <div>
           <h4>Category</h4>
           <select value={category} onChange={(e)=>setCategory(e.target.value)}>
              <option value="">All</option>
              {
                !isLoading && categoriesResponse?.categories?.map((i)=>(
                  <option key={i} value={i}>{i.toUpperCase()}</option>
                ))
              }
              
           </select>
         </div>
       </aside>
        {
    phoneActive&&<button id="closeSideBar" onClick={()=>setModel(false)}>Cloes</button>
  }
  </aside>
   </>
 {/* ---------------- */}

       <main>
         <h1>Products</h1>
         <input type="text" placeholder="Search by name...." value={search} onChange={(e)=>setsearch(e.target.value)} />
        {
          searchLoading?(<Skeleton/>):( <div className="searchProductList">
            {
             searchData?.products?.map((i)=>(
               <ProductCard key={i._id} name={i.name} price={i.price} stock={i.stock} productId={i._id} photo={i.photo} handler={addCartHandler}/>
             ))
            }
 
          </div>)
        }
       {
        searchData && searchData.totalPage >1 &&   <article>
        <button disabled={!isPrevPage} onClick={()=>setPage((prev)=>prev - 1)}>Previous</button>
        <span>{page} of {searchData.totalPage}</span>
        <button disabled={!isNextPage} onClick={()=>setPage((prev)=>prev + 1)}>Next</button>
       </article>
       }
       </main>
    </div>
  )
}

export default Search
