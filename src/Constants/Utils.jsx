import {Linking, Share} from 'react-native';

export const handleOpenMap = address => {
  const encodedAddress = encodeURIComponent(address);

  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?q=${encodedAddress}`
      : `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  Linking.openURL(url).catch(err => console.error('Error opening map', err));
};

 export const handleCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;

    Linking.openURL(url).catch(err =>
      console.error('Failed to open dialer:', err),
    );
  };

  export const openMapWithDirections = (destination) => {
   

    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${destination}`,
      android: `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`,
    });

    Linking.openURL(url).catch(err =>
      console.error('Error launching map:', err),
    );
  };

 export const onShare = async (message) => {
    try {
      const result = await Share.share({
        message: message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Text shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };
