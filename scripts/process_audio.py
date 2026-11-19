import os
import subprocess
import yt_dlp
import static_ffmpeg

ffmpeg_exe, _ = static_ffmpeg.run.get_or_fetch_platform_executables_else_raise()
print("Using ffmpeg at:", ffmpeg_exe)

# 1. Download raw audio from KGFGZP3B8ZQ
url = "https://www.youtube.com/watch?v=KGFGZP3B8ZQ"
temp_audio = "audio/temp_raw.m4a"
if os.path.exists(temp_audio):
    os.remove(temp_audio)

ydl_opts = {
    'format': 'bestaudio[ext=m4a]/bestaudio',
    'outtmpl': temp_audio,
    'quiet': False
}

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    ydl.download([url])

# Check duration or process with ffmpeg
# Cut first 20 seconds: -ss 20
# Also add gentle fade-in (1.5s) to avoid click/pop when music starts
output_mp3 = "audio/bgm.mp3"
output_m4a = "audio/bgm.m4a"

# Export MP3
cmd_mp3 = [
    ffmpeg_exe, "-y",
    "-ss", "20",
    "-i", temp_audio,
    "-af", "afade=t=in:ss=0:d=1.5",
    "-b:a", "128k",
    output_mp3
]
subprocess.run(cmd_mp3, check=True)

# Export M4A
cmd_m4a = [
    ffmpeg_exe, "-y",
    "-ss", "20",
    "-i", temp_audio,
    "-af", "afade=t=in:ss=0:d=1.5",
    "-c:a", "aac",
    "-b:a", "128k",
    "-movflags", "+faststart",
    output_m4a
]
subprocess.run(cmd_m4a, check=True)

if os.path.exists(temp_audio):
    os.remove(temp_audio)

print("Finished processing audio:")
for p in [output_mp3, output_m4a]:
    print(p, os.path.getsize(p), "bytes")

