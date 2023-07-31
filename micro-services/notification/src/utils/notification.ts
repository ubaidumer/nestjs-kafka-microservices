import { error } from 'console';
import * as firebaseAdmin from 'firebase-admin';

// function to send notifications to riders, customers or admins
export async function sendNotification(
  notification: {
    title: string;
    body: string;
  },
  data: {
    [key: string]: string;
  },
  registrationToken: string,
): Promise<void> {
  const message = {
    notification,
    data,
    token: registrationToken,
  };

  return new Promise((resolve, reject) => {
    firebaseAdmin
      .messaging()
      .send(message)
      .then((response) => {
        console.log(response, 'notification sent');
        resolve();
      })
      .catch((error) => {
        console.log('error sending notification;', error.message);
        resolve();
      });
  });
}

export async function sendCustomNotification(body: any): Promise<void> {
  return new Promise((resolve, reject) => {
    firebaseAdmin
      .messaging()
      .send(body)
      .then((response) => {
        console.log(response, 'notification sent');
        resolve();
      })
      .catch((error) => {
        console.log('error sending notification;', error.message);
        resolve();
      });
  });
}
