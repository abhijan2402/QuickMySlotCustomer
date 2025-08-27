import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const RFV = e => {
  return e;
};
export const showToast = message => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    // ToastMsg(message);
  }
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
export const isValidEmail = email => regex.email.test(email);
export const isValidPassword = email => regex.email.test(email);
export const isValidPhone = phone => regex.phoneNumber.test(phone);

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
export const isIos = Platform.OS === 'ios';

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
export const DATE_FORMATE = 'YYYY-MM-DD';

export const CURRENCY = '$';

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

//find possible slots
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
