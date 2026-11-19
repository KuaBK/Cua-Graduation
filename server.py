import os
import json
import random
from datetime import datetime
from flask import Flask, send_file, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor

# Tải biến môi trường từ file .env nếu có
def load_env():
    try:
        from dotenv import load_dotenv
        load_dotenv()
        return
    except ImportError:
        pass
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    if os.path.exists(env_path):
        try:
            with open(env_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
        except Exception:
            pass

load_env()

PORT = int(os.environ.get("PORT", 8080))
DB_URL = os.environ.get("DATABASE_URL")

def get_db_connection():
    if not DB_URL:
        raise ValueError("Lỗi: Không tìm thấy biến môi trường DATABASE_URL. Hãy thiết lập trong .env hoặc Vercel Environment Variables.")
    return psycopg2.connect(DB_URL, connect_timeout=10)

# Khởi tạo Flask App
app = Flask(__name__, static_folder='.', static_url_path='')
handler = app  # Xuất cả app và handler để Vercel nhận diện ngay lập tức

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

# Route phục vụ trang chủ index.html
@app.route('/')
def index():
    return send_file('index.html')

# Route API: Lấy danh sách lời chúc & Gửi lời chúc mới
@app.route('/api/wishes', methods=['GET', 'POST', 'OPTIONS'])
@app.route('/api/rsvp', methods=['POST', 'OPTIONS'])
def handle_wishes():
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

    # POST: Gửi phản hồi / lời chúc
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

# Route API: Theo dõi click theo tên
@app.route('/api/track-click', methods=['POST', 'OPTIONS'])
def handle_track_click():
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

# Route API: Thống kê số lượng lời chúc và tương tác
@app.route('/api/stats', methods=['GET'])
def handle_stats():
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

if __name__ == '__main__':
    print(f"Graduation app running on http://localhost:{PORT}")
    app.run(host='0.0.0.0', port=PORT, debug=False)
