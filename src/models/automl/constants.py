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
    'BB_pct_minors',
    'K_pct_minors',
    'wRC_plus_minors'
]

HITTER_TARGETS = [
    'WAR_150',
    'wRC_plus_mlb',
    'BB_pct_mlb',
    'K_pct_mlb',
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
    'K_pct_minors',
    'BB_pct_minors',
    'GB_pct_minors'
]

PITCHER_TARGETS = [
    'WAR_150',
    'ERA_mlb',
    'K_pct_mlb',
    'BB_pct_mlb',
    'GB_pct_mlb'
]

TIME_SPLIT = {
    'column': 'Year',
    'training_fraction': 0.8,
    'split_year': 2022
}