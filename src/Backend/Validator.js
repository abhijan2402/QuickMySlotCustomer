export const VALIDATE = {
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  ALPHABET_ONLY: /^[a-zA-Z \s]*$/,
  NUMBER: /[0-9]$/,
  MOBILE: /^\+?[0-9\s\-()]{1,20}$/,
  STREET: /^[a-zA-Z0-9 '-.~!@#$%^&*()_+={}[];':"<>,.\s]*$/,
  PASSWORD: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  URL: /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i,
  OTP: /^[0,1,2,3,4]*$/,
};

export const validators = {
  checkAlphabet: (name, min, max, value) => {
    var min = min || 2;
    var max = max || 30;
    if (value) {
      if (!VALIDATE.ALPHABET_ONLY.test(value)) {
        return `${name} field is invalid.`;
      } else if (value.length < min || value.length > max) {
        return `${name} must be between ${min} to ${max} characters.`;
      }
      return null;
    } else {
      return `${name} field is required.`;
    }
  },

  checkAlphabetMaxLen: (name, max, value) => {
    var max = max || 30;
    if (value) {
      if (!VALIDATE.ALPHABET_ONLY.test(value)) {
        return `${name} field is invalid.`;
      } else if (value.length + 1 == max) {
        return `${name} can have ${max} characters.`;
      }
      return null;
    } else {
      return `${name} field is required.`;
    }
  },

  checkEmail: (name, value) => {
    if (value) {
      if (!VALIDATE.EMAIL.test(value)) {
        return `${name} field is invalid.`;
      } else {
        return null;
      }
    } else {
      return `${name} field is required.`;
    }
    return null;
  },

  checkNumber: (name, value) => {
    if (value) {
      if (!VALIDATE.MOBILE.test(value)) {
        return `${name} field is invalid.`;
      }
      return null;
    } else {
      return `${name} field is required.`;
    }
  },

  checkDigits: (name, value) => {
    if (value) {
      if (!VALIDATE.NUMBER.test(value)) {
        return `${name} field is invalid.`;
      }
      return null;
    } else {
      return `${name} field is required.`;
    }
  },

  checkPhoneNumberWithFixLength: (name, max, value) => {
    var max = max || 10;
    if (value) {
      if (!VALIDATE.MOBILE.test(value)) {
        return `${name} field is invalid.`;
      } else if (value.length != max) {
        return `${name} should be ${max} digits.`;
      }
      return null;
    } else {
      return `${name} field is required.`;
    }
  },

  checkPhoneNumber: (name, min, max, value) => {
    var min = min || 7;
    var max = max || 15;
    if (value) {
      if (!VALIDATE.MOBILE.test(value)) {
        return `${name} field is invalid.`;
      }
      return null;
    } else {
      return `${name} field should contain valid number.`;
    }
  },

  checkOptionalPhoneNumberWithFixLength: (name, max, value) => {
    var max = max || 10;
    if (value) {
      if (!VALIDATE.MOBILE.test(value)) {
        return `${name} field is invalid.`;
      } else if (value.length != max) {
        return `${name} should be ${max} digits.`;
      }
      return false;
    } else {
      return `${name} field is required.`;
    }
  },
  checkFixPhoneNumber: (name, value, min = 8, max = 15) => {
    if (!value) {
      return `${name} field is required.`;
    }

    if (!VALIDATE.MOBILE.test(value)) {
      return `${name} field is invalid.`;
    }

    if (value.length < min || value.length > max) {
      return `${name} should be between ${min} and ${max} digits.`;
    }

    return null;
  },
  wordCount: (name, value, min, max, words) => {
    var min = min || 1;
    var max = max || 300;
    var words = words || 50;
    if (value) {
      if (value.length < min || value.length > max) {
        return `${name} must be between ${min} to ${max} characters.`;
      }
      if (value.trim().split(/\s+/).length > words) {
        return `${name} must be between ${words} words.`;
      }
      return null;
    } else {
      return `${name} field is required.`;
    }
  },

  priceCheck: (name, value) => {
    if (value) {
      var test = value.split('');
      if (value <= 0) {
        return `${name} must be greater than zero.`;
      } else if (test.indexOf('.') >= 0) {
        return `${name} must not have decimal.`;
      }

      return null;
    } else {
      return `${name} field is required.`;
    }
  },

  checkNotNull: (name, min, max, value) => {
    var min = min || 10;
    var max = max || 100;

    if (value) {
      if (value < min || value > max) {
        showToast(`${name} must be between ${min} to ${max} AED.`, 'error');
        return false;
      }
      return true;
    } else {
      showToast(`${name} field is required.`, 'error');
      return false;
    }
  },

  checkRequire: (name, value) => {
    if (value) {
      return null;
    } else {
      return ` ${name} field is required.  `;
    }
  },
  checkMultiple: (name, value) => {
    if (value) {
      if (value?.length >= 4) {
        return '';
      } else {
        return `${name} field is invalid.`;
      }
    } else {
      return `${name} field is required.`;
    }
  },

  checkPassword: (name, value) => {
    if (value) {
      if (!VALIDATE.PASSWORD.test(value)) {
        return `${name} must be of 8 characters with atleast one uppercase, one lowercase, one number and one special character.`;
      }
      return '';
    } else {
      return `${name} field is required.`;
    }
  },

  checkMatch: (label, value, matchValue) => {
    // if (value2) {
    //   if (value === value2) {
    //     return '';
    //   } else {
    //     return `${name} and ${name2} does'nt match`;
    //   }
    // } else {
    //   return `${name2} field is required.`;
    // }
    if (!value || !value.trim()) {
      return `${label} is required`;
    }
    if (value !== matchValue) {
      return `Passwords do not match`;
    }
    return '';
  
  },

  checkStreet: (name, min, max, value) => {
    var min = min || 7;
    var max = max || 15;
    if (value) {
      if (VALIDATE.STREET.test(value)) {
        showToast(`${name} field is invalid.`, 'error');
        return false;
      } else if (value.length < min || value.length > max) {
        showToast(
          `${name} entered must be between ${min} to ${max} characters.`,
          'error',
        );
        return false;
      }
      return true;
    } else {
      showToast(`${name} field is required.`, 'error');
      return false;
    }
  },

  checkUrl: (name, value) => {
    if (value) {
      if (!VALIDATE.URL.test(value)) {
        return `${name} field is invalid.`;
      }
      return null;
    } else {
      return `${name} field is required.`;
    }
  },
  checkOtp: (name, value) => {
    if (value) {
      if (!VALIDATE.OTP.test(value)) {
        return `${name}field_is_invalid.`;
      }
      return null;
    } else {
      return `${name}field_is_required.`;
    }
    return null;
  },
  checkArrayLength: (name, value) => {
    if (value?.length > 0) {
      return null;
    } else {
      return `${name} field is required.`;
    }
    return null;
  },
};
