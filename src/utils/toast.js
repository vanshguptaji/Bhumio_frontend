import toast from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
  });
};

export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
  });
};

export const showLoading = (message) => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

export const updateToast = (id, message, type = 'success') => {
  toast.dismiss(id);
  if (type === 'success') {
    showSuccess(message);
  } else if (type === 'error') {
    showError(message);
  }
};
