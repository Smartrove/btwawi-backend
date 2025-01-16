import express from 'express';
import { Request, Response } from 'express';
import UserRouter from './users/routes';
// import PostRouter from './post/routes';
// import ProductRouter from "./product/router";
// import CartRouter from "./cart/router";
// import StoreRouter from "./store/router"
// import WishlistRouter from "./wishlist/routes"
// import CategoryRouter from './category/route';
import OrderRouter from './order/routes';
import PartnerRouter from './partner/routes';
import PostRouter from './post/routes';
import VolunteerRouter from './volunteer/routes';

const Router = express.Router();

Router.use('/healthcheck', (req: Request, res: Response) => res.sendStatus(200))

//Routes
Router.use('/user', UserRouter);
Router.use("/order", OrderRouter);
Router.use("/post", PostRouter);
Router.use("/partner", PartnerRouter);
Router.use("/volunteer", VolunteerRouter);

export default Router;