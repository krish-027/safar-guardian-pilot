import CryptoJS from 'crypto-js';

export const generateBlockchainHash = (data) => {
  return CryptoJS.SHA256(data).toString();
};

export const generateTouristHash = (tourist) => {
  const dataString = `${tourist.fullName}-${tourist.documentType}-${tourist.documentNumber}-${tourist.timestamp}`;
  return generateBlockchainHash(dataString);
};