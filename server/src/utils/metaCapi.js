const crypto = require('crypto');
const https  = require('https');

const PIXEL_ID   = '3483672531784182';
const API_VERSION = 'v19.0';

function sha256(value) {
  if (!value) return undefined;
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

function post(url, payload) {
  return new Promise((resolve, reject) => {
    const body    = JSON.stringify(payload);
    const urlObj  = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path:     urlObj.pathname + urlObj.search,
      method:   'POST',
      headers:  { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`CAPI HTTP ${res.statusCode}: ${data}`));
        else resolve(JSON.parse(data));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function sendEvent({ eventName, eventId, userData = {}, customData, eventSourceUrl, userAgent }) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    console.warn('[capi] META_CAPI_TOKEN not set — skipping');
    return;
  }

  const user_data = { client_user_agent: userAgent || 'Mozilla/5.0' };
  if (userData.email)     user_data.em          = sha256(userData.email);
  if (userData.firstName) user_data.fn          = sha256(userData.firstName);
  if (userData.userId)    user_data.external_id = sha256(String(userData.userId));
  if (userData.lastName)  user_data.ln = sha256(userData.lastName);

  const payload = {
    data: [{
      event_name:       eventName,
      event_time:       Math.floor(Date.now() / 1000),
      event_id:         eventId,
      event_source_url: eventSourceUrl || 'https://faaexaminations.com',
      action_source:    'website',
      user_data,
      ...(customData ? { custom_data: customData } : {}),
    }],
  };

  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${token}`;
  try {
    await post(url, payload);
    console.log(`[capi] ${eventName} sent (id: ${eventId})`);
  } catch (err) {
    console.error(`[capi] ${eventName} failed:`, err.message);
  }
}

exports.capiLead = ({ eventId, email, firstName, userId, userAgent }) =>
  sendEvent({
    eventName:       'Lead',
    eventId,
    userData:        { email, firstName, userId },
    userAgent,
    eventSourceUrl:  'https://faaexaminations.com/register',
  });

exports.capiPurchase = ({ eventId, email, firstName, userId, value = 24.99, currency = 'USD' }) =>
  sendEvent({
    eventName:      'Purchase',
    eventId,
    userData:       { email, firstName, userId },
    customData:     { value, currency },
    eventSourceUrl: 'https://faaexaminations.com/dashboard',
  });
