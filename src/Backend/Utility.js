import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import SimpleToast from 'react-native-simple-toast';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
export const DATE_FORMATE = 'YYYY-MM-DD';
export const isIos = Platform.OS === 'ios';

export const CURRENCY = '₹';

export const GOOGLE_API = 'AIzaSyDsRXO8vkZFS6TnnNs6i0MD_d_De7d5xqo';

export const razorpay_payment_id = 'pay_RMH4qyovNwBBqL';
export const razorpay_order_id = 'order_RMH4OwCW1KAScJ';
export const razorpay_signature = '2f1d5372d9853398655d94a9ddd21f289c2e7131f6689e10a0323502981e6cf3';

export const isValidEmail = email => regex.email.test(email);
export const isValidPassword = email => regex.email.test(email);
export const isValidPhone = phone => regex.phoneNumber.test(phone);

export const ToastMsg = (message, time = 100) => {
  let timeout = setTimeout(() => {
    SimpleToast.show(
      message
        ? message
        : 'Sorry, Something went wrong. Please try again later.',
      SimpleToast.LONG,
    );
    clearTimeout(timeout);
  }, 500);
};
export const RFV = e => {
  return e;
};
export const regex = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  phoneNumber: /^(0|[1-9][0-9]*)$/,
};
export const DefaultToast = title => {
  return Toast.show(title, Toast.SHORT);
};
export const formatError = obj => {
  let errorsData = {};
  for (const field in obj) {
    if (Object.hasOwnProperty.call(obj, field)) {
      errorsData[field] = '';
    }
  }
  return errorsData;
};
export const parseValues = data => {
  let parsedData = {};
  for (const field in data) {
    if (Object.hasOwnProperty.call(data, field)) {
      const value = data[field].value;
      parsedData[field] = value;
    }
  }
  return parsedData;
};
export const isValidValue = ({
  value = '',
  required = true,
  type = '',
  minimum = 0,
  maximum = 1000,
}) => {
  if (required) {
    if (!value) {
      return 'Please Enter Some Value';
    } else if (type === 'email') {
      return !isValidEmail(value) ? 'Please Enter Valid Email!' : '';
    } else if (type === 'phone') {
      return !isValidPhone(value) ? 'Please Enter Valid Phone Number!' : '';
    } else if (value.length < minimum) {
      return `Minimum length should be ${minimum}`;
    } else if (value.length > maximum) {
      return `Maximum length should be ${maximum}`;
    } else {
      return '';
    }
  } else {
    return '';
  }
};
export const isValidForm = (form = {}) => {
  let valid = true;
  for (const field in form) {
    if (Object.hasOwnProperty.call(form, field)) {
      const error = form[field];
      valid = valid && !error;
    }
  }
  return valid;
};
export function getRegionForCoordinates(points) {
  let minX, maxX, minY, maxY;
  (point => {
    minX = point.latitude;
    maxX = point.latitude;
    minY = point.longitude;
    maxY = point.longitude;
  })(points[0]);
  points.map(point => {
    minX = Math.min(minX, point.latitude);
    maxX = Math.max(maxX, point.latitude);
    minY = Math.min(minY, point.longitude);
    maxY = Math.max(maxY, point.longitude);
  });
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const deltaX = maxX - minX;
  const deltaY = maxY - minY;
  return {
    latitude: +midX,
    longitude: +midY,
    latitudeDelta: +deltaX,
    longitudeDelta: +deltaY,
  };
}
export const injectedJavaScript = `
const meta = document.createElement('meta');
meta.setAttribute('name', 'viewport');
meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
document.getElementsByTagName('head')[0].appendChild(meta);

document.addEventListener('touchstart', function(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });

document.addEventListener('gesturestart', function(event) {
  event.preventDefault();
});

true; // note: this is needed to return a true value, preventing issues in WebView
`;
export const Shadow = (elevation = 5) => {
  return Platform.select({
    android: {
      elevation,
    },
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: elevation,
      shadowOffset: {width: 0, height: elevation / 2},
    },
  });
};
export const getCountryDetails = addList => {
  if (addList) {
    let countryCode = '';
    let city = '';
    let leval = '';
    let state = '';
    let postalCode = '';

    for (var i = 0; i < addList.length; i++) {
      var addressType = addList[i].types[0];
      if (addressType == 'country') {
        countryCode = addList[i].short_name;
      }
      if (addressType == 'administrative_area_level_1') {
        state = addList[i].long_name;
      }
      if (addressType == 'postal_code') {
        postalCode = addList[i].short_name;
      }
      if (addList[i].types[0] == 'locality' && city == '') {
        city = addList[i].long_name;
      }
      if (addList[i].types[0] == 'country') {
        country = addList[i].long_name;
      }
    }
    let add_data = {
      countrycode: countryCode,
      state: state,
      postalCode: postalCode,
      city: city,
      country: country,
    };
    return add_data;
  }
};
export const getCurrentLocation = async () => {
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      // Android: Request permissions using PermissionsAndroid
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission Required',
          message:
            'This app needs access to your location to provide better services.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Location permission denied');
      }
    } else if (Platform.OS === 'ios') {
      // iOS: Request permissions using react-native-permissions
      const permissionStatus = await request(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );
      if (permissionStatus !== RESULTS.GRANTED) {
        throw new Error('Location permission denied');
      }
    }
  };

  try {
    await requestPermissions();
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(position?.coords),
        error => reject(new Error(error.message || 'Error getting location')),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  } catch (error) {
    throw new Error(error.message || 'Error checking location permissions');
  }
};
export const getNextAvailableDate = (selectedDate, location_id) => {
  if (!location_id?.provider_availability?.length) return null;

  const now = new Date();
  const selected = new Date(selectedDate);
  const currentMonth = selected.getMonth(); // 0-based (July = 6)
  const currentYear = selected.getFullYear();

  const availability = [...location_id.provider_availability].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  for (let i = 0; i < availability.length; i++) {
    const day = availability[i];
    const dayDate = new Date(day.date);

    // ✅ Only allow same month and year
    if (
      dayDate.getFullYear() === currentYear &&
      dayDate.getMonth() === currentMonth &&
      day.date >= selectedDate
    ) {
      let validSlots = [];

      if (day.date === now.toISOString().split('T')[0]) {
        // today: only future slots
        validSlots = day.time_slot.filter(slot => {
          const slotStart = new Date(`${day.date}T${slot.start_time}`);
          return slotStart > now;
        });
      } else {
        validSlots = day.time_slot;
      }
      if (validSlots.length > 0) {
        return day.date;
      }
    }
  }
  return null; // No next available date in current month
};
export const cleanImageUrl = url => {
  if (!url) return null;

  // If HTTPS fails, try forcing HTTP
  let cleanedUrl = url.replace(/(https?:\/\/[^\/]+)\/\//, '$1/');

  // If URL starts with https but we know it might fail, try http
  if (
    cleanedUrl.startsWith('https://') &&
    url.includes('lemonchiffon-walrus-503913.hostingersite.com')
  ) {
    cleanedUrl = cleanedUrl.replace('https://', 'http://');
  }

  return cleanedUrl;
};
// utils/ShopStatus.js

export const isShopOpen = (workingDays, dailyStartTime, dailyEndTime) => {
  const now = new Date();
  
  // Get current day in lowercase (e.g., 'monday')
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
  
  // Get current time in HH:MM format (24-hour)
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM
  
  // Check if current day is in working days
  const isWorkingDay = workingDays?.includes(currentDay);
  
  if (!isWorkingDay) {
    return {
      isOpen: false,
      reason: 'closed_today',
      nextOpening: getNextOpening(workingDays, dailyStartTime)
    };
  }
  
  // Check if current time is within working hours
  if (currentTime < dailyStartTime) {
    return {
      isOpen: false,
      reason: 'opens_later',
      nextOpening: `Opens at ${formatTime(dailyStartTime)} today`
    };
  }
  
  if (currentTime > dailyEndTime) {
    return {
      isOpen: false,
      reason: 'closed_for_today',
      nextOpening: getNextOpening(workingDays, dailyStartTime, currentDay)
    };
  }
  
  return {
    isOpen: true,
    reason: 'open',
    closingTime: `Closes at ${formatTime(dailyEndTime)}`
  };
};

const getNextOpening = (workingDays, dailyStartTime, currentDay = null) => {
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const now = new Date();
  const currentDayIndex = currentDay ? daysOfWeek.indexOf(currentDay) : now.getDay();
  
  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDayIndex + i) % 7;
    const nextDay = daysOfWeek[nextDayIndex];
    
    if (workingDays?.includes(nextDay)) {
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + i);
      
      if (i === 1 && currentDay === nextDay) {
        return `Opens at ${formatTime(dailyStartTime)} tomorrow`;
      } else if (i === 1) {
        return `Opens at ${formatTime(dailyStartTime)} tomorrow`;
      } else {
        const dayName = nextDate.toLocaleString('en-US', { weekday: 'long' });
        return `Opens on ${dayName} at ${formatTime(dailyStartTime)}`;
      }
    }
  }
  
  return 'Closed indefinitely';
};

const formatTime = (timeString) => {
  // Convert "18:00" to "6:00 PM"
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

// Additional helper to get current status message
export const getShopStatusMessage = (shopStatus) => {
  if (shopStatus.isOpen) {
    return `Open now • ${shopStatus.closingTime}`;
  }
  
  switch (shopStatus.reason) {
    case 'closed_today':
      return `Closed today • ${shopStatus.nextOpening}`;
    case 'opens_later':
      return `Closed • ${shopStatus.nextOpening}`;
    case 'closed_for_today':
      return `Closed • ${shopStatus.nextOpening}`;
    default:
      return 'Currently closed';
  }
};