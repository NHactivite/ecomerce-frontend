import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { AiFillFileText } from "react-icons/ai";
import { FaChartBar, FaChartLine, FaChartPie } from "react-icons/fa";
import { HiMenuAlt4 } from "react-icons/hi";
import { IoIosPeople } from "react-icons/io";
import { MdDiscount } from "react-icons/md";
import { RiCoupon3Fill, RiDatabaseFill, RiShoppingBag3Fill } from "react-icons/ri";
import { Link, Location, useLocation } from "react-router-dom";

const AdminSideBar = () => {
  const location=useLocation();
  const [showModel,setModel]=useState<boolean>(false);
  const[phoneActive,setPhonActive]=useState<boolean>(window.innerWidth < 1100);
  const resetHandler=()=>{
    setPhonActive(window.innerWidth < 1100);
  }
  useEffect(()=>{
    window.addEventListener("resize",resetHandler);
    return()=>{
      window.removeEventListener("resize",resetHandler)
    }
  },[])
  return (
   <>
   {phoneActive && <button id="hamBurger" onClick={()=>setModel(true)}><HiMenuAlt4/></button>}
    <aside style={phoneActive ?
    {
      width:"20rem",
      height:"100vh",
      position:"fixed",
      top:0,
      left:showModel?"0":"-20rem",
      transition:"all 0.5s"
         

    }:{}}>
    <h2>logo.</h2>
        <DivOne location={location}/>
        <DivTwo location={location}/>
        <DivThree location={location} />
        {
    phoneActive&&<button id="closeSideBar" onClick={()=>setModel(false)}>Cloes</button>
  }
  </aside>
   </>
  )
}

const DivOne=({location}:{location:Location})=>(
  <div>
  <h5>dashboard</h5>
  <ul>
    <Li url="/admin/dashboard" text="DashBoard" Icon={RiDatabaseFill} location={location}/>
    <Li url="/admin/product" text="Products" Icon={RiShoppingBag3Fill} location={location}/>
    <Li url="/admin/customer" text="Customers" Icon={IoIosPeople} location={location}/>
    <Li url="/admin/transaction" text="Transactions" Icon={AiFillFileText} location={location}/>
    <Li url="/admin/discount" text="Discount" Icon={MdDiscount} location={location}/>
  </ul>
</div>
)

const DivTwo=({location}:{location:Location})=>(
  <div>
  <h5>charts</h5>
  <ul>
    <Li url="/admin/chart/bar" text="Bar" Icon={FaChartBar} location={location}/>
    <Li url="/admin/chart/pie" text="Pie" Icon={FaChartPie} location={location}/>
    <Li url="/admin/chart/line" text="Line" Icon={FaChartLine} location={location}/>
  </ul>
</div>
)
const DivThree=({location}:{location:Location})=>(
  <div>
  <h5>Apps</h5>
  <ul>
    <Li url="/admin/app/coupon" text="Coupon" Icon={RiCoupon3Fill} location={location}/>
  </ul>

</div>
)




interface LiProps{
  url:string;
  text:string;
  location:Location;
  Icon:IconType
}

const Li=({url,location,text,Icon}:LiProps)=>(
         <li style={{backgroundColor: location.pathname.includes(url)? "rgba(0,115,255,0.1)":"white"}}>
         <Link to={url} style={{color: location.pathname.includes(url)? "rgb(0,115,255)":"black"}} ><Icon/> {text}</Link>
          </li>

)
export default AdminSideBar;
