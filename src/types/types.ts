export type User = {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  dob: string;
  _id: string;
};
export type Product = {
  name: string;
  category: string;
  photos:{
    public_id:string,
    url:string
  }[];
  price: number;
  stock: number;
  _id: string;
  description:string;
  rating:number;
  numOfReviews:number;
  brand:string;
 os:string;
 ram:number;
 cpu_model:string;
 cpu_speed:string;
};
export type Reviews = {
  comment:string;
  productId:string
  user:{
    name:string,
    photo:string
    _id:string
  }
  _id: string;
  rating:number;
  numOfReviews:number
};
export type WishProduct={
   wish:boolean;
   user:string;
   Product:string;
}

export type ShippingInfo = {
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
};

export type CartItem = {
  productId: string;
  photos:string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

export type OrderItem = Omit<CartItem, "stock"> & { _id: string };

export type Order = {
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  shippingCharges: number;
  total: number;
  discount: number;
  status: string;
  _id: string;
  userId: string;
};

type CountAndChange={
   revenue:number;
   product:number;
   user:number;
   order:number
}

type LatestTransaction={
    _id:string;
    total:number;
    discount:number;
    quantity:number;
    status:string;
}

export type Stats = {
  userRatio:{"male": 1,
            "female": 0},
  allCategoriesAndStock:Record<string, number>[],
  Changepercent:CountAndChange,
  count:CountAndChange,
  chart: {
    orderMonthCount:number[],
    monthRevenueCount:number[]
  },
  modifiedTransaction:LatestTransaction[]
}


export type Pie = {
    orderFullfillment: {
      processing: number;
      shipped: number;
      delivered: number;
  },
    allCategoriesAndStock: Record<string, number>[],
    stockAvailibility: {
      inStock: number;
      outofStock: number;
  },
    revenueDistribution: {
      netMargin: number;
      discount: number;
      productionCost: number;
      burnt: number;
      marketingCost: number;
  },
    usersAgeGroup: {
      teen: number;
      adult: number;
      old: number;
  },
    totalUsers: {
      admin: number;
      customers: number;
  }
    }



export type Bar={
  users:number[],
  products:number[],
  orders:number[]
}

export type Line={
      users:number[],
      products:number[],
      disCount:number[],
      revenue:number[]
}

export type CouponType={
      _id:string,
      code:string,
      amount:number,
      
}

