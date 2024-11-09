import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import "./styles/userApp.scss";

import { Toaster } from "react-hot-toast";

import Footer from "./components/Footer";
import Header from "./components/Header";
import ProtectedRoute from "./components/protected-route";
const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Cart = lazy(() => import("./pages/Cart"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
// logged in user routes------------------------------>

const Shipping = lazy(() => import("./pages/Shipping"));
const Order = lazy(() => import("./pages/Order"));
const Login = lazy(() => import("./pages/Login"));
const OrderDetalis = lazy(() => import("./pages/OrderDetalis"));
const WishListItems = lazy(() => import("./pages/WishList"));
const Notfound = lazy(() => import("./pages/not-found"));
// Admin------------------------------------------->
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./firebase";
import { getUser } from "./redux/api/userAPI";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { UserReducerInitialState } from "./types/reducers-types";

const Coupon = lazy(() => import("./pages/Admin/apps/Cupon"));
const Transaction = lazy(() => import("./pages/Admin/Transaction"));
const DashBoard = lazy(() => import("./pages/Admin/DashBoard"));
const Products = lazy(() => import("./pages/Admin/Products"));
const Customer = lazy(() => import("./pages/Admin/Customer"));
const Discount = lazy(() => import("./pages/Admin/Discount"));

const BarCharts = lazy(() => import("./pages/Admin/charts/BarCharts"));
const LineCharts = lazy(() => import("./pages/Admin/charts/LineCharts"));
const PieCharts = lazy(() => import("./pages/Admin/charts/PieCharts"));

const NewProduct = lazy(() => import("./pages/Admin/management/NewProduct"));
const TransactionManagement = lazy(
  () => import("./pages/Admin/management/TransactionManagement")
);
const ProductManagement = lazy(
  () => import("./pages/Admin/management/ProductManagement")
);
const NewDiscount = lazy(() => import("./pages/Admin/management/NewDiscount"));
const DiscountManagement = lazy(
  () => import("./pages/Admin/management/DiscountManagement")
);

const App = () => {
  const { user, loading } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  // return signOut(auth).then(c=>console.log("log out"))
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid);
        dispatch(userExist(data.user));
      } else {
        dispatch(userNotExist());
      }
    });
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Header user={user} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wish" element={<WishListItems />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={user ? false : true}>
                <Login />
              </ProtectedRoute>
            }
          />

          {/* Logged in user routes */}

          <Route
            element={<ProtectedRoute isAuthenticated={user ? true : false} />}
          >
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/order" element={<Order />} />
            <Route path="/orderDetails/:id" element={<OrderDetalis />} />
          </Route>

          {/* Admin--------------------------------- */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminRoute={true}
                isAdmin={user?.role === "admin" ? true : false}
              />
            }
          >
            <Route path="/admin/dashboard" element={<DashBoard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customer />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            <Route path="/admin/discount" element={<Discount />} />

            {/* charts */}
            <Route path="/admin/chart/bar" element={<BarCharts />} />
            <Route path="/admin/chart/line" element={<LineCharts />} />
            <Route path="/admin/chart/pie" element={<PieCharts />} />

            {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />
            {/* magement */}
            <Route path="/admin/product/new" element={<NewProduct />} />
            <Route path="/admin/discount/new" element={<NewDiscount />} />
            <Route path="/admin/product/:id" element={<ProductManagement />} />
            <Route
              path="/admin/transaction/:id"
              element={<TransactionManagement />}
            />
            <Route
              path="/admin/discount/:id"
              element={<DiscountManagement />}
            />
          </Route>
          <Route path="*" element={<Notfound />} />
        </Routes>
      </Suspense>
      <Footer />
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
};

export default App;
