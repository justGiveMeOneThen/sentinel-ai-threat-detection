"""
src/model_evaluation.py

Functions to evaluate models and produce plots. Save plots to outputs/reports/.
"""

import os
import json
import joblib
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix, ConfusionMatrixDisplay, RocCurveDisplay
from typing import Any


def classification_report_to_dict(y_true, y_pred):
    report = classification_report(y_true, y_pred, output_dict=True)
    return report


def save_classification_report(report_dict, out_path: str):
    with open(out_path, "w") as f:
        json.dump(report_dict, f, indent=2)


def plot_and_save_confusion_matrix(y_true, y_pred, labels, out_path: str, title: str = "Confusion Matrix"):
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=labels)
    fig, ax = plt.subplots(figsize=(6, 6))
    disp.plot(ax=ax, cmap=plt.cm.Blues, colorbar=False)
    ax.set_title(title)
    plt.tight_layout()
    fig.savefig(out_path)
    plt.close(fig)


def plot_and_save_roc(model: Any, X_test, y_test, out_path: str, title: str = "ROC Curve"):
    # Works for binary classification or multi-class with one-vs-rest if estimator supports predict_proba
    fig, ax = plt.subplots(figsize=(6, 6))
    try:
        RocCurveDisplay.from_estimator(model, X_test, y_test, ax=ax)
        ax.set_title(title)
        plt.tight_layout()
        fig.savefig(out_path)
        plt.close(fig)
    except Exception as e:
        print("ROC plot failed:", e)
        plt.close(fig)
