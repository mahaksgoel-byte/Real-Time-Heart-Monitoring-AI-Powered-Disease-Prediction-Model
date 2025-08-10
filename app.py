from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
from datetime import datetime
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration
socketio = SocketIO(app, cors_allowed_origins="*")  # Add WebSocket support

# Your existing CVDProgressionSimulator class
class CVDProgressionSimulator:
    def __init__(self, trained_model, data):
        self.model = trained_model
        self.data = data
        self.simulation_months = [1, 2, 3, 4, 5, 6, 9, 12]

    def simulate_disease_progression(self, frontend_form_data, current_heart_rate=None):
        user_features = self._convert_frontend_to_features(frontend_form_data)
        raw_risk = self.model.predict_proba(user_features.reshape(1, -1))[0, 1]

        if raw_risk > 0.85:
            initial_risk = 0.45 + (raw_risk - 0.85) * 0.8
        elif raw_risk < 0.10:
            initial_risk = 0.10 + raw_risk * 1.5
        else:
            initial_risk = raw_risk * 0.8

        progression_rates = self._calculate_progression_rates(frontend_form_data)
        improvement_plan = self._generate_improvement_plan(frontend_form_data)

        simulation_results = {
            'patient_id': f"CVD_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'initial_risk_percentage': float(initial_risk * 100),
            'current_heart_rate': current_heart_rate,
            'simulation_date': datetime.now().isoformat(),
            'patient_profile': frontend_form_data,
            'progression_factors': progression_rates,
            'improvement_recommendations': improvement_plan,
            'scenario_1_no_changes': {},
            'scenario_2_with_improvements': {}
        }

        for month in self.simulation_months:
            risk_no_changes = self._simulate_no_changes(
                initial_risk, month, progression_rates, frontend_form_data, current_heart_rate
            )
            simulation_results['scenario_1_no_changes'][f'month_{month}'] = {
                'month': month,
                'risk_percentage': float(risk_no_changes * 100),
                'risk_level': self._categorize_risk(risk_no_changes),
                'main_risk_factors': self._identify_risk_factors(frontend_form_data, month, 'worsening'),
                'warning_signs': self._get_warning_signs(risk_no_changes, month)
            }

            risk_with_improvements = self._simulate_with_improvements(
                initial_risk, month, progression_rates, frontend_form_data, current_heart_rate
            )
            simulation_results['scenario_2_with_improvements'][f'month_{month}'] = {
                'month': month,
                'risk_percentage': float(risk_with_improvements * 100),
                'risk_level': self._categorize_risk(risk_with_improvements),
                'active_improvements': self._get_active_improvements(frontend_form_data, month),
                'expected_changes': self._get_expected_changes(frontend_form_data, month),
                'health_benefits': self._get_health_benefits(month)
            }

        return simulation_results

    def _convert_frontend_to_features(self, form_data):
        features = np.zeros(30)
        height_m = form_data.get('height', 170) / 100.0
        weight_kg = form_data.get('weight', 70)
        calculated_bmi = weight_kg / (height_m ** 2)

        features[0] = form_data.get('age', 50) / 100.0
        features[1] = form_data.get('gender', 1)
        features[2] = form_data.get('height', 170) / 200.0
        features[3] = form_data.get('weight', 70) / 150.0
        features[4] = form_data.get('ap_hi', 120) / 200.0
        features[5] = form_data.get('ap_lo', 80) / 120.0
        features[6] = form_data.get('cholesterol', 1) / 3.0
        features[7] = form_data.get('gluc', 1) / 3.0
        features[8] = form_data.get('smoke', 0)
        features[9] = form_data.get('alco', 0)
        features[10] = form_data.get('active', 1)
        features[11] = form_data.get('cardio', 0)
        features[12] = calculated_bmi / 40.0
        features[13] = form_data.get('pulse_pressure', 40) / 100.0

        for i in range(14, 30):
            if i == 14:
                features[i] = 1.0 if form_data.get('age', 50) > 65 else 0.0
            elif i == 15:
                features[i] = 1.0 if form_data.get('ap_hi', 120) > 140 else 0.0
            elif i == 16:
                features[i] = 1.0 if calculated_bmi > 30 else 0.0
            elif i == 17:
                risk_count = sum([
                    form_data.get('smoke', 0),
                    form_data.get('alco', 0),
                    1 if form_data.get('cholesterol', 1) > 1 else 0,
                    1 if form_data.get('gluc', 1) > 1 else 0
                ])
                features[i] = risk_count / 4.0
            elif i == 18:
                features[i] = 1.0 if (calculated_bmi > 30 and form_data.get('ap_hi', 120) > 130) else 0.0
            else:
                base_correlation = np.random.normal(0, 0.2)
                features[i] = np.clip(base_correlation + features[i-5] * 0.3, -1, 1)

        return features

    def _calculate_progression_rates(self, form_data):
        rates = {
            'base_worsening_rate': 0.012,
            'base_improvement_rate': 0.020,
        }
        risk_multiplier = 1.0
        improvement_potential = 1.0

        age = form_data.get('age', 50)
        if age > 75:
            risk_multiplier += 0.6
            improvement_potential -= 0.3
        elif age > 65:
            risk_multiplier += 0.4
            improvement_potential -= 0.2
        elif age > 55:
            risk_multiplier += 0.2
            improvement_potential -= 0.1

        systolic = form_data.get('ap_hi', 120)
        if systolic > 180:
            risk_multiplier += 0.8
            improvement_potential += 0.6
        elif systolic > 160:
            risk_multiplier += 0.5
            improvement_potential += 0.4
        elif systolic > 140:
            risk_multiplier += 0.3
            improvement_potential += 0.3

        height_m = form_data.get('height', 170) / 100.0
        weight_kg = form_data.get('weight', 70)
        bmi = weight_kg / (height_m ** 2)

        if bmi > 40:
            risk_multiplier += 0.6
            improvement_potential += 0.5
        elif bmi > 35:
            risk_multiplier += 0.4
            improvement_potential += 0.4
        elif bmi > 30:
            risk_multiplier += 0.25
            improvement_potential += 0.3
        elif bmi > 25:
            risk_multiplier += 0.1
            improvement_potential += 0.15

        if form_data.get('smoke', 0) == 1:
            risk_multiplier += 1.0
            improvement_potential += 0.8

        cholesterol = form_data.get('cholesterol', 1)
        if cholesterol == 3:
            risk_multiplier += 0.4
            improvement_potential += 0.3
        elif cholesterol == 2:
            risk_multiplier += 0.2
            improvement_potential += 0.2

        if form_data.get('active', 1) == 0:
            risk_multiplier += 0.4
            improvement_potential += 0.35

        if form_data.get('alco', 0) == 1:
            risk_multiplier += 0.2
            improvement_potential += 0.15

        glucose = form_data.get('gluc', 1)
        if glucose == 3:
            risk_multiplier += 0.4
            improvement_potential += 0.25
        elif glucose == 2:
            risk_multiplier += 0.2
            improvement_potential += 0.15

        rates['final_worsening_rate'] = rates['base_worsening_rate'] * risk_multiplier
        rates['final_improvement_rate'] = rates['base_improvement_rate'] * improvement_potential
        rates['risk_multiplier'] = risk_multiplier
        rates['improvement_potential'] = improvement_potential

        return rates

    def _simulate_no_changes(self, initial_risk, month, rates, form_data, heart_rate):
        monthly_worsening = rates['final_worsening_rate']
        if month <= 2:
            progression_factor = 1 + (monthly_worsening * month * 0.5)
        elif month <= 6:
            progression_factor = 1 + (monthly_worsening * month * 0.8)
        else:
            progression_factor = 1 + (monthly_worsening * month * 1.1)

        simulated_risk = initial_risk * progression_factor
        variation = np.random.normal(0, 0.005)
        simulated_risk = simulated_risk * (1 + variation)

        if heart_rate:
            if heart_rate > 100:
                simulated_risk *= 1.04
            elif heart_rate < 50:
                simulated_risk *= 1.06

        return min(simulated_risk, 0.85)

    def _simulate_with_improvements(self, initial_risk, month, rates, form_data, heart_rate):
        monthly_improvement = rates['final_improvement_rate']
        if month == 1:
            improvement_factor = 0.998
        elif month == 2:
            improvement_factor = 0.990
        elif month <= 4:
            improvement_factor = 1 - (monthly_improvement * (month - 2) * 0.6)
        elif month <= 8:
            improvement_factor = 1 - (monthly_improvement * month * 0.8)
        else:
            improvement_factor = 1 - (monthly_improvement * month * 0.7)

        simulated_risk = initial_risk * improvement_factor
        total_benefit = 0

        if month >= 2:
            if form_data.get('smoke', 0) == 1:
                cessation_benefit = min(0.20, month * 0.025)
                total_benefit += cessation_benefit
            if form_data.get('ap_hi', 120) > 140:
                bp_benefit = min(0.15, (month - 1) * 0.018)
                total_benefit += bp_benefit

        if month >= 3:
            height_m = form_data.get('height', 170) / 100.0
            weight_kg = form_data.get('weight', 70)
            bmi = weight_kg / (height_m ** 2)
            if bmi > 30:
                weight_benefit = min(0.18, (month - 2) * 0.020)
                total_benefit += weight_benefit
            if form_data.get('active', 1) == 0:
                exercise_benefit = min(0.15, (month - 2) * 0.018)
                total_benefit += exercise_benefit

        if month >= 4:
            if form_data.get('cholesterol', 1) > 1:
                chol_benefit = min(0.12, (month - 3) * 0.015)
                total_benefit += chol_benefit
            if form_data.get('gluc', 1) > 1:
                diabetes_benefit = min(0.10, (month - 3) * 0.012)
                total_benefit += diabetes_benefit

        simulated_risk *= (1 - total_benefit)

        if heart_rate and month >= 3:
            if heart_rate > 85:
                hr_benefit = min(0.08, (month - 2) * 0.010)
                simulated_risk *= (1 - hr_benefit)

        min_risk = max(0.05, initial_risk * 0.25)
        return max(simulated_risk, min_risk)

    def _generate_improvement_plan(self, form_data):
        plan = {
            'high_priority': [],
            'medium_priority': [],
            'low_priority': [],
            'timeline': {},
            'personalized_changes': [],
            'expected_risk_reduction': {}
        }
        total_potential_reduction = 0

        if form_data.get('smoke', 0) == 1:
            plan['high_priority'].append("URGENT: Complete smoking cessation")
            plan['timeline']['smoking_cessation'] = "Quit within 2 weeks"
            plan['personalized_changes'].append("Smoking cessation will reduce your CVD risk by 15-20% within 6 months")
            plan['expected_risk_reduction']['smoking'] = 18
            total_potential_reduction += 18

        if form_data.get('ap_hi', 120) > 160:
            plan['high_priority'].append("CRITICAL: Aggressive blood pressure control")
            plan['timeline']['bp_control'] = "Target <140/90 mmHg within 3 months"
            plan['personalized_changes'].append("Blood pressure control can reduce your risk by 10-15% within 4 months")
            plan['expected_risk_reduction']['blood_pressure'] = 12
            total_potential_reduction += 12

        height_m = form_data.get('height', 170) / 100.0
        weight_kg = form_data.get('weight', 70)
        bmi = weight_kg / (height_m ** 2)

        if bmi > 35:
            plan['high_priority'].append("URGENT: Structured weight loss program")
            plan['timeline']['weight_loss'] = "Target 15-20% weight loss within 12 months"
            plan['personalized_changes'].append("Weight loss of 15-20% can reduce your CVD risk by 12-18%")
            plan['expected_risk_reduction']['weight_loss'] = 15
            total_potential_reduction += 15

        if form_data.get('cholesterol', 1) > 2:
            plan['medium_priority'].append("Cholesterol management")
            plan['timeline']['cholesterol'] = "Target LDL <100 mg/dL within 6 months"
            plan['personalized_changes'].append("Cholesterol control can reduce your risk by 8-12%")
            plan['expected_risk_reduction']['cholesterol'] = 10
            total_potential_reduction += 10

        if form_data.get('active', 1) == 0:
            plan['medium_priority'].append("Comprehensive exercise program")
            plan['timeline']['exercise'] = "Build to 150+ minutes moderate activity weekly"
            plan['personalized_changes'].append("Regular exercise can reduce your CVD risk by 10-15%")
            plan['expected_risk_reduction']['exercise'] = 12
            total_potential_reduction += 12

        if form_data.get('gluc', 1) > 2:
            plan['medium_priority'].append("Blood glucose optimization")
            plan['timeline']['glucose'] = "Target HbA1c <7% within 6 months"
            plan['personalized_changes'].append("Blood sugar control can reduce your risk by 6-10%")
            plan['expected_risk_reduction']['diabetes'] = 8
            total_potential_reduction += 8

        if form_data.get('alco', 0) == 1:
            plan['low_priority'].append("Moderate alcohol consumption")
            plan['personalized_changes'].append("Limiting alcohol can reduce your risk by 3-5%")
            plan['expected_risk_reduction']['alcohol'] = 4
            total_potential_reduction += 4

        if 25 < bmi <= 30:
            plan['medium_priority'].append("Weight optimization")
            plan['personalized_changes'].append("Reaching ideal weight can reduce your risk by 6-10%")
            plan['expected_risk_reduction']['weight_optimization'] = 8
            total_potential_reduction += 8

        plan['total_potential_reduction'] = min(total_potential_reduction, 45)
        return plan

    def _categorize_risk(self, risk_prob):
        if risk_prob < 0.10:
            return "Very Low Risk"
        elif risk_prob < 0.20:
            return "Low Risk"
        elif risk_prob < 0.35:
            return "Moderate Risk"
        elif risk_prob < 0.55:
            return "High Risk"
        else:
            return "Very High Risk"

    def _identify_risk_factors(self, form_data, month, scenario):
        factors = []
        age = form_data.get('age', 50)
        if age > 65:
            factors.append(f"Advanced age ({age} years)")

        systolic = form_data.get('ap_hi', 120)
        diastolic = form_data.get('ap_lo', 80)
        if systolic > 140:
            factors.append(f"Hypertension ({systolic}/{diastolic} mmHg)")

        if form_data.get('smoke', 0) == 1:
            if scenario == 'worsening':
                factors.append("Continued smoking (HIGH RISK)")
            else:
                factors.append("Recent smoking history")

        height_m = form_data.get('height', 170) / 100.0
        weight_kg = form_data.get('weight', 70)
        bmi = weight_kg / (height_m ** 2)

        if bmi > 30:
            factors.append(f"Obesity ( BMI {bmi:.1f})")
        elif bmi > 25:
            factors.append(f"Overweight (BMI {bmi:.1f})")

        cholesterol = form_data.get('cholesterol', 1)
        if cholesterol > 2:
            level = "severely elevated" if cholesterol == 3 else "elevated"
            factors.append(f"Cholesterol {level}")

        glucose = form_data.get('gluc', 1)
        if glucose > 2:
            factors.append("Diabetes/pre-diabetes")

        if form_data.get('active', 1) == 0:
            factors.append("Physical inactivity")

        if form_data.get('alco', 0) == 1:
            factors.append("Regular alcohol consumption")

        return factors[:5]

    def _get_warning_signs(self, risk_level, month):
        warnings = []
        if risk_level > 0.75:
            warnings.append("🚨 CRITICAL: Immediate cardiac evaluation required")
            warnings.append("🚨 Consider emergency cardiology consultation")
        elif risk_level > 0.55:
            warnings.append("⚠️  URGENT: Medical review needed within 1-2 weeks")
            warnings.append("⚠️  Aggressive intervention required immediately")
        elif risk_level > 0.35:
            warnings.append("⚠️  HIGH RISK: Medical consultation within 1 month")
            warnings.append("⚠️  Intensive lifestyle changes essential")
        elif risk_level > 0.20:
            warnings.append("⚠️  MODERATE RISK: Regular monitoring recommended")
            warnings.append("⚠️  Lifestyle modifications strongly advised")

        if month >= 6 and risk_level > 0.50:
            warnings.append("🚨 ALERT: Significant risk progression detected")

        return warnings

    def _get_active_improvements(self, form_data, month):
        improvements = []
        if month >= 1:
            improvements.append("✅ Comprehensive cardiovascular assessment completed")
            if form_data.get('smoke', 0) == 1:
                improvements.append("✅ Smoking cessation program initiated with support")
            improvements.append("✅ Heart-healthy Mediterranean diet plan started")
            improvements.append("✅ Daily medication adherence protocol established")

        if month >= 2:
            if form_data.get('active', 1) == 0:
                improvements.append("✅ Structured exercise program with cardiac monitoring")
            improvements.append("✅ Stress management and mindfulness techniques")
            if form_data.get('ap_hi', 120) > 140:
                improvements.append("✅ Blood pressure monitoring 2x daily")
            improvements.append("✅ Regular sleep optimization (7-8 hours nightly)")

        if month >= 3:
            improvements.append("✅ Measurable lifestyle changes showing clinical effects")
            height_m = form_data.get('height', 170) / 100.0
            weight_kg = form_data.get('weight', 70)
            bmi = weight_kg / (height_m ** 2)
            if bmi > 30:
                improvements.append("✅ Significant weight loss progress documented")
            improvements.append("✅ Improved cardiovascular fitness metrics")

        if month >= 4:
            improvements.append("✅ Laboratory improvements in lipid profile")
            improvements.append("✅ Enhanced cardiac function measurements")

        if month >= 6:
            improvements.append("✅ Sustained lifestyle modifications fully integrated")
            improvements.append("✅ Cardiovascular risk factors significantly improved")
            improvements.append("✅ Possible medication optimization under medical supervision")

        if month >= 9:
            improvements.append("✅ Long-term behavior changes consolidated and habitual")
            improvements.append("✅ Comprehensive cardiovascular protection achieved")

        if month >= 12:
            improvements.append("✅ Maximum lifestyle intervention benefits realized")
            improvements.append("✅ Long-term cardiovascular risk substantially reduced")

        return improvements

    def _get_expected_changes(self, form_data, month):
        changes = {}
        if month >= 2:
            height_m = form_data.get('height', 170) / 100.0
            weight_kg = form_data.get('weight', 70)
            bmi = weight_kg / (height_m ** 2)

            if bmi > 30:
                expected_loss = min(weight_kg * 0.015 * month, weight_kg * 0.20)
                new_weight = weight_kg - expected_loss
                changes['weight'] = f"Expected weight: {new_weight:.1f} kg (loss: {expected_loss:.1f} kg)"
                new_bmi = new_weight / (height_m ** 2)
                changes['bmi'] = f"Expected BMI: {new_bmi:.1f}"

        if month >= 2 and form_data.get('ap_hi', 120) > 140:
            bp_reduction = min(20, month * 2.5)
            new_systolic = form_data.get('ap_hi', 120) - bp_reduction
            new_diastolic = form_data.get('ap_lo', 80) - (bp_reduction * 0.6)
            changes['blood_pressure'] = f"Expected BP: {new_systolic:.0f}/{new_diastolic:.0f} mmHg"

        if month >= 3 and form_data.get('cholesterol', 1) > 1:
            changes['cholesterol'] = "Expected 20-30% reduction in LDL cholesterol"

        if month >= 4 and form_data.get('gluc', 1) > 1:
            changes['glucose'] = "Expected HbA1c reduction of 0.5-1.0%"

        if month >= 3:
            changes['fitness'] = f"Expected 25-40% improvement in cardiovascular fitness"

        return changes

    def _get_health_benefits(self, month):
        benefits = []
        if month >= 1:
            benefits.append("✓ Improved energy levels and daily vitality")
            benefits.append("✓ Better sleep quality and rest")

        if month >= 2:
            benefits.append("✓ Reduced inflammation markers")
            benefits.append("✓ Improved blood circulation")
            benefits.append("✓ Enhanced mood and mental clarity")

        if month >= 3:
            benefits.append("✓ Significant cardiovascular fitness gains")
            benefits.append("✓ Improved metabolic function")
            benefits.append("✓ Reduced risk of heart attack and stroke")

        if month >= 4:
            benefits.append("✓ Optimized lipid profile and cholesterol levels")
            benefits.append("✓ Better blood sugar control")

        if month >= 6:
            benefits.append("✓ Substantial reduction in cardiovascular events risk")
            benefits.append("✓ Improved life expectancy and quality of life")

        if month >= 9:
            benefits.append("✓ Long-term heart health protection")
            benefits.append("✓ Reduced need for intensive medical interventions")

        if month >= 12:
            benefits.append("✓ Maximum cardiovascular protection achieved")
            benefits.append("✓ Sustained health improvements for years to come")

        return benefits

# Load the model with better error handling
model = None
data = None

def create_dummy_model():
    """Create a dummy model for testing purposes"""
    print("Creating dummy RandomForest model for testing...")
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.datasets import make_classification
    import numpy as np
    
    # Create synthetic data that matches your feature structure
    X, y = make_classification(
        n_samples=1000, 
        n_features=30, 
        n_classes=2, 
        n_informative=15,
        n_redundant=5,
        random_state=42
    )
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    print("✅ Dummy model created and trained successfully!")
    print(f"Model type: {type(model)}")
    print(f"Model has predict_proba: {hasattr(model, 'predict_proba')}")
    
    return model

def load_model():
    """Load model with comprehensive error handling"""
    import os
    
    model_path = 'model.pkl'
    print(f"Looking for model at: {os.path.abspath(model_path)}")
    print(f"File exists: {os.path.exists(model_path)}")
    
    if not os.path.exists(model_path):
        print(f"❌ Model file '{model_path}' not found")
        return create_dummy_model()
    
    try:
        print(f"📁 File size: {os.path.getsize(model_path)} bytes")
        
        with open(model_path, 'rb') as file:
            loaded_model = pickle.load(file)
            
        print(f"✅ Model loaded successfully!")
        print(f"Model type: {type(loaded_model)}")
        
        if loaded_model is None:
            print("❌ Loaded model is None")
            return create_dummy_model()
            
        if hasattr(loaded_model, 'predict_proba'):
            print("✅ Model has predict_proba method")
            return loaded_model
        else:
            print("❌ Model does not have predict_proba method")
            return create_dummy_model()
            
    except pickle.UnpicklingError as e:
        print(f"❌ Pickle error: {e}")
        return create_dummy_model()
    except Exception as e:
        print(f"❌ Unexpected error loading model: {e}")
        return create_dummy_model()

def load_data():
    """Load data with error handling"""
    import os
    
    data_path = 'cardio_cleaned_optimized.csv'
    print(f"Looking for data at: {os.path.abspath(data_path)}")
    
    if not os.path.exists(data_path):
        print(f"❌ Data file '{data_path}' not found")
        print("Creating dummy data for testing...")
        
        # Create dummy data
        import numpy as np
        dummy_data = pd.DataFrame({
            'age': np.random.randint(30, 80, 1000),
            'gender': np.random.randint(0, 2, 1000),
            'height': np.random.randint(150, 200, 1000),
            'weight': np.random.randint(50, 120, 1000),
            'ap_hi': np.random.randint(90, 180, 1000),
            'ap_lo': np.random.randint(60, 120, 1000),
            'cholesterol': np.random.randint(1, 4, 1000),
            'gluc': np.random.randint(1, 4, 1000),
            'smoke': np.random.randint(0, 2, 1000),
            'alco': np.random.randint(0, 2, 1000),
            'active': np.random.randint(0, 2, 1000),
            'cardio': np.random.randint(0, 2, 1000)
        })
        print("✅ Dummy data created")
        return dummy_data
    
    try:
        loaded_data = pd.read_csv(data_path)
        print(f"✅ Data loaded successfully! Shape: {loaded_data.shape}")
        return loaded_data
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        return None

# Load model and data
print("🔄 Loading model...")
model = load_model()

print("🔄 Loading data...")
data = load_data()

# Final verification
if model is None:
    print("🚨 CRITICAL ERROR: No model available after all attempts!")
    exit(1)

if data is None:
    print("🚨 CRITICAL ERROR: No data available!")
    exit(1)

print("✅ Model and data loaded successfully!")
print(f"Final model type: {type(model)}")
print(f"Final model has predict_proba: {hasattr(model, 'predict_proba')}")

# Initialize simulator only if model is loaded
if model is not None:
    simulator = CVDProgressionSimulator(model, data)
    print("CVDProgressionSimulator initialized successfully")
else:
    print("ERROR: Cannot initialize simulator without a model")
    exit()

# WebSocket for real-time BPM data
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

# Endpoint to receive BPM data from Arduino
@app.route('/bpm', methods=['POST'])
def receive_bpm():
    try:
        data = request.json
        bpm = data.get('bpm')
        if bpm:
            # Broadcast to all connected clients
            socketio.emit('bpm_update', {'bpm': bpm})
            return jsonify({'status': 'success'})
        return jsonify({'error': 'Invalid data'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Check if model is available
        if model is None:
            return jsonify({'error': 'Model not available'}), 500
            
        data = request.json
        user_data = data.get('userData', {})
        heart_rate = data.get('heartRate', None)

        # Validate required fields
        required_fields = ['age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc', 'smoke', 'alco', 'active']
        for field in required_fields:
            if field not in user_data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Calculate pulse pressure if not provided
        if 'pulse_pressure' not in user_data:
            user_data['pulse_pressure'] = user_data['ap_hi'] - user_data['ap_lo']

        # Run simulation
        results = simulator.simulate_disease_progression(user_data, heart_rate)
        return jsonify(results)
    except Exception as e:
        print(f"Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'HeartCare API is running'})

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)