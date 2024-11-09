
const Loader = () => {
  return (
  <div className="loaderContainer">
      <section className="loader">
    
    </section>
  </div>
  )
}

export default Loader
interface SkeletonProps{
  width?:string,
  height?:string,
  length?:number,
  containerHeight?:string
}

export const Skeleton=({width="unset",length=3,height="unset",containerHeight="unset" }:SkeletonProps)=>{
  const Skeletons=Array.from({length},(_,idx)=>(
    <div key={idx} className="skeleton" style={{height}}></div>
  ));
  return(
    <div className="skeletonLoader" style={{width,height:containerHeight}}>
      {Skeletons}
    </div>
  )
}