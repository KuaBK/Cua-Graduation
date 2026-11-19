import http.server
import json
import os
import random
import sys
import threading
import queue
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

PORT = 8080
DB_URL = "postgresql://neondb_owner:npg_WLDSCuH8R4Kw@ep-polished-sky-b5bxz2iv-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require"

def get_db_connection():
    """Tạo kết nối mới đến Neon PostgreSQL (tối ưu hóa cho PgBouncer Pooler)"""
    return psycopg2.connect(DB_URL, connect_timeout=10)

# Queue xử lý log click bất đồng bộ (Async Click Tracking)
click_queue = queue.Queue(maxsize=1000)

def async_click_worker():
    """Worker chạy ngầm ghi nhận lượt click bất đồng bộ, không bao giờ chặn request client."""
    while True:
        try:
            item = click_queue.get()
            if item is None:
                break
            guest_name = item.get('guest_name', 'Ẩn danh')
            action = item.get('action', 'click')
            details = item.get('details', '')
            user_agent = item.get('user_agent', '')
            ip_address = item.get('ip_address', '')
            
            try:
                with get_db_connection() as conn:
                    with conn.cursor() as cur:
                        cur.execute(
                            """
                            INSERT INTO guest_clicks (guest_name, action, details, user_agent, ip_address)
                            VALUES (%s, %s, %s, %s, %s);
                            """,
                            (guest_name, action, details, user_agent, ip_address)
                        )
                        conn.commit()
            except Exception as err:
                print(f"Error saving async click: {err}")
            finally:
                click_queue.task_done()
        except Exception as e:
            print(f"Error in async click worker loop: {e}")

# Khởi động thread xử lý click ngầm
click_thread = threading.Thread(target=async_click_worker, daemon=True)
click_thread.start()

class GraduationHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Thêm header CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/wishes':
            self.handle_get_wishes()
        elif self.path == '/api/stats':
            self.handle_get_stats()
        else:
            # Phục vụ file tĩnh (HTML, CSS, JS, ảnh)
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/wishes':
            self.handle_post_wish()
        elif self.path == '/api/track-click':
            self.handle_track_click()
        elif self.path == '/api/rsvp':
            self.handle_post_rsvp()
        else:
            self.send_error(404, "Endpoint not found")

    def read_json_body(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                raw_data = self.rfile.read(content_length).decode('utf-8')
                return json.loads(raw_data)
        except Exception as e:
            print(f"Error reading JSON body: {e}")
        return {}

    def send_json_response(self, data, status_code=200):
        response_bytes = json.dumps(data, ensure_ascii=False, default=str).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

    def handle_get_wishes(self):
        """Lấy danh sách lời chúc từ PostgreSQL"""
        try:
            with get_db_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT id, name, wish, color, rotation, created_at FROM wishes ORDER BY id DESC LIMIT 100;")
                    rows = cur.fetchall()
                    self.send_json_response({"wishes": rows})
        except Exception as e:
            print(f"Error fetching wishes: {e}")
            self.send_json_response({"error": str(e)}, 500)

    def handle_post_wish(self):
        """Lưu lời chúc mới vào database (Sổ lưu bút)"""
        data = self.read_json_body()
        name = (data.get('name') or '').strip()
        wish = (data.get('wish') or '').strip()

        if not name or not wish:
            self.send_json_response({"error": "Vui lòng nhập tên và lời chúc"}, 400)
            return

        # Random góc nghiêng nhẹ cho thẻ ghi chú (-2.2deg đến 2.2deg)
        rotation = round(random.uniform(-2.2, 2.2), 1)

        try:
            with get_db_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        """
                        INSERT INTO wishes (name, wish, rotation)
                        VALUES (%s, %s, %s)
                        RETURNING id, name, wish, color, rotation, created_at;
                        """,
                        (name, wish, rotation)
                    )
                    new_wish = cur.fetchone()
                    conn.commit()

            # Ghi nhận lượt tương tác async
            click_queue.put({
                'guest_name': name,
                'action': 'post_wish',
                'details': f"Đã dán lời chúc: {wish[:50]}...",
                'user_agent': self.headers.get('User-Agent', ''),
                'ip_address': self.client_address[0]
            })

            self.send_json_response({"success": True, "wish": new_wish}, 201)
        except Exception as e:
            print(f"Error saving wish: {e}")
            self.send_json_response({"error": str(e)}, 500)

    def handle_track_click(self):
        """Ghi nhận lượt click theo tên bất đồng bộ (Non-blocking Async)"""
        data = self.read_json_body()
        guest_name = (data.get('guest_name') or 'Ẩn danh').strip()
        action = (data.get('action') or 'click').strip()
        details = (data.get('details') or '').strip()

        # Đẩy vào queue để worker thread ghi DB bất đồng bộ, phản hồi client ngay lập tức
        try:
            click_queue.put_nowait({
                'guest_name': guest_name,
                'action': action,
                'details': details,
                'user_agent': self.headers.get('User-Agent', ''),
                'ip_address': self.client_address[0]
            })
        except queue.Full:
            pass

        self.send_json_response({"success": True, "tracked": True})

    def handle_post_rsvp(self):
        """Lưu phản hồi tham dự (RSVP) vào database"""
        data = self.read_json_body()
        guest_name = (data.get('guest_name') or 'Quý khách').strip()
        status = (data.get('status') or 'attend').strip()
        wish = (data.get('wish') or '').strip()

        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO rsvps (guest_name, status, wish)
                        VALUES (%s, %s, %s)
                        RETURNING id;
                        """,
                        (guest_name, status, wish)
                    )
                    rsvp_id = cur.fetchone()[0]
                    conn.commit()

            # Ghi nhận click tracking
            click_queue.put({
                'guest_name': guest_name,
                'action': 'rsvp_submit',
                'details': f"Trạng thái: {status}",
                'user_agent': self.headers.get('User-Agent', ''),
                'ip_address': self.client_address[0]
            })

            self.send_json_response({"success": True, "rsvp_id": rsvp_id}, 201)
        except Exception as e:
            print(f"Error saving RSVP: {e}")
            self.send_json_response({"error": str(e)}, 500)

    def handle_get_stats(self):
        """Thống kê tổng quan số lời chúc và lượt tương tác"""
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT COUNT(*) FROM wishes;")
                    wishes_count = cur.fetchone()[0]
                    cur.execute("SELECT COUNT(*) FROM guest_clicks;")
                    clicks_count = cur.fetchone()[0]
                    cur.execute("SELECT COUNT(*) FROM rsvps;")
                    rsvps_count = cur.fetchone()[0]

                    # Lấy 10 click gần nhất
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

def run_server():
    server_address = ('', PORT)
    httpd = http.server.ThreadingHTTPServer(server_address, GraduationHTTPRequestHandler)
    print(f"Graduation server with Neon DB running on http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
