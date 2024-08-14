import log from "../logger";
import { Request, Response } from "express";
import { AttendeeUser } from "../model/user.model";
import { get } from "lodash";
import { v2 as cloudinary } from "cloudinary";

import axios from "axios";
import {
  findAllOrder,
  findAndUpdateOrder,
  findOrder,
  findOrders,
} from "../service/order/order.service";

import { createTransaction } from "../service/transaction/transaction.services";

const secretKey = process.env.PAYSTAACK_SECRET_KEY;
console.log(secretKey);

export const verifyPayment = async (req: Request, res: Response) => {
  const session = await AttendeeUser.startSession();
  session.startTransaction();

  try {
    const body = get(req, "body");
    const { total, referenceId, editionPaidFor, fullName, email } = body;

    const config = {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    };

    log.info("calling verify endpoint....");
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${referenceId}`,
        config
      );

      log.info("response status: " + response.status);
      log.info("response data: " + JSON.stringify(response.data));

      if (response.status !== 200) {
        log.info("verification failed, aborting transaction....");

        await session.abortTransaction();
        session.endSession();

        return res.status(response.status).json({
          message: "Payment verification failed",
        });
      }

      log.info(
        " <<< verification successful, creating new order transaction.... >>> "
      );

      //create new transaction
      const transaction = await createTransaction({
        fullName,
        total,
        paymentVerified: true,
        editionPaidFor,
        email,
      });

      log.info(transaction);

      if (!transaction) {
        log.info(
          "<<< transaction creation failed, aborting transaction...>>> "
        );

        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
          message: "Ops something went wrong. Please try again later!!",
        });
      }
      //create new order

      await session.abortTransaction();
      session.endSession();

      log.info("returning success response....");

      return res.status(200).json({
        status: 200,
        message: "Payment verified successfully",
        data: { transaction },
      });
    } catch (err: any) {
      log.error(
        "Error in Paystack verification: ",
        err.response?.data || err.message
      );
      await session.abortTransaction();
      session.endSession();
      return res.status(err.response?.status || 500).json({
        message: "Payment verification failed",
        error: err.response?.data || err.message,
      });
    }
  } catch (error) {
    log.error(error as Error);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

//get orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    let userId = get(req, "user._id");
    const body = get(req, "body");
    const { user, userId: _id } = body;
    const startDate = get(req, "params.startDate");
    const endDate = get(req, "params.endDate");
    let orders;

    // if (user?.role == "admin") {
    //   userId = req?.params?.userId ? req?.params?.userId : userId;
    // }

    if (startDate) {
      orders = await findOrders({
        userId,
        createdAt: { $gte: startDate, $lte: endDate },
      });
    } else {
      orders = await findOrders({ userId });
    }

    return res.status(200).json({
      status: 200,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    log.error(error as Error);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

//get orders
export const getAdminOrders = async (req: Request, res: Response) => {
  try {
    let userId = req.params.userId ? req.params.userId : "";
    const body = get(req, "body");
    const { user } = body;
    const startDate = get(req, "params.startDate");
    const endDate = get(req, "params.endDate");
    let orders;

    if (user.role !== "admin") {
      return res.status(401).json({
        status: 401,
        message:
          "Unauthorized!!! You do not have permission to access this resource",
      });
    }

    if (startDate) {
      orders = await findOrders({
        userId,
        createdAt: { $gte: startDate, $lte: endDate },
      });
    } else {
      orders = await findOrders({ userId });
    }

    return res.status(200).json({
      status: 200,
      message: "All Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    log.error(error as Error);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    let userId = req.params.userId ? req.params.userId : "";
    const body = get(req, "body");
    const { user } = body;
    const startDate = get(req, "params.startDate");
    const endDate = get(req, "params.endDate");
    let orders;

    if (user?.role !== "admin") {
      return res.status(401).json({
        status: 401,
        message:
          "Unauthorized!!! You do not have permission to access this resource",
      });
    }

    orders = await findAllOrder();

    return res.status(200).json({
      status: 200,
      message: "All Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    log.error(error as Error);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

// Get a single order
export const getSingleOrderHandler = async (req: Request, res: Response) => {
  try {
    const userId = get(req, "user._id");
    const orderId = get(req, "params.id");
    const order = await findOrders({ userId, _id: orderId });
    if (!order) {
      return res.status(404).json({
        status: 404,
        message: "Order not found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    log.error(error as Error);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

// Update an order
export const updateOrderHandler = async (req: Request, res: Response) => {
  try {
    const userId = get(req, "user._id");
    const orderId = get(req, "params.id");
    const body = get(req, "body");
    const { user } = body;
    const status = get(req, "body.status");
    let order;
    if (user.role !== "admin") {
      order = await findOrders({ userId, _id: orderId });
    } else {
      order = await findOrders({ _id: orderId });
    }

    if (!order) {
      return res.status(404).json({
        status: 404,
        message: "Order not found",
      });
    }

    const updatedOrder = await findAndUpdateOrder(
      { _id: orderId },
      { shippingStatus: status },
      { new: true }
    );

    return res.status(200).json({
      status: 200,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    log.error(error as Error);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const uploadOrderImageHandler = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const userId = get(req, "user._id");
    const userRole = get(req, "user.role");
    const orderId = get(req, "body.orderId");
    if (!file) {
      return res.status(400).json({
        status: 400,
        message: "No file uploaded",
      });
    }
    // Upload the file to Cloudinary
    // @ts-ignore
    const uploadResponse = await cloudinary.uploader.upload(file.path);
    if (uploadResponse && uploadResponse.secure_url) {
      const imageUrl = uploadResponse.secure_url;
      // @ts-ignore
      const order = await findOrder({ _id: orderId });
      if (!order) {
        return res.status(401).json({
          status: 401,
          message: "order not found",
        });
      }
      // if (String(userRole) !== "admin") {
      //   return res.status(401).json({
      //     status: 401,
      //     message:
      //       "You do not have the required permissions to update this project.",
      //   });
      // }
      // Associate the image URL with the project data and update the project
      // @ts-ignore
      const updatedOrder = await findAndUpdateOrder(
        { _id: orderId },
        { $set: { image: imageUrl } },
        { new: true }
      );
      return res.status(201).json({
        status: 201,
        order: updatedOrder,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: "Error uploading to Cloudinary",
      });
    }
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};
