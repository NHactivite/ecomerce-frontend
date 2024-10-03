import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { AllProductResponse, CategoriesResponse, deleteProductRequest, MeassegeRespone, newProductRequest, ProductResponse, SearchProductRequest, SearchProductResponse, updateProductRequest } from "../../types/api-types";



export const productAPI=createApi({
    reducerPath:"productApi",
    baseQuery:fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/product/`}),
    tagTypes:["product"],
    endpoints:(builder)=>(
        {
            latestProducts:builder.query<AllProductResponse,string>({query:()=>"latest",providesTags:["product"]}),

            AllProducts:builder.query<AllProductResponse,string>({query:(id)=>`admin-products?id=${id}`,providesTags:["product"]}),

            categoroes:builder.query<CategoriesResponse,string>({query:()=>`categories`,providesTags:["product"]}),

           SearchProducts:builder.query<SearchProductResponse,SearchProductRequest>({
            query:({price,page,search,sort,category}) => {

              {
                    let base=`all?search=${search}&page=${page}`;
                     if(price) base +=`&price=${price}`;
                     if(sort) base +=`&sort=${sort}`;
                     if(category) base +=`&category=${category}`;

                    return base;
              }
            },providesTags:["product"]}),

            productDetails:builder.query<ProductResponse,string>({
                query:(id)=>id,
                providesTags:["product"]
             }),
             
            newProduct:builder.mutation<MeassegeRespone,newProductRequest>({query:({formData,id})=>({
                url:`new?id=${id}`,
                method:"POST",
                body:formData
            }),
            invalidatesTags:["product"]
                   }),


          updateProduct:builder.mutation<MeassegeRespone,updateProductRequest>({query:({formData,userId,productId})=>({
            url:`${productId}?id=${userId}`,
             method:"PUT",
             body:formData
         }),
         invalidatesTags:["product"]
                 }),

          deleteProduct:builder.mutation<MeassegeRespone,deleteProductRequest>({query:({userId,productId})=>({
            url:`${productId}?id=${userId}`,
             method:"DELETE",
         }),
         invalidatesTags:["product"]
                 }),

        }),
  });

   export const {useLatestProductsQuery,useAllProductsQuery,useCategoroesQuery,useSearchProductsQuery,useNewProductMutation,useProductDetailsQuery,useDeleteProductMutation,useUpdateProductMutation}=productAPI