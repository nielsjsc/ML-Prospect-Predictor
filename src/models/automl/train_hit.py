from google.cloud import aiplatform
import os
import sys
from datetime import datetime
import time

root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
sys.path.append(root_dir)

from src.cloud.config import PROJECT_ID, REGION, init_vertex_ai
from src.models.automl.constants import HITTER_FEATURES

def monitor_job_progress(job):
    """Monitor training job progress"""
    print("\nMonitoring training progress...")
    while True:
        status = job._gca_resource.state.name
        print(f"Current state: {status}")
        
        if status in ['PIPELINE_STATE_SUCCEEDED', 'PIPELINE_STATE_FAILED']:
            break
            
        time.sleep(60)  # Check every minute

def train_hitter_model(dataset_id, budget_milli_node_hours=1000, target_column="WAR_150"):
    """Train AutoML model for hitter prediction"""
    start_time = datetime.now()
    init_vertex_ai()
    
    try:
        print(f"Loading dataset: {dataset_id}")
        dataset = aiplatform.TabularDataset(dataset_id)
        
        column_specs = {feature: 'numeric' for feature in HITTER_FEATURES}
        column_specs['Year'] = 'categorical'
        
        print(f"\nTraining Configuration:")
        print(f"Budget: {budget_milli_node_hours} milli-node hours")
        print(f"Features: {list(column_specs.keys())}")
        
        job = aiplatform.AutoMLTabularTrainingJob(
            display_name=f"hitter_war_prediction_{start_time.strftime('%Y%m%d_%H%M')}",
            optimization_prediction_type="regression",
            optimization_objective="minimize-rmse",
            column_specs=column_specs
        )
        
        print("\nStarting training...")
        model = job.run(
            dataset=dataset,
            target_column=target_column,
            budget_milli_node_hours=budget_milli_node_hours,
            disable_early_stopping=False
        )
        
        duration = datetime.now() - start_time
        print(f"\nTraining completed in {duration}")
        print(f"Model resource name: {model.resource_name}")
        
        return model
        
    except Exception as e:
        print(f"\nError during training: {str(e)}")
        raise

if __name__ == "__main__":
    HITTER_DATASET = "projects/189414122511/locations/us-west1/datasets/5994546190727774208"
    train_hitter_model(HITTER_DATASET, budget_milli_node_hours=1000, target_column="WAR_150")