import express from 'express';
import { 
    createPartnerHandler 
} from '../../controller/partner.controller';
import {   validate, partnerValidationRules } from '../../middleware/validation/validator';

const PartnerRouter = express.Router();


// create user 
PartnerRouter.post('/create-partner', partnerValidationRules(), validate, createPartnerHandler)


export default PartnerRouter;
