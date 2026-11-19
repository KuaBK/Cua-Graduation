import psycopg2
from psycopg2.extras import RealDictCursor
import json
import os

DB_URL = "postgresql://neondb_owner:npg_WLDSCuH8R4Kw@ep-polished-sky-b5bxz2iv-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require"

def get_connection():
    return psycopg2.connect(DB_URL)

def init_tables():
    conn = get_connection()
    cur = conn.cursor()
    
    # 1. Bảng lời chúc (Wishes - Sổ lưu bút)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS wishes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        wish TEXT NOT NULL,
        color VARCHAR(50) DEFAULT '#ffffff',
        rotation REAL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    # 2. Bảng theo dõi lượt click / truy cập theo tên (Guest Clicks / Visits Tracking)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS guest_clicks (
        id SERIAL PRIMARY KEY,
        guest_name VARCHAR(255) NOT NULL,
        action VARCHAR(100) NOT NULL,
        details TEXT,
        user_agent TEXT,
        ip_address VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    # 3. Bảng phản hồi tham dự (RSVP)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        guest_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        wish TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    # Kiểm tra xem đã có dữ liệu mẫu trong wishes chưa
    cur.execute("SELECT COUNT(*) FROM wishes;")
    count = cur.fetchone()[0]
    if count == 0:
        sample_wishes = [
            ("T", "Có lẽ anh chẳng biết em là ai đâu, vì em là một fan hâm mộ lặng thầm của anh. Chúc mừng anh nha, chúc anh luôn hạnh phúc, thành công và may mắn. Siuuuuuuu", -1.2),
            ("T", "ご卒業おめでとうございます。今後のご活躍を心よりお祈り申し上げます。", 1.5),
            ("V", "You did amazing, Phong! Congratulations on your graduation! 🎓✨", -2.0),
            ("Jasmine", "Chúc mừng anh đã hoàn thành một chặng đường đáng tự hào. Chúc anh luôn giữ được nhiệt huyết, bản lĩnh và sự kiên định trên hành trình phía trước. Mong rằng những năm tháng thanh xuân đã qua sẽ trở thành hành trang quý giá để anh tự tin bước tiếp vững vàng <33", 1.8),
            ("1 người bạn cùng tên", "Chúc mừng tân cử nhân Bách Khoa, chúc bạn luôn thành công trong công việc và cuộc sống.", -1.5),
            ("Kevin Nha Trang", "Congratulations on graduating with honors! 🎓 Wishing you lots of luck and success in your journey ahead. All the best for this exciting new chapter! ✨", 1.2)
        ]
        for name, wish, rot in sample_wishes:
            cur.execute(
                "INSERT INTO wishes (name, wish, rotation) VALUES (%s, %s, %s);",
                (name, wish, rot)
            )
        print(f"Inserted {len(sample_wishes)} initial sample wishes.")

    conn.commit()
    cur.close()
    conn.close()
    print("Database tables initialized successfully!")

if __name__ == '__main__':
    init_tables()
