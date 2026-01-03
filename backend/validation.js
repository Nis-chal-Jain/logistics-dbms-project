const VALID_STATUSES = ['inprogress', 'delivered'];
const MAX_LR_NUMBER_LENGTH = 50;
const MAX_CITY_LENGTH = 100;

export const validateBillNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return { isValid: false, error: 'Bill_Number is required' };
  }

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return { isValid: false, error: 'Bill_Number must be a valid number' };
  }

  if (!Number.isInteger(numValue)) {
    return { isValid: false, error: 'Bill_Number must be an integer' };
  }

  if (numValue <= 0) {
    return { isValid: false, error: 'Bill_Number must be a positive integer' };
  }

  return { isValid: true, error: null };
};

export const validateLRNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return { isValid: false, error: 'LR_Number is required' };
  }

  if (typeof value !== 'string') {
    return { isValid: false, error: 'LR_Number must be a string' };
  }

  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    return { isValid: false, error: 'LR_Number cannot be empty or whitespace' };
  }

  if (trimmedValue.length > MAX_LR_NUMBER_LENGTH) {
    return {
      isValid: false,
      error: `LR_Number cannot exceed ${MAX_LR_NUMBER_LENGTH} characters`,
    };
  }

  return { isValid: true, error: null };
};

export const validateDateOfShipment = (value) => {
  if (value === undefined || value === null || value === '') {
    return { isValid: false, error: 'DateOfShipment is required' };
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'DateOfShipment must be a valid date' };
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) {
    return {
      isValid: false,
      error: 'DateOfShipment must be in YYYY-MM-DD format',
    };
  }

  return { isValid: true, error: null };
};

export const validateStatus = (value) => {
  if (value === undefined || value === null || value === '') {
    return { isValid: false, error: 'Status is required' };
  }

  if (typeof value !== 'string') {
    return { isValid: false, error: 'Status must be a string' };
  }

  const lowerValue = value.toLowerCase();
  if (!VALID_STATUSES.includes(lowerValue)) {
    return {
      isValid: false,
      error: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
    };
  }

  return { isValid: true, error: null };
};

export const validateCity = (value, fieldName) => {
  if (value === undefined || value === null || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (typeof value !== 'string') {
    return { isValid: false, error: `${fieldName} must be a string` };
  }

  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    return {
      isValid: false,
      error: `${fieldName} cannot be empty or whitespace`,
    };
  }

  if (trimmedValue.length > MAX_CITY_LENGTH) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${MAX_CITY_LENGTH} characters`,
    };
  }

  const cityRegex = /^[a-zA-Z\s\-']+$/;
  if (!cityRegex.test(trimmedValue)) {
    return {
      isValid: false,
      error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
    };
  }

  return { isValid: true, error: null };
};

export const validateShipment = (shipment) => {
  const errors = [];

  if (!shipment || typeof shipment !== 'object') {
    return {
      isValid: false,
      errors: ['Invalid shipment data: must be an object'],
    };
  }

  const allowedFields = [
    'Bill_Number',
    'LR_Number',
    'DateOfShipment',
    'Status',
    'Sender_City',
    'Receiver_City',
  ];
  const extraFields = Object.keys(shipment).filter(
    (key) => !allowedFields.includes(key)
  );
  if (extraFields.length > 0) {
    errors.push(`Unexpected fields: ${extraFields.join(', ')}`);
  }

  const billNumberValidation = validateBillNumber(shipment.Bill_Number);
  if (!billNumberValidation.isValid) {
    errors.push(billNumberValidation.error);
  }

  const lrNumberValidation = validateLRNumber(shipment.LR_Number);
  if (!lrNumberValidation.isValid) {
    errors.push(lrNumberValidation.error);
  }

  const dateValidation = validateDateOfShipment(shipment.DateOfShipment);
  if (!dateValidation.isValid) {
    errors.push(dateValidation.error);
  }

  const statusValidation = validateStatus(shipment.Status);
  if (!statusValidation.isValid) {
    errors.push(statusValidation.error);
  }

  const senderCityValidation = validateCity(shipment.Sender_City, 'Sender_City');
  if (!senderCityValidation.isValid) {
    errors.push(senderCityValidation.error);
  }

  const receiverCityValidation = validateCity(
    shipment.Receiver_City,
    'Receiver_City'
  );
  if (!receiverCityValidation.isValid) {
    errors.push(receiverCityValidation.error);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateShipmentMiddleware = (req, res, next) => {
  const validation = validateShipment(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      error: 'Validation failed',
      details: validation.errors,
    });
  }

  req.body.Bill_Number = Number(req.body.Bill_Number);
  req.body.LR_Number = req.body.LR_Number.trim();
  req.body.Status = req.body.Status.toLowerCase();
  req.body.Sender_City = req.body.Sender_City.trim();
  req.body.Receiver_City = req.body.Receiver_City.trim();

  next();
};
