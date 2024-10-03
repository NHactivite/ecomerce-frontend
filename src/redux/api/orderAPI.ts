import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { AllOrdersResponse, MeassegeRespone, NewOrderRequest, OrderDetailsResponse, UpdateOrderRequest } from "../../types/api-types";

export const orderApi=createApi({
    reducerPath:"orderApi",
    baseQuery:fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/order/`}),
    tagTypes:["orders"],
    endpoints:(builder)=>({
          
        newOrder:builder.mutation<MeassegeRespone,NewOrderRequest>({
            query:(order)=>({url:"new",method:"POST",body:order}),
            invalidatesTags:["orders"]
        }),
        updateOrder:builder.mutation<MeassegeRespone,UpdateOrderRequest>({
            query:({userId,orderId})=>({url:`${orderId}?id=${userId}`,method:"PUT"}),
            invalidatesTags:["orders"]
        }),
        deleteOrder:builder.mutation<MeassegeRespone,UpdateOrderRequest>({
            query:({userId,orderId})=>({url:`${orderId}?id=${userId}`,method:"DELETE"}),
            invalidatesTags:["orders"]
        }),
        myOrders:builder.query<AllOrdersResponse,string>({
            query:(id)=>`my?id=${id}`,
            providesTags:["orders"]
        }),
        allOrders:builder.query<AllOrdersResponse,string>({
            query:(id)=>`all?id=${id}`,
            providesTags:["orders"]
        }),
        orderDetalis:builder.query<OrderDetailsResponse,string>({
            query:(id)=>id,
            providesTags:["orders"]
        }),
    })
});


export const {useNewOrderMutation,useUpdateOrderMutation,useDeleteOrderMutation,useMyOrdersQuery,useAllOrdersQuery,useOrderDetalisQuery}=orderApi