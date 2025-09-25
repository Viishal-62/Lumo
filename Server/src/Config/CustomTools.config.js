import {tool} from "@langchain/core/tools"
import { google } from "googleapis"
import { oauth2Client } from "../controllers/Auth.js";
 
import puppeteer from "puppeteer";
import { generateHtml } from "../Templates/StyleOne.js";
import cloudinary from "./Cloudinary.js"; 
import fs from "fs";
import { getGoogleClient } from "../utils/Helper.js";
import { strict } from "assert";



 
 





 
 

export const getEvents = tool(
  async (input, toolData) => {
    // toolData contains { context, signal, runName, toolCall }
    const email = toolData.context?.email;  // extract email from context

    console.log("toolData:", toolData);
    console.log("email in tool:", email);

    if (!email) throw new Error("No user email provided to tool");

    const {calendar} = await getGoogleClient(email);
   

    const res = await calendar.events.list({
      calendarId: "primary",
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = res?.data?.items?.map(item => ({
      _id: item.id,
      summary: item.summary,
      start: item.start?.dateTime || item.start?.date,
      end: item.end?.dateTime || item.end?.date,
      description: item.description,
      organizer: item.organizer?.email,
      organizerName: item.organizer?.displayName,
    }));

    return JSON.stringify(events);
  },
  {
    name: "getEvent",
    description: "Fetches events from Google Calendar",
  }
);



       
export const createEvent = tool(
  async ({ start, end, summary, description, location, attendees, timeZone }, toolData) => {
    const event = {
      start: { dateTime: start, timeZone: timeZone || "UTC" },
      end: { dateTime: end, timeZone: timeZone || "UTC" },
      summary,
      description,
      location,
      attendees: (attendees || []).map(a => ({
        email: a.email,
        displayName: a.displayName,
      })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 30 },
          { method: "popup", minutes: 10 },
        ],
      },
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    console.log("Creating Event:", event);

    let {calendar} = await getGoogleClient(toolData?.context?.email)

    const response = await calendar.events.insert({
      calendarId: "primary",
      sendUpdates: "all",
      conferenceDataVersion: 1,
      requestBody: event,
    });

    console.log("Event Created:", response.data);

    // ✅ Return valid structured output for Groq
    return [
      
        JSON.stringify( {
          message: "Event created successfully",
          eventLink: response.data.htmlLink,
          meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || null,
          eventId: response.data.id,
        }),
   
    ];
  },

  {
    name: "createEvent",
    description: "Create a new Google Calendar event with attendees and Meet link",
    schema: {
      type: "object",
      properties: {
        start: { type: "string", description: "Event start datetime in ISO format" },
        end: { type: "string", description: "Event end datetime in ISO format" },
        timeZone: { type: "string", description: "IANA time zone (e.g., 'America/New_York')" },
        summary: { type: "string", description: "Title of the event" },
        description: { type: "string", description: "Description of the event" },
        location: { type: "string", description: "Location of the event" },
        attendees: {
          type: "array",
          items: {
            type: "object",
            properties: {
              email: { type: "string" },
              displayName: { type: "string" },
            },
          },
        },
      },
      required: ["start", "end", "summary"],
    },
  }
);

export const deleteEvent = tool(
  async ({ eventId } , toolData) => {
    try {

      let {calendar} = await getGoogleClient(toolData?.context?.email)
      const response = calendar.events.delete({
        calendarId: "primary",
        eventId,
      });

      console.log("Event Deleted:", response.data);

      // ✅ Return valid structured output for Groq
      return [
        JSON.stringify({
          message: "Event deleted successfully",
        }),
      ];
    } catch (error) {
      console.error("Error deleting event:", error);
      throw new Error("Failed to delete event");
    }
  },

  {
    name: "deleteEvent",
    description: "Delete a Google Calendar event",
    schema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "ID of the event to delete" },
      },
      required: ["eventId"],
    },
  }
);

export const editEvent = tool(
  async ({ eventId, start, end, summary, description, location, attendees, timeZone },toolData) => {
    const event = {
      start: { dateTime: start, timeZone: timeZone || "UTC" },
      end: { dateTime: end, timeZone: timeZone || "UTC" },
      summary,
      description,
      location,
      attendees: (attendees || []).map(a => ({
        email: a.email,
        displayName: a.displayName,
      })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 30 },
          { method: "popup", minutes: 10 },
        ],
      },
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    console.log("Updating Event:", event);

      let {calendar} = await getGoogleClient(toolData?.context?.email)


    const response = calendar.events.update({
      calendarId: "vishalpandey1799@gmail.com",
      eventId,
      sendUpdates: "all",
      conferenceDataVersion: 1,
      requestBody: event,
    });

    console.log("Event Updated:", response.data);

    // ✅ Return valid structured output for Groq
    return [
      JSON.stringify({
        message: "Event updated successfully",
        eventLink: response.data.htmlLink,
        meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || null,
        eventId: response.data.id,
      }),
    ];
  },

  {
    name: "editEvent",
    description: "Edit a Google Calendar event with attendees and Meet link",
    schema: {
      type: "object",
      properties: {
        eventId: { type: "string", description: "ID of the event to edit" },
        start: { type: "string", description: "Event start datetime in ISO format" },
        end: { type: "string", description: "Event end datetime in ISO format" },
        timeZone: { type: "string", description: "IANA time zone (e.g., 'America/New_York')" },
        summary: { type: "string", description: "Title of the event" },
        description: { type: "string", description: "Description of the event" },
        location: { type: "string", description: "Location of the event" },
        attendees: {
          type: "array",
          items: {
            type: "object",
            properties: {
              email: { type: "string" },
              displayName: { type: "string" },  
            },
          },
        },
      },
      required: ["eventId"],
    },
  }
);



// excel sheets 

export const createSheet = tool(
  async ({ title, rows }, toolData) => {
    // 1️⃣ Create the new spreadsheet
    const createResponse = await excelsheet.spreadsheets.create({
      requestBody: {
        properties: {
          title,
         
        },
      },
    });

    const spreadsheetId = createResponse.data.spreadsheetId;

    // 2️⃣ Insert data dynamically (if rows are provided)
    if (rows && rows.length > 0) {
      // Calculate range automatically: e.g., if 4 columns, end at D, etc.
      const numCols = rows[0].length;
      const endColumnLetter = String.fromCharCode(64 + numCols); // 65 = 'A', so A + numCols-1
      const range = `Sheet1!A1:${endColumnLetter}${rows.length}`;


      let {sheets} = await getGoogleClient(toolData?.context?.email)


      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        requestBody: {
          values: rows,
        },
      });
    }

    console.log("Sheet created successfully", spreadsheetId);

    return [
      JSON.stringify({
        message: "Sheet created successfully with data inserted (if provided)",
        sheetId: spreadsheetId,
        sheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
      }),
    ];
  },
{
    name: "createSheet",
    description: "Create a new Google Sheet and optionally insert rows of data",
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        rows: {
          type: "array",
          items: {
            type: "array",
            items: { type: "string" }
          }
        },
      },
      required: ["title"],
    },
    strict: true,   
  }
);


export const updateSheet = tool(
  async ({ spreadsheetId, range, values } , toolData) => {
    // Update the specified range with new values

      let {sheets} = await getGoogleClient(toolData?.context?.email)

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });

    console.log("Sheet updated successfully");  

    return [
      JSON.stringify({
        message: "Sheet updated successfully",
        sheetId: spreadsheetId,
        sheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
      }),             
    ];   
  },
  {
    name: "updateSheet",
    description: "Update a Google Sheet with new data",
    schema: {
      type: "object",
      properties: {
        spreadsheetId: { type: "string", description: "ID of the sheet to update" },
        range: { type: "string", description: "Range of the sheet to update (e.g., 'Sheet1!A1:C3')" },
        values: {
          type: "array",
          items: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
      required: ["spreadsheetId", "range", "values"],
    },
  }
);

export const getSheet = tool(
  async ({ spreadsheetId, range } , toolData) => {

    let {sheets} = await getGoogleClient(toolData?.context?.email)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = response.data.values;

    return [
      JSON.stringify({
        message: "Sheet data retrieved successfully",
        sheetId: spreadsheetId,
        sheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
        data: values,
      }),       
    ];
  },
  {
    name: "getSheet",
    description: "Get data from a Google Sheet",
    schema: {
      type: "object",
      properties: {
        spreadsheetId: { type: "string", description: "ID of the sheet to retrieve" },
        range: { type: "string", description: "Range of the sheet to retrieve (e.g., 'Sheet1!A1:C3')" },
      },
      required: ["spreadsheetId", "range"],
    },
  }
);

export const deleteSheet = tool(
  async ({ spreadsheetId } , toolData) => {

    const {sheets} = await getGoogleClient(toolData?.context?.email)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteSheet: {
              sheetId: 0, // 0-based index of the sheet to delete
            },
          },          
        ],
      },
    });

    return [
      JSON.stringify({
        message: "Sheet deleted successfully",
        sheetId: spreadsheetId,
        sheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
      }),       
    ];
  },
  {
    name: "deleteSheet",
    description: "Delete a Google Sheet",
    schema: {
      type: "object",
      properties: {
        spreadsheetId: { type: "string", description: "ID of the sheet to delete" },
      },
      required: ["spreadsheetId"],
    },
  }
);

/**
 * In next update i will add more excel tool so you can get all shits and than delete for now just 
 */
 


/**
 * Now email tools
 */


export const getEmails = tool(
  async ({ query } , toolData) => {
    // Step 1: List messages

    const {gmail} = await getGoogleClient(toolData?.context?.email)
    const res = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: 15, // optional limit
    });

    if (!res.data.messages || res.data.messages.length === 0) {
      return JSON.stringify([]); // No emails found
    }

    // Fetch details for each message
    const messagePromises = res.data.messages.map(async (msg) => {
      const detail = await emails.users.messages.get({
        userId: "me",
        id: msg.id,
      });

      const headers = detail.data.payload.headers;
      const subject =
        headers.find((h) => h.name === "Subject")?.value || "(No Subject)";
      const from = headers.find((h) => h.name === "From")?.value || "(Unknown)";
      const snippet = detail.data.snippet;

      return {
        id: msg.id,
        subject,
        from,
        snippet,
      };
    });

    const messages = await Promise.all(messagePromises);

    return JSON.stringify(messages);
  },
  {
    name: "getEmails",
    description: "Get Emails from Gmail",
    schema: () => ({
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Query to search emails (e.g. 'is:unread', 'from:xyz@gmail.com')",
        },
      },
    }),
  }
);


export const llmEmailAutomation = tool(
  async ({ to, subject, llmDraft, action, draftId } , toolData) => {
    /**
     * Parameters:
     * to: recipient email
     * subject: email subject
     * llmDraft: initial email content from LLM
     * action: "create", "update", "send"
     * draftId: optional, required for "update" or "send"
     */

    // Helper to encode message in Base64 URL-safe

    const {gmail} = await getGoogleClient(toolData?.context?.email)

    const encodeMessage = (message) => {
      return Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    };

    if (action === 'create') {
      // 1️ Create a draft
      const rawMessage = encodeMessage(
        `To: ${to}\nSubject: ${subject}\nMIME-Version: 1.0\nContent-Type: text/plain; charset=utf-8\n\n${llmDraft}`
      );



      const draft = await gmail.users.drafts.create({
        userId: 'me',
        requestBody: {
          message: { raw: rawMessage },
        },
      });

      return {
        status: 'Draft created',
        draftId: draft.data.id,
        preview: llmDraft,
      };
    }

    if (action === 'update') {
      if (!draftId) throw new Error('draftId is required for update');

      // 2️. Update existing draft
      const rawMessage = encodeMessage(
        `To: ${to}\nSubject: ${subject}\nMIME-Version: 1.0\nContent-Type: text/plain; charset=utf-8\n\n${llmDraft}`
      );

      const updatedDraft = await gmail.users.drafts.update({
        userId: 'me',
        id: draftId,
        requestBody: { message: { raw: rawMessage } },
      });

      return {
        status: 'Draft updated',
        draftId: updatedDraft.data.id,
        preview: llmDraft,
      };
    }

    if (action === 'send') {
      if (!draftId) throw new Error('draftId is required for send');

      // 3️ Send the draft
      const sent = await gmail.users.drafts.send({
        userId: 'me',
        requestBody: { id: draftId },
      });

      return {
        status: 'Email sent successfully',
        id: sent.data.id,
        threadId: sent.data.threadId,
      };
    }

    throw new Error('Invalid action. Use "create", "update", or "send".');
  },
  {
    name: 'llmEmailAutomation',
    description:
      'Automated Gmail tool: create, preview, update, and send emails drafted by an LLM',
    schema:  ({
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient email address' },
        subject: { type: 'string', description: 'Email subject' },
        llmDraft: { type: 'string', description: 'Email content generated by LLM' },
        action: {
          type: 'string',
          description: 'Action to perform: "create", "update", "send"',
        },
        draftId: {
          type: 'string',
          description:
            'Draft ID (required for "update" or "send"; ignored for "create")',
        },
      },
      required: ['to', 'subject', 'llmDraft', 'action'],
    }),
  }
);

 


 



/**
 * Youtube tools
 */


export const createPlaylist = tool(
  async ({ title, description, privacyStatus, videoIds }, toolData) => {
    // 1. Create the playlist

    const {youtube} = await getGoogleClient(toolData?.context?.email)

    const playlistRes = await youtube.playlists.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: { title, description },
        status: { privacyStatus: privacyStatus || "private" },
      },
    });



    const playlistId = playlistRes.data.id;

    // 2. Add videos if provided
    if (videoIds && videoIds.length > 0) {
      for (const videoId of videoIds) {
        await youtube.playlistItems.insert({
          part: ["snippet"],
          requestBody: {
            snippet: {
              playlistId,
              resourceId: {
                kind: "youtube#video",
                videoId,
              },
            },
          },
        });
      }
    }

    // 3. Return result
    return [
      JSON.stringify({
        message: "Playlist created successfully",
        playlistId,
        playlistUrl: `https://www.youtube.com/playlist?list=${playlistId}`,
        videosAdded: videoIds ? videoIds.length : 0,
      }),
    ];
  },
  {
    name: "createPlaylist",
    description: "Create a new playlist on YouTube and optionally add videos",
    schema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Title of the playlist" },
        description: { type: "string", description: "Description of the playlist" },
        privacyStatus: {
          type: "string",
          description: "Privacy status of the playlist (public, private, or unlisted)",
        },
        videoIds: {
          type: "array",
          description: "Array of YouTube video IDs to add to the playlist",
          items: { type: "string" },
        },
      },
      required: ["title", "description"],
    },
  }
);



/**
 * Pdf generation
 */


export const generatePdf = tool(
  async ({ data, outputPath }) => {
    const { title, author, sections } = data;
 
    const html = generateHtml(title, author, sections);

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });
 
    const safeFileName = `${title.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_")}.pdf`;
    const localPath = outputPath || safeFileName;

    await page.pdf({
      path: localPath,
      format: "A4",
      printBackground: true,
      margin: { top: "40px", bottom: "40px", left: "40px", right: "40px" },
      displayHeaderFooter: true,
      headerTemplate: `<div style="width: 100%; text-align: center; font-size: 8pt; color: #718096; padding: 10px;">${title}</div>`,
      footerTemplate: `<div style="width: 100%; text-align: center; font-size: 8pt; color: #a0aec0; padding: 10px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`,
    });

    await browser.close();

    
    const uploadResult = await cloudinary.uploader.upload(localPath, {
      resource_type: "raw",  
      folder: "lumo_pdfs",  
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);

 
    return [uploadResult.secure_url];
  },

  {
    name: "professional_pdf_tool",
    description: "Generate a professional PDF and upload it to Cloudinary",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "object",
          description: "Structured content for the PDF",
          properties: {
            title: { type: "string" },
            author: { type: "string" },
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  heading: { type: "string" },
                  content: {
                    oneOf: [
                      { type: "string" },
                      { type: "array", items: { type: "string" } },
                    ],
                  },
                },
                required: ["heading", "content"],
              },
            },
          },
          required: ["title", "author", "sections"],
        },
        outputPath: { type: "string" },
      },
      required: ["data"],
    },
  }
);







