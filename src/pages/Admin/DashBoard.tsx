import toast from "react-hot-toast"
import { BiMaleFemale } from "react-icons/bi"
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import AdminSideBar from "../../components/Admin/AdminSideBar"
import ChartComponent, { DoughnutChart } from "../../components/Admin/Charts"
import DashBoardTable from "../../components/Admin/DashBoardTable"
import { Skeleton } from "../../components/Loader"
import { useStatsQuery } from "../../redux/api/dashboardAPI"
import { UserReducerInitialState } from "../../types/reducers-types"
const DashBoard = () => {
   const{user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
   const {isLoading,data,isError}=useStatsQuery(user?._id!)
    
   const stats=data?.stats!;
  
  
   if(isError){
    toast.error("someting wrong");
    return <Navigate to={"/"}/>
   }
  return (
    <div className="adminContainer">
      <AdminSideBar/>
      <main className="dashboard">
       {
        isLoading?<Skeleton/>:
        <>
        <div className="barContainer">
       {/* <div className="bar">
          <BsSearch/>
          <input type="text" placeholder="Search for data, users, docs"/>
          <FaRegBell/>
          <img src={user?.photo || UserImg} alt="userImg"/>
        </div> */}
       </div>
        <section className="widgetContainer">
           <WigetItem heading="Reveneu" amount={true} color="green" percent={stats.count.revenue} value={stats.count.revenue} /> 
           <WigetItem heading="users" color="red" percent={stats.Changepercent.user} value={stats.count.user} /> 
           <WigetItem heading="Transaction" color="yellow" percent={stats.Changepercent.order} value={stats.count.order} /> 
           <WigetItem heading="Product"color="purple" percent={stats.Changepercent.product} value={stats.count.product} /> 
        </section>

        <section className="graphContainer">
             <div className="revenueChart ">
                 <h2 className="chartHeading">Revenue & Transaction</h2> 
                 <ChartComponent
                 data_1={stats.chart.monthRevenueCount} 
                 data_2={stats.chart.orderMonthCount} bgColor_1="red" 
                 bgColor_2="blue" title_1="reveneu" title_2="Transaction"/>
             </div>
             <div className="dashBoardCatagories">
                  <h2 className="chartHeading">Inventory</h2>
                  <div>
                         
                         {
                          stats.allCategoriesAndStock.map((i)=>{
                              const [heading,value]=Object.entries(i)[0]
                           return(  
                            <CategoryItem key={heading} heading={heading} value={value} color={`hsl(${value*37},${value*16}%,50%)`}/>
                           )
                          })
                         }
                  </div>
             </div>
        </section>
        <section className="transactionContainer">
            <div className="genderChart">
               <h2 className="chartHeading">Gender Ratio</h2>
               <DoughnutChart labels={["Male","Female"]} data={[stats.userRatio.male,stats.userRatio.female]} bgColor={["hsl(340,82%,56%)","rgba(53,162,235,0.8)"]} cutout={80}/>
               <p><BiMaleFemale/></p>
            </div>
            
              <DashBoardTable data={stats.modifiedTransaction} />
        </section>
        </>
       }
      </main>
    </div>
  )
}

interface widgetProps{
  heading:string;
  value:number;
  percent:number;
  color:string;
  amount?:boolean
}


const WigetItem=({heading,value,percent,color,amount=false}:widgetProps)=>(
  <article className="wiget">
           <div className="widgetInfo">
            <p>{heading}</p>
            <h4>{amount?`$${value}`:value}</h4>
            {
              percent>0?<span className="green"><HiTrendingUp/> +{percent}%{" "}</span>:<span className="red"><HiTrendingDown/> {percent}%{" "}</span>
            }
           </div>
           <div className="widgetCircle" style={{
            background:`conic-gradient(
                ${color} ${Math.abs(percent)/100*360}deg,
                  rgb(255,255,255) 0
           )`}}>
                 <span style={{color}}>{percent > 0 && `${percent > 10000 ? 9999 : percent}%`} {percent < 0 && `${percent < -10000 ? -9999 : percent}%`}</span>
           </div>
           
  </article>
)

interface CategoriesProps{
  color:string;
  value:number;
  heading:string
}
const CategoryItem=({color,value,heading}:CategoriesProps)=>(
  <div className="categoryItem">
    <h5>{heading}</h5>
    <div>
      <div style={{backgroundColor:color,width:`${value}%`}}></div>
      </div>
    <span>{value}%</span>
  </div>
)


export default DashBoard
