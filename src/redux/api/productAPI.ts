import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { AllProductResponse, AllReviewsResponse, BrandsResponse, CategoriesResponse, deleteProductRequest, deleteReviewRequest, MeassegeRespone, newProductRequest, newReviewRequest, newWishRequest, ProductResponse, SearchProductRequest, SearchProductResponse, updateProductRequest, WishResponse } from "../../types/api-types";



export const productAPI=createApi({
    reducerPath:"productApi",
    baseQuery:fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/product/`}),
    tagTypes:["product"],
    endpoints:(builder)=>(
        {
            latestProducts:builder.query<AllProductResponse,string>({query:()=>"latest",providesTags:["product"]}),

            AllProducts:builder.query<AllProductResponse,string>({query:(id)=>`admin-products?id=${id}`,providesTags:["product"]}),
          
            categoroes:builder.query<CategoriesResponse,string>({query:()=>`categories`,providesTags:["product"]
            }),
            brands:builder.query<BrandsResponse,string>({query:()=>`brands`,providesTags:["product"]}),

            getWishList:builder.query<WishResponse,string>({query:(userId)=>`wish?id=${userId}`,providesTags:["product"]}),
            
            productReview:builder.query<AllReviewsResponse,string>({
              query:(productId)=>`/reviews/${productId}`,
              providesTags:["product"]
            }),
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

          newReview:builder.mutation<MeassegeRespone,newReviewRequest>({query:({comment,rating,productId,userId})=>({
            url:`review/new/${productId}?id=${userId}`,
             method:"POST",
             body:{
              comment,
              rating
             }
         }),
         invalidatesTags:["product"]
                 }),
          newWish:builder.mutation<MeassegeRespone,newWishRequest>({query:({productId,userId})=>({
               url:`wish/new/${productId}?id=${userId}`,
               method:"POST",
          })}),
          deleteReview:builder.mutation<MeassegeRespone,deleteReviewRequest>({query:({reviewId,userId})=>({
            url:`review/${reviewId}?id=${userId}`,
             method:"DELETE",
         }),
         invalidatesTags:["product"]
                 }),
       
        }),
  });

   export const {useGetWishListQuery,useNewWishMutation,useBrandsQuery,useLatestProductsQuery,useAllProductsQuery,useCategoroesQuery,useSearchProductsQuery,useNewProductMutation,useProductDetailsQuery,useDeleteProductMutation,useUpdateProductMutation,useProductReviewQuery,useNewReviewMutation,useDeleteReviewMutation}=productAPI