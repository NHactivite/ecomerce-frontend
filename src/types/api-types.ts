import { Bar, CartItem, CouponType, Line, Order, Pie, Product, Reviews, ShippingInfo, Stats, User, WishProduct } from "./types"

export type CustomError={
    status:number,
    data:{
        message:string,
        success:boolean
    }
}


export type MeassegeRespone={
    success:boolean,
    message:string
}

export type AllOrdersResponse={
    success:boolean,
    orders:Order[],
}
export type OrderDetailsResponse={
    success:boolean,
    order:Order,
}

export type AllUsersResponse={
    success:boolean,
    users:User[],
}



export type userResponse={
    success:boolean,
    user:User,
}



export type AllProductResponse={
    success:boolean,
    product:Product[],
}
export type AllReviewsResponse={
    success:boolean,
    reviews:Reviews[],
}


export type CategoriesResponse={
    success:boolean,
    categories:string[],
}
export type BrandsResponse={
    success:boolean,
    Brands:string[],
}
export type WishResponse={
    success:boolean,
    wish:WishProduct[],
}


export type SearchProductResponse= {
    success:boolean,
    products:Product[],
    totalPage:number
}
export type ProductResponse={
    success:boolean,
    product:Product,
}

export type StatsResponse={
    success:boolean,
    stats:Stats,
}
export type PieResponse={
    success:boolean,
    charts:Pie,
}
export type BarResponse={
    success:boolean,
    charts:Bar
}
export type LineResponse={
    success:boolean,
    charts:Line
}

export type SearchProductRequest={
   price?:number,
   page?:number,
   category?:string,
   search?:string,
   sort?:string,
}

export type newReviewRequest={
    rating:number,
    comment:string,
    userId:string,
    productId:string
}

export type newWishRequest={
    userId:string,
    productId:string
}
export type deleteReviewRequest={
    reviewId:string,
    userId?:string,
}

export type newProductRequest={
    id:string,
    formData:FormData;
}
export type newCouponRequest={
    _id:string,
    Payload:CouponType;
}
export type oneCouponRequest={
    userId:string,
    couponId:string
}
export type updateCouponRequest={
    userId:string,
    couponId:string
    Payload:CouponType;
}

export type updateProductRequest={
    userId:string,
    productId:string,
    formData:FormData;
}
export type deleteProductRequest={
    userId:string,
    productId:string,
   
}

export type NewOrderRequest={
    // loading:boolean;
    orderItems:CartItem[];
    subtotal:number,
    shippingCharges:number,
    total:number,
    discount:number,
    shippingInfo:ShippingInfo;
    userId:string;
}
export type UpdateOrderRequest={
   userId:string;
   orderId:string
}
export type DeleteUserRequest={
    userId:string,
    adminUserId:string,
}
export type AllDiscountResponse={
    success:boolean,
    coupons:CouponType[]
}  
export type oneDiscountResponse={
    success:boolean,
    coupon:CouponType
}  
