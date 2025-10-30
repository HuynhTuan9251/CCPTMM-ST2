const { Translate } = require('@google-cloud/translate').v2;
const logger = require('./logger');

const translate = new Translate({ key: process.env.GOOGLE_API_KEY });

const translateText = async (text, targetLang) => {
  if (targetLang === 'vi' || !text) return text;
  
  try {
    const [translation] = await translate.translate(text, targetLang);
    return translation;
  } catch (error) {
    logger.error(`Error translating "${text}" to ${targetLang}:`, error);
    return text;
  }
};

module.exports = {
  translateText
}; 