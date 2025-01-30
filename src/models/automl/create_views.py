from google.cloud import bigquery
import os
import sys

root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
sys.path.append(root_dir)

from src.cloud.config import PROJECT_ID, init_bigquery
from src.models.automl.constants import (
    HITTER_FEATURES, HITTER_TARGETS,
    PITCHER_FEATURES, PITCHER_TARGETS
)

def escape_column(col):
    """Escape column names for BigQuery SQL"""
    if any(char in col for char in ['%', '+', '-']):
        return f'`{col}`'
    return col

HITTER_VIEW = f"""
CREATE OR REPLACE VIEW `{{project}}.mlb_prospects_dev.hitter_model_data` AS
SELECT
    {', '.join(escape_column(col) for col in HITTER_FEATURES)},
    {', '.join(escape_column(col) for col in HITTER_TARGETS)}
FROM `{{project}}.mlb_prospects_dev.hitters`
WHERE `WAR_150` IS NOT NULL
"""

PITCHER_VIEW = f"""
CREATE OR REPLACE VIEW `{{project}}.mlb_prospects_dev.pitcher_model_data` AS
SELECT
    {', '.join(escape_column(col) for col in PITCHER_FEATURES)},
    {', '.join(escape_column(col) for col in PITCHER_TARGETS)}
FROM `{{project}}.mlb_prospects_dev.pitchers`
WHERE `WAR_150` IS NOT NULL
"""

def create_model_views():
    """Create BigQuery views for model training"""
    client = init_bigquery()
    
    print("Creating hitter view...")
    print(f"Columns: {HITTER_FEATURES + HITTER_TARGETS}")
    client.query(HITTER_VIEW.format(project=PROJECT_ID)).result()
    
    print("\nCreating pitcher view...")
    print(f"Columns: {PITCHER_FEATURES + PITCHER_TARGETS}")
    client.query(PITCHER_VIEW.format(project=PROJECT_ID)).result()
    
    print("\n✅ Views created successfully")

if __name__ == "__main__":
    create_model_views()