import {tool} from "@langchain/core/tools"
import { google } from "googleapis"
import { oauth2Client } from "../controllers/Auth.js";
import tokens from "../tokens.json" with { type: "json" };
import { it } from "zod/v4/locales";



let calendar = google.calendar({
    version : "v3",
    auth : oauth2Client,
});


oauth2Client.setCredentials(tokens)



export const getEvents = tool(
  async () => {
    let res = await calendar.events.list({
      calendarId: "vishalpandey1799@gmail.com",
    });

    

    let events = res?.data?.items?.map((item) => ({
      _id: item.id,
      summary: item.summary,
      start: item.start?.dateTime || item.start?.date,
      end: item.end?.dateTime || item.end?.date,
      description: item.description,
      organizer: item.organizer?.email, 
      organizerName: item.organizer?.displayName,
      eventType: item.eventType,
      attendees: item.attendees ? JSON.stringify(item.attendees) : null,
      location: item.location,
      meetingLink: item.hangoutLink,
      attachments: item.attachments,
      status: item.status,
    }));

   

    return JSON.stringify(events);  
  },

  {
    name: "getEvent",
    description: "Fetches events from Google Calendar",
    schema: ({}),
  }
);

       
export const createEvent = tool(
  async ({ start, end, summary, description, location, attendees, timeZone }) => {
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

    const response = await calendar.events.insert({
      calendarId: "vishalpandey1799@gmail.com",
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

