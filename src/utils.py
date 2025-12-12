"""
src/utils.py

Small utility helpers: saving/loading pickles, set seed, mkdir.
"""

import os
import joblib
import random
import numpy as np


def save_pickle(obj, path: str):
    """Save object with joblib (pickle)."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    joblib.dump(obj, path)
    return path


def load_pickle(path: str):
    """Load joblib object."""
    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")
    return joblib.load(path)


def set_seed(seed: int = 42):
    random.seed(seed)
    np.random.seed(seed)


def ensure_dirs(paths):
    """Create directories if they don't exist."""
    for p in paths:
        os.makedirs(p, exist_ok=True)
