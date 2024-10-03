import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import AdminSideBar from "../../../components/Admin/AdminSideBar";
import { LineComponent } from "../../../components/Admin/Charts";
import { Skeleton } from "../../../components/Loader";
import { useLineQuery } from "../../../redux/api/dashboardAPI";
import { CustomError } from "../../../types/api-types";
import { UserReducerInitialState } from "../../../types/reducers-types";
import { getLastMonths } from "../../../utils/features";


const{last12Months}=getLastMonths();

const LineCharts = () => {
  const{user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
   const {isLoading,data,isError,error}=useLineQuery(user?._id!)

   const users=data?.charts.users||[];
   const products=data?.charts.products||[]
   const discount=data?.charts.disCount||[]
   const revenue=data?.charts.revenue||[]
   
   if(isError){
    const err=error as CustomError;
    toast.error(err.data.message);
   }
  return (
    <div className="adminContainer">
      <AdminSideBar/>
      <main className="chart-container">
          <h1>Bar Charts</h1>
         {
          isLoading?<Skeleton/>:
          <>
           <section>
           <LineComponent
            data={users} 
            labels={last12Months}
            label="users" bgColor={`hsl(260,90%,90%)`}
            borderColor="rgb(53,162,255)"
             />
            <h2>Active users</h2>
          </section>
          <section>
           <LineComponent
            data={products} 
            labels={last12Months}
            bgColor={`hsl(260,90%,90%)`}
            borderColor="rgb(53,162,255)"
            label="product"
             />
            <h2>Total Products</h2>
          </section>
          <section>
           <LineComponent
            data={revenue} 
            labels={last12Months}
            label="Reveneu" bgColor={`hsl(260,90%,90%)`}
            borderColor="rgb(53,162,255)"
             />
            <h2>Total Revenue</h2>
          </section>
          <section>
           <LineComponent
            data={discount} 
            labels={last12Months}
            label="Discount" bgColor={`hsl(260,90%,90%)`}
            borderColor="rgb(53,162,255)"
             />
            <h2>Discount Allotted</h2>
          </section></>
         }
      </main>
    </div>
  )
}

export default LineCharts
