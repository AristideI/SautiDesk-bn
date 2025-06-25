import { Resend } from "resend";
const twilio = require("twilio");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const resendApiKey = process.env.RESEND_API_KEY;

const client = twilio(accountSid, authToken);
const resend = new Resend(resendApiKey);

export default {
  async send(ctx) {
    const { to, message } = ctx.request.body;

    if (!to || !message) {
      return ctx.badRequest('Missing "to" or "message" in request body');
    }

    try {
      const result = await client.messages.create({
        body: message,
        from: twilioNumber,
        to: to,
      });

      return ctx.send({ sid: result.sid });
    } catch (err) {
      return ctx.internalServerError(err.message);
    }
  },

  async mail(ctx) {
    const { to, subject, body } = ctx.request.body;

    if (!to || !subject || !body) {
      return ctx.badRequest(
        'Missing "to", "subject", or "html" in request body'
      );
    }

    try {
      const mailRes = await resend.emails.send({
        from: "onboarding@resend.dev",
        to,
        subject,
        html: body,
      });
      return ctx.send(mailRes);
    } catch (err) {
      return ctx.internalServerError(err.message);
    }
  },
};
