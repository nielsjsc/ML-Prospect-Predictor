# Common features for both models
COMMON_FEATURES = [
    'Age',
    'Top_100',
    'Org_Rk',
    'Year'
]

# Hitter-specific definitions
HITTER_FEATURES = [
    *COMMON_FEATURES,
    'Hit_future',
    'Game_future',
    'Raw_future',
    'Spd_future',
    'FV_future',
    'PA_minors',
    'OBP_minors',
    'SLG_minors',
    'ISO',
    'BB%_minors',
    'K%_minors',
    'wRC+_minors'
]

HITTER_TARGETS = [
    'WAR_150',
    'wRC+_mlb',
    'BB%_mlb',
    'K%_mlb',
    'HR_150',
    'SB_150',
    'AVG_mlb',
    'OBP_mlb',
    'SLG_mlb'
]

# Pitcher-specific definitions
PITCHER_FEATURES = [
    *COMMON_FEATURES,
    'FB_future',
    'SL_future',
    'CB_future',
    'CH_future',
    'CMD_future',
    'FV_future',
    'IP_minors',
    'ERA_minors',
    'xFIP_minors',
    'K%_minors',
    'BB%_minors',
    'GB%_minors'
]

PITCHER_TARGETS = [
    'WAR_150',
    'ERA_mlb',
    'K%_mlb',
    'BB%_mlb',
    'GB%_mlb'
]

TIME_SPLIT = {
    'column': 'Year',
    'training_fraction': 0.8,
    'split_year': 2022  # Train on data before 2022, validate on 2022+
}