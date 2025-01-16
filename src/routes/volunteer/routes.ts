import express from 'express';
import { 
    registerVolunteerHandler, 
} from '../../controller/registration.controller';

const VolunteerRouter = express.Router();


// create Volunteer 
VolunteerRouter.post('/register', registerVolunteerHandler)



export default VolunteerRouter;
