1. Dataset Source

Network traffic logs captured from simulated environment (or provided by lecturer).

Exported into CSV format.

2. Cleaning Operations

Removed duplicates

Handled missing values

numeric → median

categorical → mode

Removed impossible values (negative packet sizes, durations, etc.)

3. Feature Encoding

Label-encoded IPs, protocols, flags

Saved encoders to label_encoders.joblib

4. Split Dataset

80% training

20% testing

StandardScaler used to normalize features

Saved:

data/processed/X_train.joblib
data/processed/X_test.joblib
data/processed/y_train.joblib
data/processed/y_test.joblib

 5. Files Delivered

✔ raw dataset
✔ clean dataset
✔ processed splits
✔ preprocessing script
✔ documentation