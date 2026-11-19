from http.server import BaseHTTPRequestHandler
import json
import os
import random
import psycopg2
from psycopg2.extras import RealDictCursor

DB_URL = os.environ.get("DATABASE_URL")

def get_db_connection():
    if not DB_URL:
        raise ValueError("Chưa thiết lập biến môi trường DATABASE_URL.")
    return psycopg2.connect(DB_URL, connect_timeout=10)

class handler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, data, status_code=200):
        resp = json.dumps(data, ensure_ascii=False, default=str).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(resp)))
        self.end_headers()
        self.wfile.write(resp)

    def do_GET(self):
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
                    self.send_json({"wishes": rows})
        except Exception as e:
            self.send_json({"error": str(e)}, 500)

    def do_POST(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(length).decode('utf-8')) if length > 0 else {}
        except Exception:
            data = {}

        name = (data.get('name') or data.get('guest_name') or '').strip()
        wish = (data.get('wish') or '').strip()
        attendance = (data.get('attendance') or data.get('status') or 'attend').strip()

        if not name:
            self.send_json({"error": "Vui lòng nhập tên của bạn"}, 400)
            return

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

                    client_ip = self.headers.get('x-forwarded-for', '')
                    user_agent = self.headers.get('User-Agent', '')
                    cur.execute(
                        """
                        INSERT INTO guest_clicks (guest_name, action, details, user_agent, ip_address)
                        VALUES (%s, %s, %s, %s, %s);
                        """,
                        (name, 'unified_rsvp_wish', f"Tham dự: {attendance} | Lời chúc: {wish[:45]}...", user_agent, client_ip)
                    )
                    conn.commit()

            self.send_json({
                "success": True, 
                "wish": new_wish,
                "attendance": attendance,
                "name": name
            }, 201)
        except Exception as e:
            self.send_json({"error": str(e)}, 500)
