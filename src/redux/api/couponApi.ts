import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { AllDiscountResponse, MeassegeRespone, newCouponRequest, oneCouponRequest, oneDiscountResponse, updateCouponRequest } from "../../types/api-types";

export const couponApi=createApi({
    reducerPath:"couponApi",
    baseQuery:fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/payment/`}),
    endpoints:(builder)=>({
        coupons:builder.query<AllDiscountResponse,string>({
            query:id=>`coupon/all?id=${id}`
        }),
        oneCoupon:builder.query<oneDiscountResponse,oneCouponRequest>({query:({userId,couponId})=>({
          url:`/coupon/${couponId}?id=${userId}`,
          method:"GET"
        })
    }),
        newCoupon:builder.mutation<MeassegeRespone,newCouponRequest>({query:({Payload,_id})=>({
             url:`/coupon/new?id=${_id}`,
             method:"POST",
             body:Payload
        }) }),
        updateCoupon:builder.mutation<MeassegeRespone,updateCouponRequest>({query:({Payload,userId,couponId})=>({
            url:`/coupon/${couponId}?id=${userId}`,
             method:"PUT",
             body:Payload
         }),}),
        deleteCoupon:builder.mutation<MeassegeRespone,oneCouponRequest>({query:({userId,couponId})=>({
             url:`/coupon/${couponId}?id=${userId}`,
             method:"DELETE",
         }),})
  })
  })

export const {useCouponsQuery,useNewCouponMutation,useDeleteCouponMutation,useOneCouponQuery,useUpdateCouponMutation}=couponApi