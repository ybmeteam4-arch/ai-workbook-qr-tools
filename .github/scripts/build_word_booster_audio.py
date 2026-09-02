import base64
import json
import pathlib
import shutil
import subprocess

root = pathlib.Path("features/word-booster")
src = root / "audio-source.json"
temp = root / "assets/audio/_temp"
out = root / "assets/audio"
temp.mkdir(parents=True, exist_ok=True)

data = json.loads(src.read_text())
for name, b64 in data.items():
    (temp / name).write_bytes(base64.b64decode(b64))

groups = {
    "word": sorted(p for p in temp.glob("L1_voca_*.mp3") if "_sen" not in p.name),
    "sentence": sorted(temp.glob("L1_voca_*_sen.mp3")),
}
timings = {}

for kind, items in groups.items():
    cursor = 0.0
    rows = []
    listfile = temp / f"{kind}.txt"
    listfile.write_text("".join(f"file '{p.resolve()}'\n" for p in items))
    for p in items:
        number = int(p.stem.split("_")[2])
        duration = float(subprocess.check_output([
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=nw=1:nk=1", str(p)
        ], text=True).strip())
        rows.append((number, cursor, cursor + duration))
        cursor += duration
    target = out / ("L1_words.mp3" if kind == "word" else "L1_sentences.mp3")
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listfile),
        "-ac", "1", "-b:a", "64k", str(target)
    ], check=True)
    for number, start, end in rows:
        timings.setdefault(str(number), {})[kind] = {
            "start": round(start, 3),
            "end": round(end, 3),
        }

(out / "audio-timings.json").write_text(
    json.dumps(timings, ensure_ascii=False, indent=2)
)
src.unlink()
shutil.rmtree(temp)
shutil.rmtree(out / "source", ignore_errors=True)
