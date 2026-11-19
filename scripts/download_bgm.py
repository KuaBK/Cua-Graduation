import os
import yt_dlp

if os.path.exists("audio/bgm.m4a"):
    os.remove("audio/bgm.m4a")

ydl_opts = {
    'format': 'bestaudio[ext=m4a]/bestaudio',
    'outtmpl': 'audio/bgm.%(ext)s',
    'quiet': False
}

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    ydl.download(['https://www.youtube.com/watch?v=AuHAQ3201SI'])

