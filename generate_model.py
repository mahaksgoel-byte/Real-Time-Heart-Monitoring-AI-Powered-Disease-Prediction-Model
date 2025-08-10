import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint
import numpy as np # if you need dummy data for testing

# --- Example: (Uncomment and adapt if you need to generate a new model) ---
# # Create dummy data and model for demonstration if you don't have actual ones
X_train = np.random.rand(100, 30) # Replace with your actual training features
y_train = np.random.randint(0, 2, 100) # Replace with your actual training labels
#
model_params = {
   'n_estimators': randint(10, 100),
   'max_depth': randint(3, 10)
 }
# # Initialize and fit your actual model/search here
random_search = RandomizedSearchCV(RandomForestClassifier(random_state=42), model_params, n_iter=10, cv=3)
random_search.fit(X_train, y_train)
#
best_model = random_search.best_estimator_ # Get the best model after training

# --- This is the critical part to save your trained model ---
# REPLACE `your_trained_model_object` WITH THE ACTUAL VARIABLE HOLDING YOUR TRAINED MODEL
# For instance, if you used RandomizedSearchCV, it would be `random_search.best_estimator_`
your_trained_model_object = None # <<< ENSURE THIS IS YOUR TRAINED MODEL OBJECT

# Make sure 'your_trained_model_object' is assigned a valid trained model before running this.
# For example: your_trained_model_object = random_search.best_estimator_

with open('model.pkl', 'wb') as file:
    pickle.dump(your_trained_model_object, file)

print("model.pkl successfully created.")