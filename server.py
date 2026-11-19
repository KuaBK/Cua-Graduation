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

def load_env():
    """Tải biến môi trường từ file .env nếu có"""
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
        except Exception as e:
            print(f"Error loading .env: {e}")

load_env()

PORT = int(os.environ.get("PORT", 8080))
DB_URL = os.environ.get("DATABASE_URL")

def get_db_connection():
    """Tạo kết nối mới đến PostgreSQL từ biến môi trường DATABASE_URL"""
    if not DB_URL:
        raise ValueError("Lỗi: Không tìm thấy biến môi trường DATABASE_URL. Hãy tạo file .env hoặc thiết lập DATABASE_URL.")
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
        if self.path == '/favicon.ico':
            self.send_response(204)
            self.end_headers()
            return
        elif self.path == '/api/wishes':
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
        """Lấy danh sách lời chúc thực tế từ PostgreSQL (không dùng dữ liệu giả)"""
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
            print(f"Error fetching wishes: {e}")
            self.send_json_response({"error": str(e)}, 500)

    def handle_post_wish(self):
        """Lưu phản hồi tham dự (RSVP) và lời chúc (Sổ lưu bút) gộp làm một"""
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
                    # 1. Luôn ghi nhận vào bảng rsvps
                    cur.execute(
                        """
                        INSERT INTO rsvps (guest_name, status, wish)
                        VALUES (%s, %s, %s);
                        """,
                        (name, attendance, wish)
                    )

                    # 2. Nếu có lời chúc, dán lên bức tường wishes
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

                    conn.commit()

            # Ghi nhận lượt tương tác async
            click_queue.put({
                'guest_name': name,
                'action': 'unified_rsvp_wish',
                'details': f"Tham dự: {attendance} | Lời chúc: {wish[:45]}...",
                'user_agent': self.headers.get('User-Agent', ''),
                'ip_address': self.client_address[0]
            })

            self.send_json_response({
                "success": True, 
                "wish": new_wish,
                "attendance": attendance,
                "name": name
            }, 201)
        except Exception as e:
            print(f"Error saving unified wish/rsvp: {e}")
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
        """Giữ endpoint /api/rsvp tương thích ngược, chuyển tiếp cùng logic"""
        self.handle_post_wish()

    def handle_get_stats(self):
        """Thống kê tổng quan số lời chúc thực tế và lượt tương tác"""
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
