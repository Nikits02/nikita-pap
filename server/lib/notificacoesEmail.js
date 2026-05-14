import nodemailer from "nodemailer";

const EMAIL_ENABLED =
  Boolean(process.env.SMTP_HOST?.trim()) &&
  Boolean(process.env.SMTP_FROM?.trim());

let transporter = null;

function getTransporter() {
  if (!EMAIL_ENABLED) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    });
  }

  return transporter;
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const rawValue = String(value);
  const dateOnly = rawValue.slice(0, 10);
  const [year, month, day] = dateOnly.split("-");

  if (!year || !month || !day) {
    return rawValue;
  }

  return `${day}/${month}/${year}`;
}

function formatHour(value) {
  return value ? String(value).slice(0, 5) : "-";
}

function getTestDriveEmailContent(testDrive, status) {
  const vehicle = testDrive.vehicle_label || testDrive.vehicle_slug || "a viatura";
  const date = formatDate(testDrive.data_preferida);
  const hour = formatHour(testDrive.hora_preferida);

  if (status === "scheduled") {
    return {
      subject: "Test drive agendado",
      text: [
        `Olá ${testDrive.nome},`,
        "",
        `O seu test drive para ${vehicle} foi agendado para ${date} às ${hour}.`,
        "",
        "Caso precise de alterar alguma coisa, responda a este email ou contacte-nos.",
        "",
        "Nikita Motors",
      ].join("\n"),
    };
  }

  return {
    subject: "Test drive cancelado",
    text: [
      `Olá ${testDrive.nome},`,
      "",
      `O seu pedido de test drive para ${vehicle}, previsto para ${date} às ${hour}, foi cancelado.`,
      "",
      "Caso pretenda reagendar, responda a este email ou envie um novo pedido.",
      "",
      "Nikita Motors",
    ].join("\n"),
  };
}

function getTradeInEmailContent(tradeIn, status) {
  const vehicle = [tradeIn.marca, tradeIn.modelo].filter(Boolean).join(" ");

  if (status === "accepted") {
    return {
      subject: "Pedido de retoma aceite",
      text: [
        `Olá ${tradeIn.nome},`,
        "",
        `O seu pedido de retoma para ${vehicle || "a sua viatura"} foi aceite para avançarmos com a avaliação final.`,
        "",
        "A nossa equipa vai entrar em contacto para confirmar os próximos passos.",
        "",
        "Nikita Motors",
      ].join("\n"),
    };
  }

  return {
    subject: "Pedido de retoma recusado",
    text: [
      `Olá ${tradeIn.nome},`,
      "",
      `Após análise, não conseguimos aceitar o pedido de retoma para ${vehicle || "a sua viatura"} neste momento.`,
      "",
      "Caso pretenda esclarecer algum detalhe, responda a este email ou contacte-nos.",
      "",
      "Nikita Motors",
    ].join("\n"),
  };
}

function getFinanceEmailContent(financeRequest, status) {
  const vehicle = financeRequest.viatura || "a viatura pretendida";

  if (status === "accepted") {
    return {
      subject: "Pedido de financiamento aceite",
      text: [
        `Olá ${financeRequest.nome},`,
        "",
        `O seu pedido de financiamento para ${vehicle} foi aceite para avançarmos com o processo.`,
        "",
        "A nossa equipa vai entrar em contacto para confirmar os documentos e próximos passos.",
        "",
        "Nikita Motors",
      ].join("\n"),
    };
  }

  return {
    subject: "Pedido de financiamento recusado",
    text: [
      `Olá ${financeRequest.nome},`,
      "",
      `Após análise, o seu pedido de financiamento para ${vehicle} não foi aprovado neste momento.`,
      "",
      "Caso pretenda esclarecer algum detalhe, responda a este email ou contacte-nos.",
      "",
      "Nikita Motors",
    ].join("\n"),
  };
}

async function sendStatusEmail({ recipient, status, getContent }) {
  if (!["accepted", "rejected"].includes(status)) {
    return { skipped: true, reason: "unsupported-status" };
  }

  const mailTransporter = getTransporter();

  if (!mailTransporter) {
    return { skipped: true, reason: "email-not-configured" };
  }

  const { subject, text } = getContent(recipient, status);

  await mailTransporter.sendMail({
    from: process.env.SMTP_FROM,
    to: recipient.email,
    subject,
    text,
  });

  return { skipped: false };
}

export async function sendTestDriveStatusEmail(testDrive, status) {
  if (!["scheduled", "cancelled"].includes(status)) {
    return { skipped: true, reason: "unsupported-status" };
  }

  const mailTransporter = getTransporter();

  if (!mailTransporter) {
    return { skipped: true, reason: "email-not-configured" };
  }

  const { subject, text } = getTestDriveEmailContent(testDrive, status);

  await mailTransporter.sendMail({
    from: process.env.SMTP_FROM,
    to: testDrive.email,
    subject,
    text,
  });

  return { skipped: false };
}

export function sendTradeInStatusEmail(tradeIn, status) {
  return sendStatusEmail({
    recipient: tradeIn,
    status,
    getContent: getTradeInEmailContent,
  });
}

export function sendFinanceStatusEmail(financeRequest, status) {
  return sendStatusEmail({
    recipient: financeRequest,
    status,
    getContent: getFinanceEmailContent,
  });
}
