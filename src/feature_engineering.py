"""
src/feature_engineering.py

Place for feature creation & selection utilities. Designed for generic tabular datasets
extracted from network flows. Contains example functions you can adapt.

Typical features for network flows:
- bytes_per_packet = total_bytes / total_packets
- pkt_rate = packets / duration
- byte_rate = bytes / duration
- flag counts (if available)
"""

import numpy as np
import pandas as pd
from typing import List


def add_rate_features(df: pd.DataFrame,
                      bytes_col: str = "total_bytes",
                      pkts_col: str = "total_packets",
                      duration_col: str = "duration") -> pd.DataFrame:
    """Add bytes/sec and pkts/sec features, and bytes/packet."""
    df = df.copy()
    if bytes_col in df.columns and pkts_col in df.columns:
        df["bytes_per_packet"] = df[bytes_col] / df[pkts_col].replace(0, np.nan)
    if duration_col in df.columns:
        df["pkt_rate"] = df[pkts_col] / df[duration_col].replace(0, np.nan)
        df["byte_rate"] = df[bytes_col] / df[duration_col].replace(0, np.nan)
    # Fill infinite/NaN
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    for c in df.columns:
        if df[c].dtype.kind in 'fi':
            df[c].fillna(df[c].median(), inplace=True)
    return df


def one_hot_encode(df: pd.DataFrame, cols: List[str]) -> pd.DataFrame:
    """One-hot encode categorical columns (careful: may expand dimension)."""
    df = df.copy()
    for c in cols:
        if c in df.columns:
            dummies = pd.get_dummies(df[c], prefix=c)
            df = pd.concat([df.drop(columns=[c]), dummies], axis=1)
    return df


def select_top_k_by_variance(df: pd.DataFrame, k: int = 50) -> List[str]:
    """Return top-k column names by variance (simple feature selection)."""
    numeric = df.select_dtypes(include=[np.number])
    variances = numeric.var().sort_values(ascending=False)
    return variances.head(k).index.tolist()
