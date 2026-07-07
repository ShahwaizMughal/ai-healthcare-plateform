import { useState } from 'react';

/**
 * Custom React hook to manage form inputs, validations, error clearing, and resets.
 *
 * @param {object} initialValues - Initial field values dictionary
 * @param {function} [validate] - Optional custom validator callback mapping form values to error messages
 */
export const useForm = (initialValues, validate) => {
  const [formData, setFormData] = useState(initialValues);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear validation error when editing field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const resetForm = (newValues = initialValues) => {
    setFormData(newValues);
    setValidationErrors({});
  };

  const validateForm = () => {
    if (!validate) return true;
    const errors = validate(formData);
    setValidationErrors(errors || {});
    return !errors || Object.keys(errors).length === 0;
  };

  return {
    formData,
    setFormData,
    validationErrors,
    setValidationErrors,
    handleInputChange,
    resetForm,
    validateForm,
  };
};

export default useForm;
