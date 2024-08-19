import express from 'express';
import { 
    createAttendeeLagosUserHandler, 
    createAttendeeAbujaUserHandler, 
    createVendorLagosUserHandler, 
    createVendorAbujaUserHandler,
    createUserHandler, 
} from '../../controller/user.controller';
import { attendeeUserValidationRules, userValidationRules, validate, vendorUserValidationRules } from '../../middleware/validation/validator';

const UserRouter = express.Router();


// create user 
UserRouter.post('/user-create', userValidationRules(), validate, createUserHandler)
UserRouter.post('/create-attendee-lagos', attendeeUserValidationRules(), validate, createAttendeeLagosUserHandler)
UserRouter.post('/vendor-create-lagos', vendorUserValidationRules(), validate, createVendorAbujaUserHandler)
UserRouter.post('/create-attendee-abuja', attendeeUserValidationRules(), validate, createAttendeeAbujaUserHandler)
UserRouter.post('/vendor-create-abuja', vendorUserValidationRules(), validate, createVendorLagosUserHandler)


export default UserRouter;
