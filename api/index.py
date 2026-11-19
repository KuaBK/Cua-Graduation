from http.server import BaseHTTPRequestHandler
import json
import os
import random
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

DEFAULT_DB_URL = "postgresql://neondb_owner:npg_WLDSCuH8R4Kw@ep-polished-sky-b5bxz2iv-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require"
DB_URL = os.environ.get("DATABASE_URL", DEFAULT_DB_URL)

def get_db_connection():
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

    def get_route(self):
        matched = self.headers.get('x-matched-path', '')
        path = matched if matched else self.path
        return path.split('?')[0].lower()

    def read_json_body(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                raw_data = self.rfile.read(content_length).decode('utf-8')
                return json.loads(raw_data)
        except Exception as e:
            print(f"Error reading JSON: {e}")
        return {}

    def send_json_response(self, data, status_code=200):
        response_bytes = json.dumps(data, ensure_ascii=False, default=str).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_GET(self):
        route = self.get_route()
        if 'favicon.ico' in route:
            self.send_response(204)
            self.end_headers()
            return

        if 'wishes' in route:
            self.handle_get_wishes()
        elif 'stats' in route:
            self.handle_get_stats()
        else:
            self.send_json_response({"error": "Not Found", "route": route}, 404)

    def do_POST(self):
        route = self.get_route()
        if 'wishes' in route or 'rsvp' in route:
            self.handle_post_wish()
        elif 'track-click' in route or 'click' in route:
            self.handle_track_click()
        else:
            self.send_json_response({"error": "Not Found", "route": route}, 404)

    def handle_get_wishes(self):
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
                    self.send_json_response({"wishes": rows})
        except Exception as e:
            self.send_json_response({"error": str(e)}, 500)

    def handle_post_wish(self):
        data = self.read_json_body()
        name = (data.get('name') or data.get('guest_name') or '').strip()
        wish = (data.get('wish') or '').strip()
        attendance = (data.get('attendance') or data.get('status') or 'attend').strip()

        if not name:
            self.send_json_response({"error": "Vui lòng nhập tên của bạn"}, 400)
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

                    client_ip = self.headers.get('x-forwarded-for', '') or (self.client_address[0] if hasattr(self, 'client_address') else '')
                    user_agent = self.headers.get('User-Agent', '')
                    cur.execute(
                        """
                        INSERT INTO guest_clicks (guest_name, action, details, user_agent, ip_address)
                        VALUES (%s, %s, %s, %s, %s);
                        """,
                        (name, 'unified_rsvp_wish', f"Tham dự: {attendance} | Lời chúc: {wish[:45]}...", user_agent, client_ip)
                    )
                    conn.commit()

            self.send_json_response({
                "success": True, 
                "wish": new_wish,
                "attendance": attendance,
                "name": name
            }, 201)
        except Exception as e:
            self.send_json_response({"error": str(e)}, 500)

    def handle_track_click(self):
        data = self.read_json_body()
        guest_name = (data.get('guest_name') or 'Ẩn danh').strip()
        action = (data.get('action') or 'click').strip()
        details = (data.get('details') or '').strip()
        client_ip = self.headers.get('x-forwarded-for', '') or (self.client_address[0] if hasattr(self, 'client_address') else '')
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
            self.send_json_response({"success": True, "tracked": True})
        except Exception as e:
            self.send_json_response({"success": False, "error": str(e)})

    def handle_get_stats(self):
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

                    self.send_json_response({
                        "wishes_count": wishes_count,
                        "clicks_count": clicks_count,
                        "rsvps_count": rsvps_count,
                        "recent_clicks": recent_clicks
                    })
        except Exception as e:
            self.send_json_response({"error": str(e)}, 500)
