import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart, saveShippingInfo } from "../redux/reducer/cartReducer";
import {
  CartReducerInitialState,
  darkReducerInitialState,
  UserReducerInitialState,
} from "../types/reducers-types";
import { responseToast } from "../utils/features";

type ShippingFormInputs = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phnNo: string;
};

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, total, subtotal, discount, shippingCharges } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );

  const { dark } = useSelector(
    (state: { darkReducer: darkReducerInitialState }) => state.darkReducer
  );

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const [newOrder] = useNewOrderMutation();
  const [loading, setLoading] = useState(false);
  const cashfreeRef = useRef<any>(null);

  const { register, handleSubmit, formState: { errors }, watch,getValues } = useForm<ShippingFormInputs>({
    defaultValues: {
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      phnNo: "",
    },
  });

  // Initialize Cashfree SDK
  useEffect(() => {
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
  }, []);

  const getSessionId = async () => {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/payment/pay`,
        {
          customer_id: user?._id,
          order_items: cartItems,
          discount: discount,
          customer_phone: watch("phnNo"),
        }
      );

      if (res.data && res.data.payment_session_id) {
        return {
          paymentSessionId: res.data.payment_session_id,
          orderId: res.data.order_id,
          order_status: res.data.order_status,
        };
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const verifyPayment = async (orderId: string) => {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/payment/verify`,
        {
          order_id: orderId,
        }
      );
      if (res && res.data[0].payment_status === "SUCCESS") {
        toast.success("Payment verified");
        const response = await newOrder({
          shippingInfo: getValues(),
          orderItems: cartItems,
          subtotal,
          discount,
          shippingCharges,
          total,
          userId: user?._id!,
        });
        responseToast(response, navigate, "/");
        dispatch(resetCart());
      }
    } catch (error) {
      setLoading(false);
      toast.error("Payment verification failed");
    }
  };

  const onSubmit: SubmitHandler<ShippingFormInputs> = async (data) => {
    if (loading) return;
    setLoading(true);
    dispatch(saveShippingInfo(data));

    if (!cashfreeRef.current) {
      toast.error("Payment gateway not loaded. Please try again.");
      setLoading(false);
      return;
    }

    try {
      let sessionId = await getSessionId();
      if (!sessionId) return;

      let checkoutOptions = {
        paymentSessionId: sessionId.paymentSessionId,
        redirectTarget: "_modal",
      };
      cashfreeRef.current.checkout(checkoutOptions).then(() => {
        verifyPayment(sessionId.orderId);
      });
    } catch (error) {
      toast.error("Payment failed.");
    }
  };

  return (
    <div className={`shipping ${dark ? "dark" : ""}`}>
      <button className="backBtn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Shipping Address</h1>
        <input
          type="text"
          placeholder="Address"
          {...register("address", { required: "Address is required" })}
        />
        {errors.address && <p>{errors.address.message}</p>}

        <input
          type="text"
          placeholder="City"
          {...register("city", { required: "City is required" })}
        />
        {errors.city && <p>{errors.city.message}</p>}

        <input
          type="text"
          placeholder="State"
          {...register("state", { required: "State is required" })}
        />
        {errors.state && <p>{errors.state.message}</p>}

        <input
          type="text"
          placeholder="Country"
          {...register("country", { required: "Country is required" })}
        />
        {errors.country && <p>{errors.country.message}</p>}

        <input
          type="number"
          placeholder="Pincode"
          {...register("pinCode", {
            required: "Pincode is required",
            minLength: { value: 6, message: "Pincode must be 6 digits" },
            maxLength: { value: 6, message: "Pincode must be 6 digits" },
          })}
        />
        {errors.pinCode && <p>{errors.pinCode.message}</p>}

        <input
          type="number"
          placeholder="Phone Number"
          {...register("phnNo", {
            required: "Phone number is required",
            minLength: { value: 10, message: "Phone number must be 10 digits" },
            maxLength: { value: 10, message: "Phone number must be 10 digits" },
          })}
        />
        {errors.phnNo && <p>{errors.phnNo.message}</p>}

        <button
          type="submit"
          disabled={loading || cartItems.length === 0}
          className={`${dark ? "payDarkbtn" : "paybtn"}`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default Shipping;
