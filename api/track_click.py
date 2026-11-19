from http.server import BaseHTTPRequestHandler
import json
import os
import psycopg2

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

    def do_POST(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(length).decode('utf-8')) if length > 0 else {}
        except Exception:
            data = {}

        guest_name = (data.get('guest_name') or 'Ẩn danh').strip()
        action = (data.get('action') or 'click').strip()
        details = (data.get('details') or '').strip()
        client_ip = self.headers.get('x-forwarded-for', '')
        user_agent = self.headers.get('User-Agent', '')

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
            self.send_json({"success": True, "tracked": True})
        except Exception as e:
            self.send_json({"success": False, "error": str(e)})
