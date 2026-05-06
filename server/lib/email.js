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
