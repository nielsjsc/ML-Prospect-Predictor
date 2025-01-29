from google.cloud import bigquery
import pandas as pd
import os
import sys

root_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path.append(root_dir)

# Change from relative to absolute import
from src.cloud.config import PROJECT_ID, init_bigquery


def upload_to_bigquery():
    """Upload matched data to BigQuery"""
    client = init_bigquery()
    dataset_id = 'mlb_prospects_dev'
    
    data_dir = os.path.join(root_dir, 'src','data', 'processed')
    print(f"Looking for data in: {data_dir}")
    hitters = pd.read_csv(os.path.join(data_dir, 'matched_hitters.csv'))
    pitchers = pd.read_csv(os.path.join(data_dir, 'matched_pitchers.csv'))
    
    # Upload tables
    hitters_table = f"{PROJECT_ID}.{dataset_id}.hitters"
    pitchers_table = f"{PROJECT_ID}.{dataset_id}.pitchers"
    
    print(f"Uploading data to {hitters_table} and {pitchers_table}")
    
    # Load to BigQuery
    job_config = bigquery.LoadJobConfig(
        write_disposition="WRITE_TRUNCATE",
    )
    
    client.load_table_from_dataframe(hitters, hitters_table, job_config=job_config)
    client.load_table_from_dataframe(pitchers, pitchers_table, job_config=job_config)
    print("✅ Data uploaded successfully")

if __name__ == "__main__":
    upload_to_bigquery()