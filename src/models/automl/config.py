from google.cloud import aiplatform
from .constants import (
    HITTER_FEATURES,
    HITTER_TARGETS,
    PITCHER_FEATURES,
    PITCHER_TARGETS,
    TIME_SPLIT
)

def create_transformations(features):
    """Create column transformations dict from features"""
    return {
        feature: 'timestamp' if feature == 'Year' else 'numeric'
        for feature in features
    }

SHARED_CONFIG = {
    'budget_milli_node_hours': 1000,
    'disable_early_stopping': False,
    'optimization_prediction_type': 'regression',
    'time_column': TIME_SPLIT['column'],
    'split_year': TIME_SPLIT['split_year']
}

HITTER_CONFIG = {
    **SHARED_CONFIG,
    'display_name': 'hitter_performance_prediction',
    'optimization_objective': 'minimize-rmse',
    'target_columns': HITTER_TARGETS,
    'column_transformations': create_transformations(HITTER_FEATURES)
}

PITCHER_CONFIG = {
    **SHARED_CONFIG,
    'display_name': 'pitcher_performance_prediction',
    'optimization_objective': 'minimize-rmse',
    'target_columns': PITCHER_TARGETS,
    'column_transformations': create_transformations(PITCHER_FEATURES)
}