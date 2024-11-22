import { Slider } from "6pp"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { FaHeadset } from "react-icons/fa"
import { FaAnglesDown } from "react-icons/fa6"
import { LuShieldCheck } from "react-icons/lu"
import { TbTruckDelivery } from "react-icons/tb"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import videoCover from "../assets/video/14513394-uhd_2560_1440_30fps.mp4"
import { Skeleton } from "../components/Loader"
import { useBrandsQuery, useLatestProductsQuery, useNewWishMutation } from "../redux/api/productAPI"
import { addToCart } from "../redux/reducer/cartReducer"
import { newWishRequest } from "../types/api-types"
import { darkReducerInitialState, UserReducerInitialState } from "../types/reducers-types"
import { CartItem } from "../types/types"
import { responseToast } from "../utils/features"
import ProductCard from "./ProductCard"
const clients = [
  {
    src: "https://logos-world.net/wp-content/uploads/2020/04/Samsung-Symbol.png",
    alt: "Samsung",
  },
  {
    src: "https://s.yimg.com/fz/api/res/1.2/MEqAEifsY3r3IvUe76DCTA--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI0MDtxPTgwO3c9MzMy/https://s.yimg.com/zb/imgv1/5388ef0e-be2a-3bb5-91a9-706689df1cce/t_500x300",
    alt: "Realme",
  },
  {
    src: "https://www.logo.wine/a/logo/Redmi/Redmi-Logo.wine.svg",
    alt: "Redme",
  },
  {
    src: "https://www.logo.wine/a/logo/Vivo_(technology_company)/Vivo_(technology_company)-Logo.wine.svg",
    alt: "Vivo",
  },
  {
    src: "https://www.logo.wine/a/logo/Oppo/Oppo-Logo.wine.svg",
    alt: "Oppo",
  },
  {
    src: "https://www.logo.wine/a/logo/Motorola_Mobility/Motorola_Mobility-Logo.wine.svg",
    alt: "Motorola",
  },
  {
    src: "https://www.logo.wine/a/logo/Apple_Inc./Apple_Inc.-Logo.wine.svg",
    alt: "Apple",
  },
  {
    src: "https://www.logo.wine/a/logo/OnePlus/OnePlus-Logo.wine.svg",
    alt: "OnePlus",
  },
  {
    src: "https://www.logo.wine/a/logo/Huawei/Huawei-Logo.wine.svg",
    alt: "Huawei",
  },

  {
    src: "https://s.yimg.com/fz/api/res/1.2/l3DlVZsz5kRamcFNK64trg--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI0MDtxPTgwO3c9MzMy/https://s.yimg.com/zb/imgv1/8c01e9ab-e3c4-3dd9-8f32-524240d2535c/t_500x300",
    alt: "Infinix",
  }
 
];
const banners = [
  "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253445/rmbjpuzctjdbtt8hewaz.png",
  "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253433/ticeufjqvf6napjhdiee.png",
];
const services = [
  {
    icon: <TbTruckDelivery />,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $200",
  },
  {
    icon: <LuShieldCheck />,
    title: "SECURE PAYMENT",
    description: "100% secure payment",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 SUPPORT",
    description: "Get support 24/7",
  },
];
const Home = () => {
   const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)

  const {data,isLoading,isError}=useLatestProductsQuery("")
  const dispatch=useDispatch();
  const {dark}=useSelector((state:{darkReducer:darkReducerInitialState})=>state.darkReducer)
  
  const {data:brands,isLoading:brandsLoading}=useBrandsQuery("")
  const uniqueBrands = [...new Set(brands?.Brands.map(brand => brand.toLowerCase()))];


  const [addWish]=useNewWishMutation()
 const addCartHandler=(cartItem:CartItem)=>{
    if(cartItem.stock < 1) return toast.error("out Of Stock");
    dispatch(addToCart(cartItem))
    toast.success("Added to Cart")
 }

const addWishHandler = async (newWishRequest: newWishRequest) => {
      const res = await addWish(newWishRequest);
      responseToast(res,null,"");
}

 if(isError) toast.error("Connot Load the product")
  const coverMessage =
 "Let’s go invent tomorrow instead of worrying about what happened yesterday I have not failed. I’ve just found 10,000 ways that won’t work".split(
   " "
 );
  return (
    <>
   <div className={`home ${dark ? 'dark' : ''}`}>
        <section></section>

        <div>
          <aside>
            <h1>Brands</h1>
            <ul >
              {brandsLoading?<Skeleton/>:uniqueBrands.map((i) => (
                <li key={i}>
                  <Link className={`${dark ? 'dark' : ''}`} to={`/search?search=${i.toLowerCase()}`}>{i.toUpperCase()}</Link>
                </li>
              ))}
            </ul>
          </aside>
          <Slider
            autoplay
            autoplayDuration={1500}
            showNav={false}
            images={banners}
          />
        </div>

        <h1>Latest Products
          <Link className={`findMore ${dark ? 'dark' : ''}`} to={"/search"}>More</Link>
        </h1>
        <main id="home">
          {isLoading? (
            <>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ height: "25rem" }}>
                  <Skeleton width="18.75rem" length={1} height="20rem" />
                  <Skeleton width="18.75rem" length={2} height="1.95rem" />
                </div>
              ))}
            </>
          ):
            data?.product.map((i,idx)=>(
              
                  <ProductCard
                  key={idx}
                  userId={user?._id!}
                  productId={i._id}
                  name={i.name}
                   price={i.price} 
                  stock={i.stock} 
                  photos={i.photos} 
                  handler={addCartHandler} 
                  wishHandler={addWishHandler}
              />
            ))
          }
        </main>
    </div>   
     <article className={`cover-video-container ${dark?'dark':''}`}>
    <div className="cover-video-overlay"></div>
    <video autoPlay loop muted src={videoCover} />
    <div className="cover-video-content">
      <motion.h3
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        A Journey Beyond Yesterday
      </motion.h3>
      {coverMessage.map((el, i) => (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.25,
            delay: i / 10,
          }}
          key={i}
        >
          {el}{" "}
        </motion.span>
      ))}
    </div>
    <motion.span
      animate={{
        y: [0, 10, 0],
        transition: {
          duration: 1,
          repeat: Infinity,
        },
      }}
    >
      <FaAnglesDown />
    </motion.span>
  </article> 
  <article className={`our-clients ${dark?'dark':''}`}>
        <div>
          <h2>Top Avilable Brands</h2>
          <div>
            {clients.map((client, i) => (
              <motion.img
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: i / 20,
                    ease: "circIn",
                  },
                }}
                src={client.src}
                alt={client.alt}
                key={i}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: -100 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                delay: clients.length / 20,
              },
            }}
          >
            Trusted By 100+ Companies in 30+ countries
          </motion.p>
        </div>
      </article>

      <hr
        style={{
          backgroundColor: "rgba(0,0,0,0.1)",
          border: "none",
          height: "1px",
        }}
      />

      <article className={`our-services ${dark?'dark':''}`}>
        <ul>
          {services.map((service, i) => (
            <motion.li
              initial={{ opacity: 0, y: -100 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: i / 20,
                },
              }}
              key={service.title}
             
            >
              <div>{service.icon}</div>
              <section>
                <h3 >{service.title}Y</h3>
                <p >{service.title}</p>
              </section>
            </motion.li>
          ))}
        </ul>
      </article>
  </>
  )
}

export default Home
