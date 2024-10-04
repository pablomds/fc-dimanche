import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';

// Set the API key from Firebase environment variables
sgMail.setApiKey(functions.config().sendgrid.api_key);

// Define the interface for the data structure
interface AppointmentData {
  name: string;  
  email: string;
  matchDate: string;
  matchTime: string;
  matchLocation: string;
  confirmationLink: string;
}

// Cloud Function to send appointment confirmation email
export const sendAppointmentConfirmation = functions.https.onCall(async (data: AppointmentData, context: any) => {
  // Validate the incoming data
  const { email, matchDate, matchTime, matchLocation, name, confirmationLink } = data;

  if (!email || !matchDate || !matchTime || !matchLocation || !name || !confirmationLink) {
    console.error('Missing required fields:', { email, matchDate, matchTime, matchLocation, name, confirmationLink });
    throw new functions.https.HttpsError('invalid-argument', 'All fields are required: email, appointmentDate, appointmentTime');
  }

  const msg: any = {
    to: email,
    from: 'pablosouza1998@hotmail.com', // Your verified sender email
    dynamic_template_data: {
      matchDate: matchDate,
      matchTime: matchTime,
      matchLocation: matchLocation,
      name: name,
      confirmationLink: confirmationLink
    },
    template_id: 'd-9193aeac4a03463aae12211cc8b2b1c9'
  };

  try {
    // Send the email
    await sgMail.send(msg);
    console.log("Email sent successfully to:", email);
    return { success: true, message: "Confirmation email sent" };
  } catch (error: unknown) {
    // Checking if the error is an instance of Error
    if (error instanceof Error) {
      console.error("Error sending email:", error.message);
      throw new functions.https.HttpsError(
        "internal",
        "Error sending email: " + error.message
      );
    } else {
      console.error("Error sending email:", error);
      throw new functions.https.HttpsError(
        "internal",
        "An unexpected error occurred while sending email."
      );
    }
  }
});
