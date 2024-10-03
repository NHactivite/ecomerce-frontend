
export type OrderItemType={
     name:string,
     photo:string,
     price:number,
     quantity:number,
     _id:string
}

export type OrderType={
     name:string,
     address:string,
     city:string,
     state:string,
     country:string,
     pinCode:number,
     status:"processing"|"shipped"|"delivered",
     subtotal:number,
     discount:number,
     shippingCharge:number,
     tax:number,
     total:number,
     oderItems:OrderItemType[],
     _id:string
}