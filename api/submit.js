import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN, // Your Notion integration token
});

const databaseId = process.env.NOTION_DATABASE_ID; // Your Notion database ID

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Grab fields including honeypot
  const { name, email, message, website } = req.body;

  // Honeypot check — if filled, reject immediately
  if (website && website.trim() !== "") {
    console.warn("Spam bot detected (honeypot field filled).");
    return res.status(400).json({ error: "Spam detected" });
  }

  // Required fields validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {``
              text: { content: name },
            },
          ],
        },
        Email: {
          email: email,
        },
        Message: {
          rich_text: [
            {
              text: { content: message },
            },
          ],
        },
        Date: {
          date: { start: new Date().toISOString() },
        },
      },
    });

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error saving to Notion:", error.body || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}