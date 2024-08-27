import { Request, Response } from "express";
import { createPartner, findPartner } from "../service/partner/createPartner";
import { get } from "lodash";
import log from "../logger";
import { ServerClient } from "postmark";

export const createPartnerHandler = async (req: Request, res: Response) => {
  try {
    const userExist = await findPartner({ email: req.body.email }, {});
    const userEmail = get(req, "body.email");
    const company_name = get(req, "body.companyName");

    if (userExist) {
      return res.status(403).json({
        status: 403,
        message: " User with same email already exists",
      });
    }

    let newUser = req.body;

    const user = await createPartner(newUser);

    const data = {
      html: `
      <h2>Thank You for registering for Business The Way Allaah Wants It</h2>
      <p>Your details has been collected. We look forward to seeing you in the event.</p>
      <div>
        <p>Best Regards,<br/>BTWAWI Team</p>
      </div>
        `,
    };

    const client = new ServerClient(process.env.EMAIL_SECRET_KEY as string);
    const msg = await client.sendEmailWithTemplate({
      From: `${process.env.EMAIL_DOMAIN}`,
      To: userEmail,
      TemplateAlias: "BTWAWI-Partner-Registration",
      TemplateModel: {
        company_name: `${company_name}`,
      },
    });

    const adminMsg = await client.sendEmailWithTemplate({
      From: `${process.env.EMAIL_DOMAIN}`,
      To: `${process.env.EMAIL_ADMIN}`,
      TemplateAlias: "BTWAWI-Registration-Admin",
      TemplateModel: {
        userEmail: `${userEmail}`,
      },
    });

    return res.send({
      status: 200,
      data: user,
    });
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};
