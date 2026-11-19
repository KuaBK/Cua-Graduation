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
    return res.status(500).json({ error: 'DATABASE_URL chưa được cấu hình trên Vercel' });
  }

  const sql = neon(dbUrl);

  if (req.method === 'GET') {
    try {
      const rows = await sql.query(
        'SELECT id, name, wish, color, rotation, attendance, created_at FROM wishes ORDER BY id DESC LIMIT 100;'
      );
      return res.status(200).json({ wishes: rows });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const name = (body.name || body.guest_name || '').trim();
      const wish = (body.wish || '').trim();
      const attendance = (body.attendance || body.status || 'attend').trim();

      if (!name) {
        return res.status(400).json({ error: 'Vui lòng nhập tên của bạn' });
      }

      await sql.query(
        'INSERT INTO rsvps (guest_name, status, wish) VALUES ($1, $2, $3);',
        [name, attendance, wish]
      );

      let newWish = null;
      if (wish) {
        const rotation = Number((Math.random() * 3.6 - 1.8).toFixed(1));
        const inserted = await sql.query(
          'INSERT INTO wishes (name, wish, rotation, attendance) VALUES ($1, $2, $3, $4) RETURNING id, name, wish, color, rotation, attendance, created_at;',
          [name, wish, rotation, attendance]
        );
        newWish = inserted[0] || null;
      }

      const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
      const userAgent = req.headers['user-agent'] || '';
      const details = `Tham dự: ${attendance} | Lời chúc: ${wish.slice(0, 45)}...`;

      await sql.query(
        'INSERT INTO guest_clicks (guest_name, action, details, user_agent, ip_address) VALUES ($1, $2, $3, $4, $5);',
        [name, 'unified_rsvp_wish', details, userAgent, clientIp]
      );

      return res.status(201).json({
        success: true,
        wish: newWish,
        attendance,
        name
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};

