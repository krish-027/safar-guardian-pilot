import CryptoJS from 'crypto-js';

export const generateBlockchainHash = (data: string): string => {
  return CryptoJS.SHA256(data).toString();
};

export const generateTouristHash = (tourist: {
  fullName: string;
  documentType: string;
  documentNumber: string;
  timestamp: string;
}): string => {
  const dataString = `${tourist.fullName}-${tourist.documentType}-${tourist.documentNumber}-${tourist.timestamp}`;
  return generateBlockchainHash(dataString);
};