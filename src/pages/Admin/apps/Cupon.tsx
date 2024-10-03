import { useState,FormEvent, useEffect } from "react"
import AdminSideBar from "../../../components/Admin/AdminSideBar"

const allLetters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz";
const allNumbers="1234567890";
const allSymbols="!@#$%^&*()_+"

const Cupon = () => {
 
  const[size,setSize]=useState<number>(8)
  const[prefix,setPreFix]=useState<string>("")
  const[includeNumbers,setIncludeNumbers]=useState<boolean>(false);
  const[includeChar,setIncludeChar]=useState<boolean>(false);
  const[includeSymbol,setIncludeSymbol]=useState<boolean>(false);
  const[isCoppied,setIsCoppied]=useState<boolean>(false);

  const [coupon,setCoupon]=useState<string>("")

  const copyText=async(coupon:string)=>{
    await window.navigator.clipboard.writeText(coupon);
    setIsCoppied(true);
  }

const submitHandler=(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  if(!includeChar&&!includeNumbers&&!includeSymbol) return alert("Please select one atleast");

  let result:string=prefix||"";
  const loopLength:number=size-result.length;

  for(let i=0;i<loopLength;i++){
     let entireString:string="";
     if(includeChar) entireString+=allLetters;
     if(includeNumbers) entireString+=allNumbers;
     if(includeSymbol) entireString+=allSymbols;
     const randomNum:number=~~(Math.random()*entireString.length)
    result+=
     entireString[randomNum]
  }
  setCoupon(result)
}
  useEffect(()=>{
       setIsCoppied(false)
  },[coupon])

  return (
    <div className="adminContainer">
      <AdminSideBar/>
      <main >
        <h1 className="coupnHeading">Coupon</h1>
        <section className="dashBordAppContainer">
          <form className="couponForm" onSubmit={submitHandler}>
            <input type="text" placeholder="Text to include" value={prefix} onChange={(e)=>setPreFix(e.target.value)} maxLength={size}/>
            <input type="number" placeholder="6" onChange={(e)=>setSize(Number(e.target.value))} min={6} max={25}/>
            <fieldset>
              <legend>Include</legend>
              <input type="checkbox" checked={includeNumbers} onChange={()=>setIncludeNumbers((prev)=>!prev)} />
              <span>Numbers</span>
              <input type="checkbox" checked={includeSymbol} onChange={()=>setIncludeSymbol((prev)=>!prev)} />
              <span>Symbols</span>
              <input type="checkbox" checked={includeChar} onChange={()=>setIncludeChar((prev)=>!prev)} />
              <span>Characters</span>
              </fieldset>
              <button type="submit">Generate</button>
          </form>
          {
            coupon &&
            <code>
                   {coupon} <span onClick={()=>copyText(coupon)}>{isCoppied?"Copied":"Copy"}</span>
            </code>
          }
        </section>
      </main>
    </div>
  )
}

export default Cupon
