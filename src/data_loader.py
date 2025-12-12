"""
src/data_loader.py

Functions to load dataset(s) from the data/ folder.
Assumes cleaned CSV(s) with a 'label' column for supervised training.

Usage:
    from src.data_loader import load_csv, load_multiple_csvs
    df = load_csv("data/cleaned_dataset.csv")
"""

import os
import pandas as pd
from typing import List


def load_csv(path: str) -> pd.DataFrame:
    """Load a single CSV into a pandas DataFrame with basic validation."""
    if not os.path.exists(path):
        raise FileNotFoundError(f"CSV file not found at: {path}")
    df = pd.read_csv(path)
    if 'label' not in df.columns:
        raise ValueError("Expected column 'label' in dataset (supervised).")
    return df


def load_multiple_csvs(paths: List[str]) -> pd.DataFrame:
    """Load and concatenate multiple CSV files into a single DataFrame."""
    dfs = []
    for p in paths:
        dfs.append(load_csv(p))
    df = pd.concat(dfs, ignore_index=True)
    return df


def sample_head(path: str, n: int = 5) -> pd.DataFrame:
    """Return the first n rows for quick inspection."""
    df = load_csv(path)
    return df.head(n)
