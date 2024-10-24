import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';
import { v4 as uuidv4 } from 'uuid';
// Set the API key from Firebase environment variables
sgMail.setApiKey(functions.config().sendgrid.api_key);

const FcDimancheEmail = 'fc-dimanche-squad@hotmail.com'

// Define the interface for the data structure
interface AppointmentData {
  name: string;  
  email: string;
  matchDate: string;
  matchTime: string;
  matchLocation: string;
  confirmationLink: string;
}

// Create an ICS file as a string
const createICS = (event: {
  uid: string;
  dtstamp: string;
  dtstart: string;
  dtend: string;
  summary: string;
  description: string;
  location: string;
  organizerName: string;
  organizerEmail: string;
  attendeeName: string; 
  attendeeEmail: string;
}) => {
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FC Dimanche//NONSGML v1.0//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${event.uid}
DTSTAMP:${event.dtstamp}
DTSTART:${event.dtstart}
DTEND:${event.dtend}
SUMMARY:${event.summary}
DESCRIPTION:${event.description}
LOCATION:${event.location}
ORGANIZER;CN=${event.organizerName}:MAILTO:${event.organizerEmail}
ATTENDEE;CN=${event.attendeeName}:MAILTO:${event.attendeeEmail}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
END:VCALENDAR`;
};

// Cloud Function to send appointment confirmation email
export const sendAppointmentConfirmation = functions.https.onCall(async (data: AppointmentData, context: any) => {
  // Validate the incoming data
  const { email, matchDate, matchTime, matchLocation, name, confirmationLink } = data;

  if (!email || !matchDate || !matchTime || !matchLocation || !name || !confirmationLink) {
    console.error('Missing required fields:', { email, matchDate, matchTime, matchLocation, name, confirmationLink });
    throw new functions.https.HttpsError('invalid-argument', 'All fields are required: email, matchDate, matchTime, matchLocation, name, confirmationLink');
  }

  const msg: any = {
    to: email,
    from: { name: "FC Dimanche", email: FcDimancheEmail}, 
    dynamic_template_data: {
      email: email,
      name: name,
      matchDate: matchDate,
      matchTime: matchTime,
      matchLocation: matchLocation,
      confirmationLink: confirmationLink,
    },
    template_id: 'd-9193aeac4a03463aae12211cc8b2b1c9'
  };

  try {
    // Send the email
    await sgMail.send(msg);
    return { success: true, message: "Confirmation email sent" };
  } catch (error: unknown) {
    // Checking if the error is an instance of Error
    if (error instanceof Error) {
      throw new functions.https.HttpsError(
        "internal",
        "Error sending email: " + error.message
      );
    } else {
      throw new functions.https.HttpsError(
        "internal",
        "An unexpected error occurred while sending email."
      );
    }
  }
});

export const sendLinkToPreviewMatch = functions.https.onCall(async (data:any, context: any) => {
  const { name, previewMatchLink, email } = data;

  if (!name || !previewMatchLink || !email) throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');

  const msg: any = {
    to: email, 
    from: { name: "FC Dimanche", email: FcDimancheEmail},
    dynamic_template_data: {
      email: email,
      name: name,
      previewMatchLink: previewMatchLink
    },
    template_id: 'd-37f219b7383244d2aaf4818b22791540'
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: "Preview Match link sent" };
  } catch (error) {
    console.error('Error sending email:', error);
    if (error instanceof Error) {
      throw new functions.https.HttpsError("internal", "Error sending email: " + error.message);
    } else {
      throw new functions.https.HttpsError("internal", "An unexpected error occurred while sending email.");
    }
  }
})

export const sendInvitationToCalendar = functions.https.onCall(async (data: any, context: any) => {

  const { organizerEmail, organizerName, attendeeName, attendeeEmail, matchDate, matchDateUnixTimeStamp, matchTime, matchLocation } = data;


  if (!organizerEmail || !organizerName || !attendeeName || !attendeeEmail || !matchDateUnixTimeStamp || !matchDate || !matchDateUnixTimeStamp || !matchTime || !matchLocation) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }

  const matchEnd = matchDateUnixTimeStamp + 90 * 60 * 1000;

  const event = {
    uid: uuidv4(),
    dtstamp: new Date().toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z',
    dtstart: new Date(matchDateUnixTimeStamp).toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z',
    dtend: new Date(matchEnd).toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z',
    summary: `Match organisé par ${organizerName}`,
    description: `Match de foot organisé par ${organizerName} à ${matchLocation}`,
    location: matchLocation || 'No location specified',
    organizerName: organizerName,
    organizerEmail: organizerEmail,
    attendeeName: attendeeName,
    attendeeEmail: attendeeEmail
  };

  const icsContent = createICS(event);

  const msg: any = {
    to: attendeeEmail,
    from: { name: "FC Dimanche", email: FcDimancheEmail},
    attachments: [
      {
        content: Buffer.from(icsContent).toString('base64'),
        filename: 'invite.ics',
        type: 'text/calendar',
        disposition: 'attachment',
      },
    ],
    dynamic_template_data: {
      email: attendeeEmail,
      name: attendeeName,
      matchDate: matchDate,
      matchTime: matchTime,
      matchLocation: matchLocation,
    },
    template_id: 'd-148379a63eac492eb6f53ba5eb33ace0',
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: "Invitation sent" };
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    if (error instanceof Error) {
      throw new functions.https.HttpsError("internal", "Error sending email: " + error.message);
    } else {
      throw new functions.https.HttpsError("internal", "An unexpected error occurred while sending email.");
    }
  }
});
