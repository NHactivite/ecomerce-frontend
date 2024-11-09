import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart, saveShippingInfo } from "../redux/reducer/cartReducer";
import { NewOrderRequest } from "../types/api-types";
import {
  CartReducerInitialState,
  darkReducerInitialState,
  UserReducerInitialState,
} from "../types/reducers-types";
import { responseToast } from "../utils/features";

const Shipping = () => {
  let navigate = useNavigate();
  const { cartItems, total, subtotal, discount, shippingCharges } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );
    
  const { dark } = useSelector(
    (state: { darkReducer: darkReducerInitialState }) => state.darkReducer
  );

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const dispatch = useDispatch();
  const [disable, setDisable] = useState<boolean>(true);
  const [newOrder] = useNewOrderMutation();
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    phnNo: "",
  });

  useEffect(() => {
    const { address, city, state, country, pinCode, phnNo } = shippingInfo;
    if (
      address &&
      city &&
      state &&
      country &&
      pinCode &&
      phnNo.length &&
      cartItems.length > 0
    ) {
      setDisable(false); // Enable button
    } else {
      setDisable(true); // Disable button
    }
  }, [cartItems, shippingInfo]);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //          payment---------------------------------------
  const orderData: NewOrderRequest = {
    shippingInfo,
    orderItems: cartItems,
    subtotal,
    discount,
    shippingCharges,
    total,
    userId: user?._id!,
  };

  const cashfreeRef = useRef<any>(null); // Reference for Cashfree SDK
  useEffect(() => {
    // Initialize SDK only once on component mount
    const initializeSDK = async () => {
      try {
        if (!cashfreeRef.current) {
          cashfreeRef.current = await load({
            mode: "sandbox", // Adjust mode as needed
          });
        }
      } catch (error) {
        toast.error("Failed to load payment gateway.");
      }
    };
    initializeSDK();
  }, []); // Empty dependency array to run only on mount

  const getSessionId = async () => {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/payment/pay`,
        {
          customer_id: user?._id,
          order_items:cartItems,
          discount:discount,
          customer_phone: shippingInfo.phnNo,
        }
      );

      if (res.data && res.data.payment_session_id) {
        return {
          paymentSessionId: res.data.payment_session_id,
          orderId: res.data.order_id, // Return order_id directly
          order_status: res.data.order_status,
        };
      }
    } catch (error) {
      toast.error("something Wrong");
    }
  };
  // Function to verify payment status
  const verifyPayment = async (_id: string) => {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/payment/verify`,
        {
          order_id: _id,
        }
      );
      if (res && res.data[0].payment_status === "SUCCESS") {
        toast.success("payment verified");
        const response = await newOrder(orderData);
        
        responseToast(response, navigate, "/");
        dispatch(resetCart());
      }
    } catch (error) {
      toast.error("Payment verification failed");
    }
  };

  // Main function to handle payment initiation
  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple clicks
    setLoading(true);
    dispatch(saveShippingInfo(shippingInfo));
    if (!cashfreeRef.current) {
      toast.error("Payment gateway not loaded. Please try again.");
      setLoading(false);
      return;
    }
    try {
      let sessionId = await getSessionId();
      if (!sessionId) return; // Stop if session ID fetch failed
      let checkoutOptions = {
        paymentSessionId: sessionId?.paymentSessionId,
        redirectTarget: "_modal",
      };
      cashfreeRef.current.checkout(checkoutOptions).then(() => {
        verifyPayment(sessionId?.orderId); // Now it's safe to verify the payment
      });
    } catch (error) {
      toast.error("payment failed");
    }
  };

  //--------------------------------------------------------

  return (
    <div className={`shipping ${dark ? "dark" : ""}`}>
      <button className="backBtn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>
      <form>
        <h1>Shipping Address</h1>
        <input
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
          required
        />
        <input
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
          required
        />
        <input
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
          required
        />
        <input
          type="text"
          placeholder="Country"
          name="country"
          value={shippingInfo.country}
          onChange={changeHandler}
          required
        />
        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value="">Choose Country</option>
          <option value="india">India</option>
        </select>
        <input
          type="number"
          placeholder="Pincode"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
          required
        />
        <input
          type="number"
          placeholder="Phn NO"
          name="phnNo"
          value={shippingInfo.phnNo}
          onChange={changeHandler}
          required
        />
        <button
          type="submit"
          onClick={handleClick}
          disabled={disable}
          className={`${dark ? "payDarkbtn" : "paybtn"}`}
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default Shipping;
