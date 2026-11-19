from http.server import BaseHTTPRequestHandler
import json
import os
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
                with conn.cursor() as cur:
                    cur.execute("SELECT COUNT(*) FROM wishes;")
                    wishes_count = cur.fetchone()[0]
                    cur.execute("SELECT COUNT(*) FROM guest_clicks;")
                    clicks_count = cur.fetchone()[0]
                    cur.execute("SELECT COUNT(*) FROM rsvps;")
                    rsvps_count = cur.fetchone()[0]

                    cur.execute("SELECT guest_name, action, details, created_at FROM guest_clicks ORDER BY id DESC LIMIT 10;")
                    recent_clicks = cur.fetchall()

                    self.send_json({
                        "wishes_count": wishes_count,
                        "clicks_count": clicks_count,
                        "rsvps_count": rsvps_count,
                        "recent_clicks": recent_clicks
                    })
        except Exception as e:
            self.send_json({"error": str(e)}, 500)
