from google.cloud import aiplatform
import pandas as pd
import os
import sys

root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
sys.path.append(root_dir)

from src.cloud.config import PROJECT_ID, REGION, init_vertex_ai
from src.models.automl.constants import HITTER_FEATURES
from src.data.matchProspect import process_prospect_data  # Updated import

def load_2024_data():
    """Load and process 2024 prospect data"""
    file_path = os.path.join(root_dir, 'src/data/raw/batters/2024.csv')
    df = pd.read_csv(file_path)
    
    print("\nLoaded columns:")
    print(df.columns.tolist())
    
    # Rename columns to match training data format
    df = df.rename(columns={
        'Top 100': 'Top_100',
        'Org Rk': 'Org_Rk'
    })
    
    df['Year'] = 2024
    df = process_prospect_data(df, 'hitter')
    
    # Rest of function remains the same
    rename_dict = {
        'PA': 'PA_minors',
        'OBP': 'OBP_minors',
        'SLG': 'SLG_minors',
        'BB%': 'BB_pct_minors',
        'K%': 'K_pct_minors',
        'wRC+': 'wRC_plus_minors'
    }
    df = df.rename(columns=rename_dict)
    
    features_df = df[HITTER_FEATURES + ['Name']].copy()
    features_df['Year'] = features_df['Year'].astype(str)
    
    return features_df




def deploy_model(model_id):
    """Deploy model to endpoint"""
    init_vertex_ai()
    model = aiplatform.Model(model_id)
    
    print(f"Deploying model {model.display_name}")
    endpoint = model.deploy(
        machine_type="n1-standard-4",
        min_replica_count=1,
        max_replica_count=1
    )
    print(f"Model deployed to endpoint: {endpoint.resource_name}")
    return endpoint

def predict_performance(model_id):
    """Generate predictions using deployed model"""
    predict_data = load_2024_data()
    init_vertex_ai()
    endpoint = deploy_model(model_id)
    
    try:
        
        print(f"\nGenerating predictions for {len(predict_data)} prospects")
        
        # Verify data format before prediction
        print("\nSample instance format:")
        sample_instance = predict_data[HITTER_FEATURES].iloc[0].to_dict()
        print(sample_instance)
        print("\nData types:")
        print(predict_data[HITTER_FEATURES].dtypes)
        
        # Convert all numeric columns to strings
        for col in predict_data.select_dtypes(include=['int64', 'float64']).columns:
            predict_data[col] = predict_data[col].astype(str)
            
        # Format instances for prediction
        instances = predict_data[HITTER_FEATURES].to_dict('records')
        
        # Verify final format
        print("\nFormatted sample instance:")
        print(instances[0])
        
            
        response = endpoint.predict(instances=instances)
        predictions = response.predictions
        
        # Extract prediction values
        prediction_values = [p['value'] for p in predictions]
        
        # Format results with extracted values
        results = pd.DataFrame({
            'Name': predict_data['Name'],
            'Predicted_WAR': prediction_values,
            'Lower_Bound': [p['lower_bound'] for p in predictions],
            'Upper_Bound': [p['upper_bound'] for p in predictions],
            **{col: predict_data[col] for col in ['Age', 'Top_100', 'FV_future']}
        })
        
        return results.sort_values('Predicted_WAR', ascending=False)
        
    except Exception as e:
        print(f"\nError during prediction: {e}")
        print("Error details:", e.__class__.__name__)
        raise
    finally:
        print("\nCleaning up endpoint...")
        endpoint.undeploy_all()
        endpoint.delete()

if __name__ == "__main__":
    MODEL_ID = "projects/189414122511/locations/us-west1/models/856286461572415488"
    predictions = predict_performance(MODEL_ID)
    
    output_path = os.path.join(root_dir, 'src/data/predictions/2024_hitter_war_predictions.csv')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    predictions.to_csv(output_path, index=False)
    
    print("\nTop 20 Predicted Performers:")
    print(predictions.head(20))