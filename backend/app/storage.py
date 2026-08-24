from pathlib import Path
import uuid
from .config import get_settings

settings = get_settings()


def ensure_dirs():
    root = Path(settings.storage_dir)
    (root / "uploads").mkdir(parents=True, exist_ok=True)
    (root / "generated").mkdir(parents=True, exist_ok=True)


def save_bytes(data: bytes, suffix: str, folder: str = "uploads") -> str:
    ensure_dirs()
    name = f"{uuid.uuid4().hex}{suffix}"
    path = Path(settings.storage_dir) / folder / name
    path.write_bytes(data)
    return str(path)
