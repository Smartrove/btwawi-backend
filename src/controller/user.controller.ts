import { Request, Response } from "express";
import {
  createUser,
  createUserWithRole,
  createVendorUser,
  findAndUpdate,
  findAndUpdateVendor,
  findUser,
  findUsers,
  findUserWithRole,
  findVendorUser,
} from "../service/users/createUser";
import { omit, get } from "lodash";
import log from "../logger";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodeMailer from "nodemailer";
import { ServerClient } from "postmark";

let transporter = nodeMailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_DOMAIN,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const userExist = await findUserWithRole({ email: req.body.email }, {});

    if (userExist) {
      return res.status(403).json({
        status: 403,
        message: " User with same email already exists",
      });
    }

    let newUser = req.body;

    const user = await createUserWithRole(newUser);

    return res.send(omit(user.toJSON(), "password"));
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};

export const createAttendeeLagosUserHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userEmail = get(req, "body.email");

    const userExist = await findUser({ email: req.body.email }, {});

    if (userExist) {
      return res.status(403).json({
        status: 403,
        message: " User with same email already exists",
      });
    }

    if (req.body.phoneNum) {
      const userPhone = get(req, "body.phoneNum");

      const userPhoneExist = await findUser(
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
    newUser.editionChecked = "lagos";

    console.log("newUser", newUser);
    const user = await createUser(req.body);

    // Send an email:
    const client = new ServerClient(process.env.EMAIL_SECRET_KEY as string);
    const msg = await client.sendEmailWithTemplate({
      From: `${process.env.EMAIL_DOMAIN}`,
      To: userEmail,
      TemplateAlias: "BTWAWI-Registration",
      TemplateModel: data,
    });

    const adminMsg = await client.sendEmailWithTemplate({
      From: `${process.env.EMAIL_DOMAIN}`,
      To: `${process.env.EMAIL_ADMIN}`,
      TemplateAlias: "BTWAWI-Registration-Admin",
      TemplateModel: {
        userEmail: `${userEmail}`,
      },
    });

    return res.send(omit(user.toJSON(), "password"));
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};
export const createAttendeeAbujaUserHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userEmail = get(req, "body.email");

    const userExist = await findUser({ email: req.body.email }, {});

    if (userExist) {
      return res.status(403).json({
        status: 403,
        message: " User with same email already exists",
      });
    }

    if (req.body.phoneNum) {
      const userPhone = get(req, "body.phoneNum");

      const userPhoneExist = await findUser(
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

    let newUser = req.body;
    newUser.editionChecked = "abuja";

    console.log("newUser", newUser);

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
      <p>The details has been collected successfully. We look forward to seeing him/her in the event.</p>
      <div>
        <p>Best Regards,<br/>BTWAWI Team</p>
      </div>
        `,
    };

    // Send an email:
    const client = new ServerClient(process.env.EMAIL_SECRET_KEY as string);
    const msg = await client.sendEmailWithTemplate({
      From: `${process.env.EMAIL_DOMAIN}`,
      To: userEmail,
      TemplateAlias: "BTWAWI-Registration",
      TemplateModel: {
        userEmail: `${userEmail}`,
      },
    });

    const adminMsg = await client.sendEmailWithTemplate({
      From: `${process.env.EMAIL_DOMAIN}`,
      To: `${process.env.EMAIL_ADMIN}`,
      TemplateAlias: "BTWAWI-Registration-Admin",
      TemplateModel: AdminData,
    });

    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};

export const createVendorLagosUserHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userEmail = get(req, "body.email");

    console.log("body", req.body);
    const userExist = await findVendorUser({ email: req.body.email }, {});

    if (userExist) {
      return res.status(403).json({
        status: 403,
        message: " User with same email already exists",
      });
    }

    let newUser = req.body;
    newUser.editionChecked = "lagos";

    console.log("newUser", newUser);

    // Send an email:
    const client = new ServerClient(process.env.EMAIL_SECRET_KEY as string);
    const msg = await client.sendEmailWithTemplate({
      From: `${process.env.EMAIL_DOMAIN}`,
      To: userEmail,
      TemplateAlias: "BTWAWI-Vendor-Registration",
      TemplateModel: {
        company_name: `${newUser?.vendorCompanyName}`,
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

    const user = await createVendorUser(req.body);
    return res.send(user.toJSON());
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};
export const createVendorAbujaUserHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userEmail = get(req, "body.email");

    console.log("body", req.body);
    const userExist = await findVendorUser({ email: req.body.email }, {});

    if (userExist) {
      return res.status(403).json({
        status: 403,
        message: " User with same email already exists",
      });
    }

    let newUser = req.body;
    newUser.editionChecked = "abuja";

    console.log("newUser", newUser);
    const user = await createVendorUser(req.body);

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

    // Send an email:
    const client = new ServerClient(process.env.EMAIL_SECRET_KEY as string);
    const msg = await client.sendEmailWithTemplate({
      From: `${process.env.EMAIL_DOMAIN}`,
      To: userEmail,
      TemplateAlias: "BTWAWI-Vendor-Registration",
      TemplateModel: {
        company_name: `${newUser?.vendorCompanyName}`,
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

    return res.send(user.toJSON());
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};

export const getUsersHandler = async (req: Request, res: Response) => {
  try {
    const userRole = get(req, "user.role");

    if (userRole !== "admin") {
      return res.status(403).json({
        status: 403,
        message: " You are not authorized to access this resource",
      });
    }

    const users = await findUsers({ deleted: false }, { password: 0 });

    if (!users) {
      return res.status(404).json({
        status: 404,
        message: " No users found",
      });
    }

    res.status(200).json({ users });
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const userRole = get(req, "user.role");
    const userId = get(req, "params.userId");

    if (userRole !== "admin" && userId !== get(req, "user._id")) {
      return res.status(403).json({
        status: 403,
        message: " You are not authorized to access this resource",
      });
    }

    const users = await findUser(
      { _id: userId, deleted: false },
      { password: 0 }
    );

    if (!users) {
      return res.status(404).json({
        status: 404,
        message: " No users found",
      });
    }

    res.status(200).json({ users });
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};

export const updateUserHandler = async (req: Request, res: Response) => {
  try {
    const userEmail = get(req, "user.email");

    const userExist = await findUser({ email: userEmail });

    if (!userExist) {
      return res.status(403).json({
        status: 403,
        message: " User does not exists",
      });
    }

    let newUser = req.body;
    newUser = omit(newUser, "password");

    const user = await findAndUpdate(
      { email: userEmail },
      { ...newUser },
      { new: true }
    );

    return res.status(200).json({
      message: `User ${userEmail} updated successfully`,
      //@ts-expect-error
      user: omit(user.toJSON(), "password"),
    });
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    log.info("<<< AN ERROR OCCURED WHILE UPDATING USER >>>");
    res.status(409).send(newError.message);
  }
};

export const createUserSessionHandler = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(409).send(newError.message);
  }
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  try {
    // const user = get(req, "user");
    let { email } = get(req, "body");
    console.log("gotHere reset");
    const user = await findUser({ email });

    if (!user) {
      return res.status(403).json({
        status: 403,
        message: " User does not exists",
      });
    }

    //@ts-ignore
    const secret = process.env.secretOrPrivateKey + user?.password;
    const payload = {
      email,
      //@ts-ignore
      id: user.id,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    const link = `${
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_LOCAL_HOST
        : process.env.PROD_HOST
    }/reset-password/${user._id}/${token}`;

    const data = {
      from: "noreply@automationlounge.com",
      to: email,
      subject: "Password reset",
      html: `
        <h2> Pls click on the link bellow to reset your password</h2>
        <p><a href=${link} > Click here to reset your Password </a></p>
        <p>${link}</p>
      `,
    };
    log.info("<<< link generated >>>");

    //nodeMailer implementation
    const mailOptions = {
      from: process.env.EMAIL_DOMAIN, // sender address
      to: data.to, // sender
      subject: data.subject, // Subject line
      html: data.html, // plain text body
    };

    const msg = await transporter.sendMail(mailOptions);

    log.info("<<< Reset link sent to user mail >>>");

    if (!msg) {
      return res.status(500).json({
        status: 500,
        message: "Error sending email",
      });
    }

    return res.status(200).json({
      // msg,
      message: `Reset link sent to ${data.to} Successfully`,
    });
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(500).send(newError.message);
  }
};

// verifyPasswordHandler
export const resetUserPasswordHandler = async (req: Request, res: Response) => {
  try {
    console.log("got here");

    const userId = get(req.params, "id");
    const token = get(req.params, "token");
    const password = get(req.body, "password");
    console.log("params >>", req.params);

    const user = await findUser({ _id: userId });

    if (!user) {
      return res.status(403).json({
        status: 403,
        message: " User does not exists",
      });
    }

    //@ts-ignore
    const secret = process?.env?.secretOrPrivateKey + user?.password;
    //@ts-ignore
    const payload = jwt.verify(token, secret);
    //@ts-ignore
    const salt = await bcrypt.genSalt(
      parseInt(process.env.saltWorkFactor as string)
    );
    const hash = await bcrypt.hashSync(password, salt);
    const updatedUser = findAndUpdate(
      { _id: user._id },
      { password: hash },
      { new: true }
    );

    return res.status(200).json({
      updatedUser,
      message: "Successfully updated user password",
    });
  } catch (error) {
    const newError = error as any;
    log.error(newError);
    res.status(500).json({ message: newError.message });
  }
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  try {
    const userId = get(req, "params.id");
    const user = await findAndUpdate(
      { _id: userId },
      { $set: { deleted: true } },
      { new: true }
    );

    return res.status(201).json({
      status: 201,
      message: "user deleted successfully",
      user,
    });
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Oops, something went wrong. Please try again later!!",
    });
  }
};
