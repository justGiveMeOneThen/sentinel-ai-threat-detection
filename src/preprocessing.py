import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import os

def load_raw_data(path="data/raw/west_network_logs.csv"):
    """Load the dataset from the raw directory."""
    df = pd.read_csv(path)
    print("Raw dataset loaded:", df.shape)
    return df


def clean_dataset(df):
    """Clean dataset: handle missing values, duplicates, invalid rows."""

    # Drop exact duplicates
    df = df.drop_duplicates()

    # Replace missing numeric fields with median
    num_cols = df.select_dtypes(include=['int64', 'float64']).columns
    for col in num_cols:
        df[col] = df[col].fillna(df[col].median())

    # Replace missing categorical fields with mode
    cat_cols = df.select_dtypes(include=['object']).columns
    for col in cat_cols:
        df[col] = df[col].fillna(df[col].mode()[0])

    print("Dataset cleaned:", df.shape)
    return df


def encode_features(df):
    """Convert text/categorical features into numbers."""

    label_encoders = {}
    for col in df.select_dtypes(include=["object"]).columns:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        label_encoders[col] = le

    joblib.dump(label_encoders, "outputs/models/label_encoders.joblib")

    print("Features encoded.")
    return df


def split_dataset(df):
    """Split into training/testing sets and scale numeric features."""

    X = df.drop("threat_label", axis=1)
    y = df["threat_label"]

    # Scale numeric values
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    joblib.dump(scaler, "outputs/models/scaler.joblib")

    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )

    # Save processed splits
    joblib.dump(X_train, "data/processed/X_train.joblib")
    joblib.dump(X_test, "data/processed/X_test.joblib")
    joblib.dump(y_train, "data/processed/y_train.joblib")
    joblib.dump(y_test, "data/processed/y_test.joblib")

    print("Dataset split and saved.")
    return X_train, X_test, y_train, y_test


def full_preprocessing_pipeline():
    """Runs every preprocessing step together."""

    df = load_raw_data()
    df = clean_dataset(df)
    df = encode_features(df)

    # Save cleaned CSV
    df.to_csv("data/clean/cleaned_dataset.csv", index=False)

    split_dataset(df)
    print("✔ FULL PREPROCESSING COMPLETED.")


if __name__ == "__main__":
    full_preprocessing_pipeline()
