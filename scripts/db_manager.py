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
    
    # Kiểm tra cấu trúc bảng
    cur.execute("SELECT COUNT(*) FROM wishes;")
    count = cur.fetchone()[0]
    print(f"Current real wishes count: {count}")

    conn.commit()
    cur.close()
    conn.close()
    print("Database tables initialized successfully!")

if __name__ == '__main__':
    init_tables()

