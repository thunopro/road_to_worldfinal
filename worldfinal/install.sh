#!/usr/bin/env bash
# worldfinal installer (Linux). Usage: bash install.sh
set -e
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DST="$HOME/.local/share/worldfinal"
BIN="$HOME/.local/bin"

echo "==> installing worldfinal to $DST"
rm -rf "$DST"
mkdir -p "$DST" "$BIN"
cp -r "$SRC/config" "$SRC/nvim-linux" "$SRC/worldfinal" "$DST/"
chmod +x "$DST/worldfinal" "$DST/nvim-linux/bin/nvim"
ln -sf "$DST/worldfinal" "$BIN/worldfinal"

# Ensure ~/.local/bin is on PATH
case ":$PATH:" in *":$BIN:"*) ;; *)
  for rc in "$HOME/.bashrc" "$HOME/.zshrc" "$HOME/.profile"; do
    [ -f "$rc" ] && ! grep -q 'worldfinal PATH' "$rc" && echo 'export PATH="$HOME/.local/bin:$PATH"  # worldfinal PATH' >> "$rc"
  done
  if command -v fish >/dev/null 2>&1; then fish -c "fish_add_path -U $BIN" 2>/dev/null || true; fi
  echo "    added ~/.local/bin to PATH (open a new terminal or run: export PATH=\"\$HOME/.local/bin:\$PATH\")"
  ;;
esac

# kitty: let Ctrl+Tab / Ctrl+Shift+Tab reach the editor + allow the padding toggle
K="$HOME/.config/kitty/kitty.conf"
if [ -f "$K" ] && ! grep -q '# worldfinal-keys' "$K"; then
  cat >> "$K" <<'KEOF'

# worldfinal-keys: Ctrl+Tab / Ctrl+Shift+Tab go to the editor (switch kitty tabs with ctrl+shift+left/right)
map ctrl+tab send_text all \x1b[27;5;9~
map ctrl+shift+tab send_text all \x1b[27;6;9~
allow_remote_control yes
KEOF
  echo "    kitty.conf: added Ctrl+Tab keys (restart kitty)"
fi

# Auto-install g++ and clipboard tool if missing
SUDO=""
[ "$(id -u)" -ne 0 ] && command -v sudo >/dev/null 2>&1 && SUDO="sudo"

NEED_GPP=0
command -v g++ >/dev/null 2>&1 || NEED_GPP=1

NEED_CLIP=0
CLIP_PKG="xclip"
if [ -n "$WAYLAND_DISPLAY" ]; then
  command -v wl-copy >/dev/null 2>&1 || { NEED_CLIP=1; CLIP_PKG="wl-clipboard"; }
else
  command -v xclip >/dev/null 2>&1 || command -v xsel >/dev/null 2>&1 || { NEED_CLIP=1; CLIP_PKG="xclip"; }
fi

if [ "$NEED_GPP" -eq 1 ] || [ "$NEED_CLIP" -eq 1 ]; then
  echo "==> installing missing dependencies (g++ / clipboard)..."
  if command -v apt-get >/dev/null 2>&1; then
    PKGS=""
    [ "$NEED_GPP" -eq 1 ] && PKGS="$PKGS g++"
    [ "$NEED_CLIP" -eq 1 ] && PKGS="$PKGS $CLIP_PKG"
    $SUDO apt-get update -qq && $SUDO apt-get install -y $PKGS
  elif command -v dnf >/dev/null 2>&1; then
    PKGS=""
    [ "$NEED_GPP" -eq 1 ] && PKGS="$PKGS gcc-c++"
    [ "$NEED_CLIP" -eq 1 ] && PKGS="$PKGS $CLIP_PKG"
    $SUDO dnf install -y $PKGS
  elif command -v pacman >/dev/null 2>&1; then
    PKGS=""
    [ "$NEED_GPP" -eq 1 ] && PKGS="$PKGS gcc"
    [ "$NEED_CLIP" -eq 1 ] && PKGS="$PKGS $CLIP_PKG"
    $SUDO pacman -Sy --noconfirm $PKGS
  elif command -v zypper >/dev/null 2>&1; then
    PKGS=""
    [ "$NEED_GPP" -eq 1 ] && PKGS="$PKGS gcc-c++"
    [ "$NEED_CLIP" -eq 1 ] && PKGS="$PKGS $CLIP_PKG"
    $SUDO zypper install -y $PKGS
  elif command -v apk >/dev/null 2>&1; then
    PKGS=""
    [ "$NEED_GPP" -eq 1 ] && PKGS="$PKGS g++"
    [ "$NEED_CLIP" -eq 1 ] && PKGS="$PKGS $CLIP_PKG"
    $SUDO apk add --no-cache $PKGS
  else
    [ "$NEED_GPP" -eq 1 ] && echo "!!  g++ not found: please install g++ manually"
    [ "$NEED_CLIP" -eq 1 ] && echo "!!  clipboard tool not found: please install $CLIP_PKG manually"
  fi
fi

# Warm the lua bytecode cache once so the very first start is already fast
"$DST/nvim-linux/bin/nvim" --headless --noplugin -u "$DST/config/init.lua" -i NONE +qa >/dev/null 2>&1 || true

# Pre-build bits/stdc++.h precompiled header synchronously if g++ is available
if command -v g++ >/dev/null 2>&1; then
  PCH_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/worldfinal/pch"
  FLAGS="-std=c++17 -O2 -Wall -Wextra -Wshadow"
  if [ ! -f "$PCH_DIR/bits/stdc++.h.gch" ] || [ "$(cat "$PCH_DIR/flags.txt" 2>/dev/null)" != "$FLAGS" ]; then
    HDR="$(printf '#include <bits/stdc++.h>\n' | g++ -std=c++17 -x c++ -E - 2>/dev/null | grep -o '/[^"]*bits/stdc++.h' | head -n1)"
    if [ -n "$HDR" ] && [ -f "$HDR" ]; then
      echo "==> precompiling bits/stdc++.h (one-time)..."
      mkdir -p "$PCH_DIR/bits"
      if g++ $FLAGS -x c++-header "$HDR" -o "$PCH_DIR/bits/stdc++.h.gch.tmp" 2>/dev/null; then
        mv "$PCH_DIR/bits/stdc++.h.gch.tmp" "$PCH_DIR/bits/stdc++.h.gch"
        printf '%s' "$FLAGS" > "$PCH_DIR/flags.txt"
      else
        rm -f "$PCH_DIR/bits/stdc++.h.gch.tmp"
      fi
    fi
  fi
fi

echo
command -v g++ >/dev/null 2>&1 && echo "    g++: $(g++ --version | head -n1)" || echo "!!  g++ not found: install g++ to compile C++"
echo "==> done. Run:  worldfinal A.cpp"
