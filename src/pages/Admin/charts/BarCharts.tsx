import { useSelector } from "react-redux"
import AdminSideBar from "../../../components/Admin/AdminSideBar"
import ChartComponent from "../../../components/Admin/Charts"
import { UserReducerInitialState } from "../../../types/reducers-types"
import { useBarQuery } from "../../../redux/api/dashboardAPI"
import { CustomError } from "../../../types/api-types"
import toast from "react-hot-toast"
import { Skeleton } from "../../../components/Loader"
import { getLastMonths } from "../../../utils/features"

const{last6Months,last12Months}=getLastMonths();

const BarCharts = () => {
  
  const{user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
   const {isLoading,data,isError,error}=useBarQuery(user?._id!)
   
   const products=data?.charts.products||[];
   const orders=data?.charts.orders||[];
   const users=data?.charts.users||[];
   
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
           <ChartComponent
            data_1={products} 
           data_2={users}
           labels={last6Months}
            title_1="products" title_2="users" bgColor_1={`hsl(260,50%,30%)`} bgColor_2={`hsl(360,90%,90%)`}/>
            <h2>Top selling products & top customers</h2>
          </section>
          <section>
           <ChartComponent
           horizontal={true}
            data_1={orders} 
            data_2={[]}
            title_1="products" title_2="users" bgColor_1={`hsl(180,40%,50%)`} bgColor_2={""}
            labels={last12Months}
            />
            <h2>Orders throughout the year</h2>
          </section>
          </>
         }
      </main>
    </div>
  )
}

export default BarCharts
