import { Request, Response } from "express";
import {
  createVolunteer,
  findVolunteer,
} from "../service/registerVolunteers/registerVolunteers.service";
import { omit, get } from "lodash";
import log from "../logger";
import { ServerClient } from "postmark";

export const registerVolunteerHandler = async (req: Request, res: Response) => {
  try {
    const userEmail = get(req, "body.email");

    const userExist = await findVolunteer({ email: req.body.email }, {});

    if (userExist) {
      return res.status(403).json({
        status: 403,
        message: " User with same email already exists",
      });
    }

    if (req.body.phoneNum) {
      const userPhone = get(req, "body.phoneNum");

      const userPhoneExist = await findVolunteer(
        {
          phoneNum: userPhone,
        },
        {}
      );

      if (userPhoneExist) {
        return res.status(409).json({
          status: 409,
          message: " User with same phone already exists",
        });
      }
    }

    const data = {
      html: `
        <h2>Thank You for registering for Business The Way Allaah Wants It</h2>
        <p>Your details has been collected. We look forward to seeing you in the event.</p>
        <div>
          <p>Best Regards,<br/>BTWAWI Team</p>
        </div>
          `,
    };

    const AdminData = {
      html: `
        <h2>${userEmail} just registered for Business The Way Allaah Wants It</h2>
        <p>The details has been collected. We look forward to seeing him/her in the event.</p>
        <div>
          <p>Best Regards,<br/>BTWAWI Team</p>
        </div>
          `,
    };

    let newUser = req.body;

    console.log("newUser", newUser);
    const user = await createVolunteer(req.body);

    // Send an email:
    const client = new ServerClient(process.env.EMAIL_SECRET_KEY as string);
    // const msg = await client.sendEmailWithTemplate({
    //   From: `${process.env.EMAIL_DOMAIN}`,
    //   To: userEmail,
    //   TemplateAlias: "Volunteer",
    //   TemplateModel: data,
    // });

    // const adminMsg = await client.sendEmailWithTemplate({
    //   From: `${process.env.EMAIL_DOMAIN}`,
    //   To: `${process.env.EMAIL_ADMIN}`,
    //   TemplateAlias: "Volunteer-Registration-Admin",
    //   TemplateModel: {
    //     userEmail: `${userEmail}`,
    //   },
    // });

    return res.send(omit(user.toJSON(), "password"));
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};
