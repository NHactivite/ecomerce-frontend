import { ReactElement } from "react";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";

interface Props{
    isAuthenticated:boolean;
    children?:ReactElement;
    adminRoute?:boolean;
    isAdmin?:boolean;
    redirect?:string;
    login?:boolean;
}


const ProtectedRoute = ({isAuthenticated,children,adminRoute,isAdmin,redirect="/",login}:Props) => {
   
    if(!isAuthenticated) {
      login?toast.error("Login First"):""
     return <Navigate to={redirect}/>
    }

    if(adminRoute && !isAdmin )return <Navigate to={redirect}/>

  return (
    children?children:<Outlet/>
  )
}

export default ProtectedRoute
