import SimpleToast from 'react-native-simple-toast';
import {createRef} from 'react';
import axios from 'axios';
import {store} from '../Redux/store';
export const toastRef = createRef();
const errorHandling = {
  validateStatus: function (status) {
    return status >= 200 && status <= 999;
  },
};

export const API =
  'http://lemonchiffon-walrus-503913.hostingersite.com/public/api/';
export const token = store.getState().Token;
export const statusMessage = {
  400: 'Invalid request format.',
  401: 'Invalid API Key.',
  403: 'The request is forbidden.',
  404: 'The specified resource could not be found.',
  405: 'You tried to access the resource with an invalid method.',
  500: 'We had a problem with our server. Try again later.',
  503: "We're temporarily offline for maintenance. Please try again later.",
};

const responseBack = (data, msg, status) => {
  return {
    data,
    msg,
    status,
  };
};

export const GET = async (
  route,
  onSuccess = () => {},
  onError = () => {},
  headers = {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
) => {
  try {
    axios({
      method: 'get',
      url: `${API}${route}`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...errorHandling,
    })
      .then(res => {
        if (res?.status == 200) {
          onSuccess(res?.data);
        } else {
          if (res.status in statusMessage) {
            onError({
              data: null,
              message: statusMessage[res.status],
              status: false,
            });
          }
          onError(res);
        }
      })
      .catch(err => {
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error'});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};
export const GET_WITH_TOKEN = async (
  route,
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
  headers = {},
  status = () => {},
) => {
  const tokenVal = store.getState().Token;
  try {
    await axios({
      method: 'get',
      url: `${API}${route}`,
      headers: {
        Authorization: `Bearer ${tokenVal}`,
        ...headers,
      },
      ...errorHandling,
    })
      .then(res => {
        if (res?.status == 200) {
          onSuccess(res?.data);
          return res?.data;
        } else {
          if (res?.status == 401) {
            updateUnAuthorizedError();
          }
          if (statusMessage[res?.status]) {
            // ToastMsg(`${statusMessage[res?.status]}`, 'danger');
          }
          onError(res);
          return res;
        }
      })
      .catch(err => {
        onError(err);
        return err;
      });
    return;
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error', error});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};
export const POST = async (
  route,
  body = {},
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
) => {
  try {
    axios({
      method: 'post',
      url: `${API}${route}`,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-device-id': '4984748',
      },
      validateStatus: function (status) {
        return status >= 200 && status <= 999; // default
      },
    })
      .then(res => {
        if (res?.status == 200) {
          onSuccess(res?.data);
        } else {
          onError(res?.data);
        }
      })
      .catch(err => {
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error'});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};
export const POST_FORM_DATA = async (
  route,
  body,
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
) => {
  const tokenVal = store.getState().Token;
  try {
    await axios({
      method: 'post',
      url: `${API}${route}`,
      data: body,
      headers: {
        Authorization: `Bearer ${tokenVal}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      validateStatus: function (status) {
        return status >= 200 && status <= 999; // default
      },
      ...errorHandling,
    })
      .then(res => {
        if (res?.status == 200 || res?.status == 201) {
          onSuccess(res?.data);
        } else {
          if (res?.status == 401) {
            updateUnAuthorizedError();
          }
          onError(res);
        }
      })
      .catch(err => {
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error'});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};
export const POST_WITH_TOKEN = async (
  route,
  body = {},
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
) => {
  const tokenVal = store.getState().Token;
  try {
    await axios({
      method: 'post',
      url: `${API}${route}`,
      data: body,
      headers: {
        Authorization: `Bearer ${tokenVal}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...errorHandling,
    })
      .then(res => {
        if (res?.status == 200) {
          onSuccess(res?.data);
        } else {
          if (res?.status == 401) {
            updateUnAuthorizedError();
          }
          onError(res);
        }
      })
      .catch(err => {
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error'});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};
export const PUT = async (
  route,
  body = {},
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
) => {
  try {
    axios({
      method: 'put',
      url: `${API}${route}`,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      validateStatus: function (status) {
        return status >= 200 && status < 501; // default
      },
    })
      .then(res => {
        if (res?.status == 200) {
          onSuccess(res?.data);
        } else {
          onError(res?.data);
        }
      })
      .catch(err => {
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error'});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};
export const DELETE_WITH_TOKEN = async (
  route,
  body = {},
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
  headers = {},
) => {
  const tokenVal = store.getState().Token;

  try {
    axios({
      method: 'delete',
      url: `${API}${route}`,
      data: body,
      headers: {
        Authorization: `Bearer ${tokenVal}`,
        ...headers,
      },
      ...errorHandling,
    })
      .then(res => {
        if (res?.status == 200) {
          onSuccess(res?.data);
        } else {
          if (res?.status == 401) {
            updateUnAuthorizedError();
          }
          onError(res);
        }
      })
      .catch(err => {
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error', error});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};
export const PUT_FORM_DATA = async (
  route,
  body,
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
) => {
  const tokenVal = store.getState().Token;

  try {
    axios({
      method: 'put',
      url: `${BASE_URL2}${route}`,
      data: body,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${tokenVal}`,
      },
      ...errorHandling,
    })
      .then(res => {
        if (res?.status == 200 || res?.status == 201) {
          onSuccess(res?.data);
        } else {
          if (res?.status == 401) {
            updateUnAuthorizedError();
          }
          onError(res);
        }
      })
      .catch(err => {
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error'});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};
export const PUT_WITH_TOKEN = async (
  route,
  body = {},
  onSuccess = () => {},
  onError = () => {},
  onFail = () => {
    SimpleToast.show('Check Network, Try Again.', SimpleToast.SHORT);
  },
) => {
  const tokenVal = store.getState().Token;
  try {
    axios({
      method: 'put',
      url: `${API}${route}`,
      data: body,
      headers: {
        Authorization: `Bearer ${tokenVal}`,
        'Content-Type': 'application/json',
      },
      ...errorHandling,
    })
      .then(res => {
        if (res?.status == 200) {
          onSuccess(res?.data);
        } else {
          if (res?.status == 401) {
            updateUnAuthorizedError();
          }
          onError(res);
        }
      })
      .catch(err => {
        onError(err);
      });
  } catch (error) {
    onFail({data: null, msg: 'Network Error', status: 'error'});
    return {data: null, msg: 'Network Error', status: 'error'};
  }
};
export function onErrorFound(res, onError) {
  const errorResponse = responseBack(null, statusMessage[res.status], 'error');
  onError(errorResponse);
  return errorResponse;
}
