import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { categories } from "../../../assets/Admin/data.json"
import AdminSideBar from "../../../components/Admin/AdminSideBar"
import { DoughnutChart, PieChart } from "../../../components/Admin/Charts"
import { Skeleton } from "../../../components/Loader"
import { usePieQuery } from "../../../redux/api/dashboardAPI"
import { UserReducerInitialState } from "../../../types/reducers-types"
const PieCharts = () => {

  const{user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
   const {isLoading,data,isError}=usePieQuery(user?._id!)
   const order=data?.charts.orderFullfillment!
   const category=data?.charts.allCategoriesAndStock!
   const stock=data?.charts.stockAvailibility!
   const revenue=data?.charts.revenueDistribution!
   const ageGroup=data?.charts.usersAgeGroup!
   const adminCustomer=data?.charts.totalUsers!


   if(isError){
    toast.error("someting wrong");
    return <Navigate to={"/admin/dashboard"}/>
   }


  return (
    <div className="adminContainer">
      <AdminSideBar/>
      <main className="chart-container">
          <h1 className="pieHeading">Pie & Doughnut Charts</h1>
          {isLoading?<Skeleton/>:
          <>
          <section>
            <div className="pie">
              <PieChart labels={["Processing","Shipped","Delivered"]} data={[order.processing,order.shipped,order.delivered]}
               bgColor={[`hsl(110,80%,80%)`,`hsl(110,80%,50%)`,`hsl(110,40%,50%)`]}
               offset={[0,0,50]}
               />
            </div>
            <h2>Oder fullfillment Ratio</h2>
          </section>

          <section>
            <div>
              <DoughnutChart labels={category.map((i)=>Object.keys(i)[0])||[]} data={category.map((i)=>Object.values(i)[0])}
               bgColor={categories.map((i)=>`hsl(${i.value*4},${i.value}%,50%)`)}
               offset={[0,0,0,40]}
               legends={false}
               />
            </div>
            <h2>Product Categories Ratio</h2>
          </section>

          <section>
            <div>
              <DoughnutChart labels={["In Stock","Out Of Stock"]} data={[stock.inStock,stock.outofStock]}
               bgColor={["hsl(269,80%,40%)","rgba(53,162,255)"]}
               offset={[0,0,0,40]}
               cutout={"70%"}
               />
            </div>
            <h2> Stock Avalibility </h2>
          </section>

          <section>
            <div>
              <DoughnutChart labels={["Marketing Cost","Discount","Burnt","Production Cost","Net Margin"]} data={[revenue.marketingCost,revenue.discount,revenue.marketingCost,revenue.burnt,revenue.productionCost,revenue.netMargin]||[]}
               bgColor={["hsl(269,80%,40%)","rgba(53,162,255)","hsl(249,10%,40%)","rgba(123,162,255)","hsl(369,80%,20%)"]}
               offset={[9,10,8,2]}
               legends={false}
               />
            </div>
            <h2>Revenue Distribution</h2>
          </section>

          <section>
            <div>
              <PieChart labels={["Teenager(Below 20)","Adult(20-40)","Older(above 40)"]} data={[ageGroup.teen,ageGroup.adult,ageGroup.old]||[]}
               bgColor={[`hsl(110,80%,80%)`,`hsl(110,80%,50%)`,`hsl(110,40%,50%)`]}
               offset={[0,0,50]}
               />
            </div>
            <h2>Users Age Ratio</h2>
          </section>

          
          <section>
            <div>
              <DoughnutChart labels={["Admin","customers"]} data={[adminCustomer.admin,adminCustomer.customers]}
               bgColor={["hsl(249,10%,40%)","rgba(123,162,255)"]}
               offset={[0,60,0,0]}
               />
            </div>
            <h2>Total User Ratio</h2>
          </section>
          </>
          }
      </main>
    </div>
  )
}

export default PieCharts
