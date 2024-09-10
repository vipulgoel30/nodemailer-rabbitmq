// Core imports
import { readFileSync } from "fs";

// Third party imports
import { createTransport, Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

// User imports
import retryAsync, { INFINITE } from "./retryAsync.js";
import errorLogger from "./errorLogger.js";

let transport: Transporter | undefined = undefined;
let isTransportInitializing: boolean = true;

const initTransport = async (): Promise<void> => {
  try {
    isTransportInitializing = true;
    transport = await retryAsync<Transporter>(
      async () => {
        const transport: Transporter | undefined = createTransport({
          host: process.env.NODEMAILER_HOST,
          auth: { user: process.env.NODEMAILER_AUTH_USER, pass: process.env.NODEMAILER_AUTH_PASS },
          ...(process.env.NODE_ENV === "dev"
            ? { port: parseInt(process.env.NODEMAILER_PORT) }
            : { service: process.env.NODEMAILER_SERVICE }),
        });

        await transport.verify();
        return transport;
      },
      INFINITE,
      5,
      50
    );
    isTransportInitializing = false;
  } catch (err) {
    if (err instanceof Error) errorLogger(err, "Error in initTransport at nodemailer.ts", true);
  }
};

initTransport();

const sendMail = async (options: Mail.Options): Promise<boolean> => {
  try {
    await retryAsync(
      () => (transport ? transport.sendMail({}) : Promise.reject("Unable to find transport")),
      3,
      50,
      100,
      () => {
        if (!isTransportInitializing) {
          return initTransport();
        }
        return Promise.resolve("Transport is being initialized");
      }
    );
    return true;
  } catch (err) {
    return false;
  }
};

const verificationMailContent = readFileSync("./assets/verifyMail.html", "utf-8");

interface SendVerificationMailOptions {
  companyName: string;
  userName: string;
  link: string;
  resendLink: string;
  key: string;
}

const sendVerificationMail = (options: SendVerificationMailOptions) => {};

// setTimeout(() => {
//   sendMail({ to: "vipul@gmail.com", text: "qfgwqgu" });
// }, 2000);
