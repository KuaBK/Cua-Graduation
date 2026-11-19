const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.status(200).json({ success: false, error: 'DATABASE_URL not set' });
  }

  const sql = neon(dbUrl);

  try {
    const body = req.body || {};
    const guestName = (body.guest_name || 'Ẩn danh').trim();
    const action = (body.action || 'click').trim();
    const details = (body.details || '').trim();
    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    await sql.query(
      'INSERT INTO guest_clicks (guest_name, action, details, user_agent, ip_address) VALUES ($1, $2, $3, $4, $5);',
      [guestName, action, details, userAgent, clientIp]
    );
    return res.status(200).json({ success: true, tracked: true });
  } catch (err) {
    return res.status(200).json({ success: false, error: err.message });
  }
};
