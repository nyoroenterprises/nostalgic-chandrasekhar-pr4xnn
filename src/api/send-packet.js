import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { carrier, broker, attachments, bankDetails } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const attachmentFiles = attachments.map((doc) => ({
      filename: doc.label + "-" + doc.url.split("/").pop(),
      path: doc.url,
    }));

    const bankSection = bankDetails
      ? `
      <h3 style="margin-top: 30px; color: #1d4ed8;">Bank Details</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr>
          <td style="padding: 8px; font-weight: bold;">Bank Name:</td>
          <td style="padding: 8px;">${bankDetails.bankName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Routing Number:</td>
          <td style="padding: 8px;">${bankDetails.routing}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Account Number:</td>
          <td style="padding: 8px;">${bankDetails.account}</td>
        </tr>
      </table>
      `
      : "";

    const documentsList = attachments
      .map(
        (doc) => `
        <li style="margin-bottom: 4px;">
          <strong>${doc.label}:</strong> ${
          doc.fileName || doc.url.split("/").pop()
        }
        </li>
      `
      )
      .join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #1d4ed8;">Carrier Packet Submission</h2>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Carrier Name:</td>
            <td style="padding: 8px;">${carrier.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">MC #:</td>
            <td style="padding: 8px;">${carrier.mc}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">DOT #:</td>
            <td style="padding: 8px;">${carrier.dot}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">EIN:</td>
            <td style="padding: 8px;">${carrier.ein}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Contact Name:</td>
            <td style="padding: 8px;">${carrier.contact}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Contact Email:</td>
            <td style="padding: 8px;">${carrier.email}</td>
          </tr>
        </table>

        ${bankSection}

        <h3 style="margin-top: 30px; color: #1d4ed8;">Attached Documents</h3>
        <ul style="margin-left: 20px; margin-top: 10px;">
          ${documentsList}
        </ul>

        <p style="margin-top: 30px;">All documents are attached for your review.</p>

        <p style="margin-top: 20px; font-size: 0.9em; color: #666;">This is an automated email from InstantCarrierPackets.com.</p>
      </div>
    `;

    const mailOptions = {
      from: `"Carrier Packet" <${process.env.EMAIL_USER}>`,
      to: broker.email,
      subject: `${carrier.name} Carrier Packet`,
      html: htmlContent,
      attachments: attachmentFiles,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({ error: "Email failed" });
  }
}
