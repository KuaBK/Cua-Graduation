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
    return res.status(500).json({ error: 'DATABASE_URL not set' });
  }

  const sql = neon(dbUrl);

  try {
    const wishesCount = await sql.query('SELECT COUNT(*) FROM wishes;');
    const clicksCount = await sql.query('SELECT COUNT(*) FROM guest_clicks;');
    const rsvpsCount = await sql.query('SELECT COUNT(*) FROM rsvps;');
    const recentClicks = await sql.query(
      'SELECT guest_name, action, details, created_at FROM guest_clicks ORDER BY id DESC LIMIT 10;'
    );

    return res.status(200).json({
      wishes_count: parseInt(wishesCount[0].count),
      clicks_count: parseInt(clicksCount[0].count),
      rsvps_count: parseInt(rsvpsCount[0].count),
      recent_clicks: recentClicks
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
