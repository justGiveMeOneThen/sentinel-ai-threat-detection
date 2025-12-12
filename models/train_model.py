import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
import joblib

df = pd.read_csv("../data/network_traffic.csv")

X = df.drop("threat_type", axis=1)
y = df["threat_type"]

categorical = ["protocol"]
numeric = [col for col in X.columns if col not in categorical]

preprocess = ColumnTransformer([
    ("cat", OneHotEncoder(), categorical)
], remainder="passthrough")

model = RandomForestClassifier(n_estimators=200)

pipeline = Pipeline([
    ("preprocess", preprocess),
    ("model", model)
])

pipeline.fit(X, y)

joblib.dump(pipeline, "threat_detection_model.pkl")
joblib.dump(preprocess, "preprocess.pkl")
