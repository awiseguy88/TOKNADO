#!/bin/sh
set -eu
cd "$(dirname "$0")"
data_dir="${XDG_DATA_HOME:-$HOME/.local/share}"
mkdir -p "$data_dir/applications"
python3 - "$PWD" "$data_dir/applications/TOKNADO.desktop" <<'PY'
from pathlib import Path
import sys

root = Path(sys.argv[1])
entries = (root / "TOKNADO.desktop").read_text().splitlines()
def escape(value):
    return str(value).replace("\\", "\\\\")

settings = {"Icon": escape(root / "toknado-icon.png"), "Exec": "./start.sh"}
lines = [key + "=" + settings.get(key, value) if sep else key
         for key, sep, value in (line.partition("=") for line in entries)]
lines.append("Path=" + escape(root))
Path(sys.argv[2]).write_text("\n".join(lines) + "\n")
PY
