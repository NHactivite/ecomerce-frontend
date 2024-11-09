import { signOut } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaRegUser, FaSearch, FaShoppingBag, FaSignOutAlt, FaUser } from "react-icons/fa";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { darkExist } from "../redux/reducer/darkReducer";
import { darkReducerInitialState } from "../types/reducers-types";
import { User } from "../types/types";
import { CiHeart } from "react-icons/ci";

interface PropsType{
  user:User|null;
}

const Header = ({user}:PropsType) => {
  const {dark}=useSelector((state:{darkReducer:darkReducerInitialState})=>state.darkReducer)
 
 const [isOpen,setIsOpen]=useState<boolean>(false)
  const [darkAdd,setdark]=useState<boolean>(false)
  const dispatch=useDispatch()
 const logoutHandler=async()=>{
  try {
    await signOut(auth);
    toast.success("Sign Out Successfully");
     setIsOpen(false);
  } catch (error) {
     toast.error("Sign Out Fail")
  }
 }
const modeHandler=()=>{
  setdark(!darkAdd)
   dispatch(darkExist())
}



  return (
    <nav className={`header ${dark ? 'darkHeader' : ''}`} onClick={isOpen?()=>setIsOpen(false):()=>{}}>
        <Link className={`${dark ? 'darkList' : ''}`} to={"/"} onClick={()=>setIsOpen(false)}>HOME</Link>
        <Link className={`${dark ? 'darkList' : ''}`}  to={"/search"}  onClick={()=>setIsOpen(false)}><FaSearch/>{" "}</Link>
        <Link className={`${dark ? 'darkList' : ''}`}  to={"/cart"} onClick={()=>setIsOpen(false)}><FaShoppingBag/>{" "}</Link>
        <Link className={`${dark ? 'darkList' : ''}`}  to={"/wish"} onClick={()=>setIsOpen(false)}><CiHeart/>{" "}</Link>
        <span onClick={()=>modeHandler()}>{dark?<MdDarkMode/>:<MdOutlineLightMode />}</span>

        {
            user?._id?(
               <>
                 <button onClick={()=>setIsOpen(prev=>!prev)}>{dark?<FaRegUser/>:<FaUser/> }</button>
                 <dialog open={isOpen} className={`${dark ? 'darkHeader' : ''}`}>
                    <div >
                        {
                            user.role==="admin" && (<Link className={`${dark ? 'darkList' : ''}`} to={"/admin/dashboard"}  onClick={()=>setIsOpen(false)}>Admin</Link>)
                        }
                        <Link className={`${dark ? 'darkList' : ''}`} to={"/order"}  onClick={()=>setIsOpen(false)}>Orders</Link>
                        <button  onClick={logoutHandler}><FaSignOutAlt/></button>
                    </div>
                 </dialog>
               </>
            ):<Link className={`${dark ? 'darkList' : ''}`}  to={"/login"}>Login</Link>
        }
    </nav>
  )
}

export default Header
