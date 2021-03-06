import { config } from "../config/config";
import gmail from "gmail-send";
import crypto from "crypto-random-string";

export async function sendVerificationEmail(receiver: string, verificationCode: string): Promise<void> {
    const user = config.emailUser;
    const password = config.emailAppPassword;
    const sender = config.emailSender;
    const cc = config.emailCc;

    const verificationUrl = config.portalBackendBaseUrl + "/v1/auth/verifyEmail/" + verificationCode + "/" + encodeURIComponent(config.emailVerificationRedirectUrl);

    const msgBody = "Klik op de onderstaande link op jouw account te activeren<br><br>" +
        "<a href='" + verificationUrl + "'>Account activeren</a>"

    const message = msgBody;

    /* eslint @typescript-eslint/no-var-requires: 1 */
    const send = await gmail({
        user: user,                              // Your GMail account used to send emails
        pass: password,                          // Application-specific password
        to: [receiver],
        cc: cc,
        from: sender,                            // from: by default equals to user
        replyTo: sender,                         // replyTo: by default `undefined`
        subject: "Verficiation code",
        html: message                            // HTML
    });

    send({}, function (err: unknown, res: unknown) {
        if (err) return console.log("* sendEmail() callback returned: err:", err);
        console.log("* sendEmail() callback returned: res:", res);
    });
}

export async function sendRecoveryAccount(receiver: string, recoveryCode: string, cancelRecoveryCode: string): Promise<void> {
    const user = config.emailUser;
    const password = config.emailAppPassword;
    const sender = config.emailSender;
    const cc = config.emailCc;

    const recoveryUrl = config.portalBackendBaseUrl + "/v1/auth/recoverAccount/" + recoveryCode + "/" + encodeURIComponent(config.emailVerificationRedirectUrl);
    const cancelRecoveryUrl = config.portalBackendBaseUrl + "/v1/auth/cancelRecoverAccount/" + cancelRecoveryCode + "/" + encodeURIComponent(config.emailVerificationRedirectUrl);

    const msgBody = "Klik op de onderstaande link op jouw account te herstellen<br><br>" +
        "<a href='" + recoveryUrl + "'>Account herstellen</a> <br><br>" +
        "Klik op de onderstaande link om jouw account herstel te annuleren<br><br>" +
        "<a href='" + cancelRecoveryUrl + "'>Account herstel annuleren</a>"

    const message = msgBody;

    /* eslint @typescript-eslint/no-var-requires: 1 */
    const send = await gmail({
        user: user,                              // Your GMail account used to send emails
        pass: password,                          // Application-specific password
        to: [receiver],
        cc: cc,
        from: sender,                            // from: by default equals to user
        replyTo: sender,                         // replyTo: by default `undefined`
        subject: "Account recovery",
        html: message                            // HTML
    });

    send({}, function (err: unknown, res: unknown) {
        if (err) return console.log("* sendEmail() callback returned: err:", err);
        console.log("* sendEmail() callback returned: res:", res);
    });
}

export function createVerificationCode(): string {
    /* eslint @typescript-eslint/no-var-requires: 1 */
    const cryptoRandomString = crypto;
    return cryptoRandomString({length: 32, type: "url-safe"});
}

/**
 * Yes it's the same as the verification code but maybe we want to make it different somehow, keep the functions apart
 */
export function createRecoveryCode(): string {
    /* eslint @typescript-eslint/no-var-requires: 1 */
    const cryptoRandomString = crypto;
    return cryptoRandomString({length: 32, type: "url-safe"});
}

/**
 * Yes it's the same as the verification code but maybe we want to make it different somehow, keep the functions apart
 */
export function createRecoveryCancelCode(): string {
    /* eslint @typescript-eslint/no-var-requires: 1 */
    const cryptoRandomString = crypto;
    return cryptoRandomString({length: 32, type: "url-safe"});
}

export async function sendUserContactEmail(name: string, userMessage: string, userEmail: string): Promise<void> {
    const user = config.emailUser;
    const password = config.emailAppPassword;
    const cc = config.emailCc;

    const msgBody = name + " heeft een bericht gestuurd:<br><br>" +
        userMessage + "<br><br>"

    const message = msgBody;

    const send = await gmail({
        user: user,                              // Your GMail account used to send emails
        pass: password,                          // Application-specific password
        to: config.contactEmail,
        cc: cc,
        from: userEmail,                            // from: by default equals to user
        replyTo: userEmail,                         // replyTo: by default `undefined`
        subject: "Contact",
        html: message                            // HTML
    });

    send({}, function (err: unknown, res: unknown) {
        if (err) return console.log("* sendContactEmail() callback returned: err:", err);
        console.log("* sendContactEmail() callback returned: res:", res);
    });
}
