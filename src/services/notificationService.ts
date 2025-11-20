export const notificationService = {
  requestPermission: async () => {
    return 'granted';
  },
  sendNotification: (title: string, body: string) => {
    console.log('Notification:', title, body);
  },
  isEnabled: false,
  sendHealthyChoiceCongrats: (productName: string) => {
    console.log('Healthy choice:', productName);
  },
  sendUnhealthyWarning: (productName: string) => {
    console.log('Unhealthy warning:', productName);
  },
};
