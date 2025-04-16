import CryptoJS from 'crypto-js'

const SECRET_KEY = 'abdels';

export const generateHmacSignature = (payload) => {
    const message = JSON.stringify(payload);
    console.log('payload to sign ', message)
    return CryptoJS.HmacSHA256(message,SECRET_KEY).toString(CryptoJS.enc.Hex)
}