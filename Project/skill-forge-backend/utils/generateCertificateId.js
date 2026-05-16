const crypto = require('crypto');

/**
 * Generates a unique certificate ID.
 * Format: SF-YYYYMM-XXXXXXXX (8 random uppercase alphanumeric chars)
 * Example: SF-202504-A3B7K2PQ
 */
const generateCertificateId = () => {
  const date = new Date();
  const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `SF-${yearMonth}-${random}`;
};

module.exports = generateCertificateId;
