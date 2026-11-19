from flask import Flask, jsonify, request
import os
import random
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)
handler = app

DB_URL = os.environ.get("DATABASE_URL")

def get_db_connection():
    if not DB_URL:
        raise ValueError("Chưa thiết lập biến môi trường DATABASE_URL trên Vercel.")
    return psycopg2.connect(DB_URL, connect_timeout=10)

@app.after_request
def add_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

@app.route('/api/wishes', methods=['GET', 'POST', 'OPTIONS'])
@app.route('/api/rsvp', methods=['POST', 'OPTIONS'])
def wishes():
    if request.method == 'OPTIONS':
        return '', 200

    if request.method == 'GET':
        try:
            with get_db_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        """
                        SELECT id, name, wish, color, rotation, attendance, created_at 
                        FROM wishes 
                        ORDER BY id DESC 
                        LIMIT 100;
                        """
                    )
                    rows = cur.fetchall()
                    return jsonify({"wishes": rows})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    data = request.get_json(silent=True) or {}
    name = (data.get('name') or data.get('guest_name') or '').strip()
    wish = (data.get('wish') or '').strip()
    attendance = (data.get('attendance') or data.get('status') or 'attend').strip()

    if not name:
        return jsonify({"error": "Vui lòng nhập tên của bạn"}), 400

    new_wish = None
    try:
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    INSERT INTO rsvps (guest_name, status, wish)
                    VALUES (%s, %s, %s);
                    """,
                    (name, attendance, wish)
                )

                if wish:
                    rotation = round(random.uniform(-1.8, 1.8), 1)
                    cur.execute(
                        """
                        INSERT INTO wishes (name, wish, rotation, attendance)
                        VALUES (%s, %s, %s, %s)
                        RETURNING id, name, wish, color, rotation, attendance, created_at;
                        """,
                        (name, wish, rotation, attendance)
                    )
                    new_wish = cur.fetchone()

                client_ip = request.headers.get('x-forwarded-for', '') or request.remote_addr or ''
                user_agent = request.headers.get('User-Agent', '')
                cur.execute(
                    """
                    INSERT INTO guest_clicks (guest_name, action, details, user_agent, ip_address)
                    VALUES (%s, %s, %s, %s, %s);
                    """,
                    (name, 'unified_rsvp_wish', f"Tham dự: {attendance} | Lời chúc: {wish[:45]}...", user_agent, client_ip)
                )
                conn.commit()

        return jsonify({
            "success": True,
            "wish": new_wish,
            "attendance": attendance,
            "name": name
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/track-click', methods=['POST', 'OPTIONS'])
def track_click():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json(silent=True) or {}
    guest_name = (data.get('guest_name') or 'Ẩn danh').strip()
    action = (data.get('action') or 'click').strip()
    details = (data.get('details') or '').strip()
    client_ip = request.headers.get('x-forwarded-for', '') or request.remote_addr or ''
    user_agent = request.headers.get('User-Agent', '')

    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO guest_clicks (guest_name, action, details, user_agent, ip_address)
                    VALUES (%s, %s, %s, %s, %s);
                    """,
                    (guest_name, action, details, user_agent, client_ip)
                )
                conn.commit()
        return jsonify({"success": True, "tracked": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/stats', methods=['GET'])
def stats():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT COUNT(*) FROM wishes;")
                wishes_count = cur.fetchone()[0]
                cur.execute("SELECT COUNT(*) FROM guest_clicks;")
                clicks_count = cur.fetchone()[0]
                cur.execute("SELECT COUNT(*) FROM rsvps;")
                rsvps_count = cur.fetchone()[0]

                cur.execute("SELECT guest_name, action, details, created_at FROM guest_clicks ORDER BY id DESC LIMIT 10;")
                recent_clicks = cur.fetchall()

                return jsonify({
                    "wishes_count": wishes_count,
                    "clicks_count": clicks_count,
                    "rsvps_count": rsvps_count,
                    "recent_clicks": recent_clicks
                })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

