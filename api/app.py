from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

model = joblib.load("../models/threat_detection_model.pkl")
preprocess = joblib.load("../models/preprocess.pkl")


@app.post("/predict")
def predict_threat():
    data = request.json  # JSON input
    df = pd.DataFrame([data])

    df_processed = preprocess.transform(df)
    prediction = model.predict(df_processed)

    return jsonify({
        "Threat_Type": str(prediction[0])
    })


@app.get("/")
def home():
    return jsonify({"message": "AI Threat Detection API is running"})


if __name__ == "__main__":
    app.run(debug=True)
