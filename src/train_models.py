"""
src/model_training.py

Training utilities for RandomForest and XGBoost, plus hyperparameter tuning.
Saves best estimators (joblib) to outputs/models/.

Usage:
    from src.model_training import train_and_save_all
    train_and_save_all(X_train, y_train, X_test, y_test, out_dir="outputs/models")
"""

import os
import joblib
import json
from typing import Tuple, Dict
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import RandomizedSearchCV
from xgboost import XGBClassifier

from sklearn.metrics import f1_score, accuracy_score

from src.utils import set_seed, save_pickle

set_seed(42)


def train_random_forest(X_train, y_train, cv=3, n_iter=10, random_state=42) -> Tuple:
    """Train RandomForest with RandomizedSearchCV and return best estimator + cv results."""
    rf = RandomForestClassifier(random_state=random_state, n_jobs=-1)
    param_dist = {
        "n_estimators": [100, 200, 300],
        "max_depth": [10, 20, None],
        "min_samples_split": [2, 5, 10],
        "class_weight": [None, "balanced"]
    }
    search = RandomizedSearchCV(rf, param_dist, n_iter=n_iter, cv=cv, scoring="f1_macro", n_jobs=-1, random_state=random_state)
    search.fit(X_train, y_train)
    return search.best_estimator_, search.cv_results_


def train_xgboost(X_train, y_train, cv=3, n_iter=10, random_state=42) -> Tuple:
    """Train XGBoost with RandomizedSearchCV and return best estimator + cv results."""
    xgb = XGBClassifier(use_label_encoder=False, eval_metric="logloss", n_jobs=-1, random_state=random_state)
    param_dist = {
        "n_estimators": [200, 300, 500],
        "max_depth": [6, 8, 10],
        "learning_rate": [0.01, 0.1, 0.2],
        "subsample": [0.7, 0.8, 1.0],
        "colsample_bytree": [0.6, 0.8, 1.0]
    }
    search = RandomizedSearchCV(xgb, param_dist, n_iter=n_iter, cv=cv, scoring="f1_macro", n_jobs=-1, random_state=random_state)
    search.fit(X_train, y_train)
    return search.best_estimator_, search.cv_results_


def evaluate_and_save(model, X_test, y_test, out_dir: str, model_name: str) -> Dict:
    """Compute evaluation metrics and save model to disk. Returns metrics dict."""
    os.makedirs(out_dir, exist_ok=True)
    preds = model.predict(X_test)
    metrics = {
        "accuracy": float(accuracy_score(y_test, preds)),
        "f1_macro": float(f1_score(y_test, preds, average="macro"))
    }
    # Save model
    save_path = os.path.join(out_dir, f"{model_name}.joblib")
    save_pickle(model, save_path)
    # Save metrics
    with open(os.path.join(out_dir, f"{model_name}_metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)
    return metrics


def train_and_save_all(X_train, y_train, X_test, y_test, out_dir="outputs/models"):
    """High-level function: train RF and XGB, save best models and metrics."""
    os.makedirs(out_dir, exist_ok=True)
    print("Training RandomForest...")
    best_rf, rf_cv = train_random_forest(X_train, y_train)
    rf_metrics = evaluate_and_save(best_rf, X_test, y_test, out_dir, "random_forest_best")
    print("RandomForest metrics:", rf_metrics)

    print("Training XGBoost...")
    best_xgb, xgb_cv = train_xgboost(X_train, y_train)
    xgb_metrics = evaluate_and_save(best_xgb, X_test, y_test, out_dir, "xgboost_best")
    print("XGBoost metrics:", xgb_metrics)

    return {
        "random_forest": {"estimator": best_rf, "cv_results": rf_cv, "metrics": rf_metrics},
        "xgboost": {"estimator": best_xgb, "cv_results": xgb_cv, "metrics": xgb_metrics}
    }


if __name__ == "__main__":
    print("This module is intended to be imported. Run training from top-level script or notebook.")
