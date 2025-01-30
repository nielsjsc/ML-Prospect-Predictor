from google.cloud import aiplatform, bigquery
import os
import sys

root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
sys.path.append(root_dir)

from src.cloud.config import PROJECT_ID, REGION, BUCKET_NAME, init_vertex_ai, init_bigquery
from src.models.automl.constants import (
    HITTER_FEATURES, HITTER_TARGETS,
    PITCHER_FEATURES, PITCHER_TARGETS,
    TIME_SPLIT
)

def export_to_gcs():
    """Export BigQuery views to Cloud Storage"""
    client = init_bigquery()
    
    # Create temporary tables
    temp_tables_query = f"""
    CREATE OR REPLACE TABLE `{PROJECT_ID}.mlb_prospects_dev.temp_hitter_data` AS
    SELECT * FROM `{PROJECT_ID}.mlb_prospects_dev.hitter_model_data`;
    
    CREATE OR REPLACE TABLE `{PROJECT_ID}.mlb_prospects_dev.temp_pitcher_data` AS
    SELECT * FROM `{PROJECT_ID}.mlb_prospects_dev.pitcher_model_data`;
    """
    
    print("Creating temporary tables...")
    client.query(temp_tables_query).result()
    
    # Export configurations
    hitter_destination = f"gs://{BUCKET_NAME}/datasets/hitters/data.csv"
    pitcher_destination = f"gs://{BUCKET_NAME}/datasets/pitchers/data.csv"
    
    job_config = bigquery.ExtractJobConfig()
    job_config.destination_format = bigquery.DestinationFormat.CSV
    job_config.field_delimiter = ","
    job_config.print_header = True
    
    print("\nExporting to Cloud Storage...")
    
    # Extract from temp tables
    hitter_job = client.extract_table(
        f"{PROJECT_ID}.mlb_prospects_dev.temp_hitter_data",
        hitter_destination,
        job_config=job_config
    )
    
    pitcher_job = client.extract_table(
        f"{PROJECT_ID}.mlb_prospects_dev.temp_pitcher_data",
        pitcher_destination,
        job_config=job_config
    )
    
    hitter_job.result()
    pitcher_job.result()
    
    # Clean up temp tables
    cleanup_query = f"""
    DROP TABLE `{PROJECT_ID}.mlb_prospects_dev.temp_hitter_data`;
    DROP TABLE `{PROJECT_ID}.mlb_prospects_dev.temp_pitcher_data`;
    """
    
    print("Cleaning up temporary tables...")
    client.query(cleanup_query).result()
    
    return hitter_destination, pitcher_destination

def create_datasets():
    """Create Vertex AI datasets from Cloud Storage"""
    init_vertex_ai()
    
    # Export to GCS first
    hitter_source, pitcher_source = export_to_gcs()
    
    # Create datasets
    hitter_dataset = aiplatform.TabularDataset.create(
        display_name="hitter_predictions",
        gcs_source=hitter_source,
        project=PROJECT_ID,
        location=REGION
    )
    
    pitcher_dataset = aiplatform.TabularDataset.create(
        display_name="pitcher_predictions",
        gcs_source=pitcher_source,
        project=PROJECT_ID,
        location=REGION
    )
    
    print(f"Created hitter dataset with {len(HITTER_FEATURES)} features and {len(HITTER_TARGETS)} targets")
    print(f"Created pitcher dataset with {len(PITCHER_FEATURES)} features and {len(PITCHER_TARGETS)} targets")
    print(f"\nHitter dataset: {hitter_dataset.resource_name}")
    print(f"Pitcher dataset: {pitcher_dataset.resource_name}")
    
    return hitter_dataset, pitcher_dataset

if __name__ == "__main__":
    create_datasets()