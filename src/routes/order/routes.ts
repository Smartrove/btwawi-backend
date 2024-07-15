import express from "express";
import { getAdminOrders, getAllOrders, getOrders, getSingleOrderHandler, updateOrderHandler, verifyPayment } from "../../controller/order.controller";
import { updateOrderRules, validate } from "../../middleware/validation/validator";



const OrderRouter = express.Router();

OrderRouter.get("/get/:id", getSingleOrderHandler );
OrderRouter.get("/get", getOrders);
OrderRouter.post("/update/:id", updateOrderRules(), validate, updateOrderHandler)
OrderRouter.post("/verify", verifyPayment)
OrderRouter.get('/getAdminOrder', getAdminOrders)
OrderRouter.get('/getall', getAllOrders)

export default OrderRouter;