import { REGEX } from '@constants/index';
import { FormError } from '@types/index';

export const validateEmail = (email: string): boolean => {
  return REGEX.EMAIL.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return REGEX.PHONE.test(phone);
};

export const validatePassword = (password: string): boolean => {
  return REGEX.PASSWORD.test(password);
};

export const validateRequired = (value: string | undefined | null): boolean => {
  return value !== undefined && value !== null && value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validateMatch = (value1: string, value2: string): boolean => {
  return value1 === value2;
};

export const validateIDNumber = (id: string): boolean => {
  return validateRequired(id) && id.length >= 5;
};

export const validateLoginForm = (idNumber: string, password: string): FormError[] => {
  const errors: FormError[] = [];

  if (!validateRequired(idNumber)) {
    errors.push({ field: 'idNumber', message: 'ID number is required' });
  } else if (!validateIDNumber(idNumber)) {
    errors.push({ field: 'idNumber', message: 'Invalid ID number format' });
  }

  if (!validateRequired(password)) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (!validateMinLength(password, 6)) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  return errors;
};

export const validateRegistrationForm = (formData: any): FormError[] => {
  const errors: FormError[] = [];

  if (!validateRequired(formData.fullName)) {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  }

  if (!validateRequired(formData.idNumber)) {
    errors.push({ field: 'idNumber', message: 'ID number is required' });
  } else if (!validateIDNumber(formData.idNumber)) {
    errors.push({ field: 'idNumber', message: 'Invalid ID number' });
  }

  if (!validateRequired(formData.phone)) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (!validatePhone(formData.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number' });
  }

  if (!validateRequired(formData.department)) {
    errors.push({ field: 'department', message: 'Department is required' });
  }

  if (!validateRequired(formData.semester)) {
    errors.push({ field: 'semester', message: 'Semester is required' });
  }

  if (!validateRequired(formData.password)) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (!validatePassword(formData.password)) {
    errors.push({
      field: 'password',
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    });
  }

  if (!validateMatch(formData.password, formData.confirmPassword)) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  return errors;
};

export const validatePasswordChange = (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): FormError[] => {
  const errors: FormError[] = [];

  if (!validateRequired(currentPassword)) {
    errors.push({ field: 'currentPassword', message: 'Current password is required' });
  }

  if (!validateRequired(newPassword)) {
    errors.push({ field: 'newPassword', message: 'New password is required' });
  } else if (!validatePassword(newPassword)) {
    errors.push({
      field: 'newPassword',
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    });
  }

  if (!validateMatch(newPassword, confirmPassword)) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  return errors;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
