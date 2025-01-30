import pandas as pd
import os
import numpy as np

def load_data(prospect_files, mlb_hitters_file, mlb_pitchers_file):
    # Load MLB data and convert IDfg to string
    mlb_hitters = pd.read_csv(mlb_hitters_file, encoding='utf-8-sig')
    mlb_pitchers = pd.read_csv(mlb_pitchers_file, encoding='utf-8-sig')
    
    mlb_hitters['IDfg'] = mlb_hitters['IDfg'].astype(str)
    mlb_pitchers['IDfg'] = mlb_pitchers['IDfg'].astype(str)
    
    # Load and combine prospect data
    prospects_list = []
    for file in prospect_files:
        if os.path.exists(file):
            df = pd.read_csv(file, encoding='utf-8-sig')
            year = int(os.path.basename(file).split('.')[0])
            df['Year'] = year
            df['playerId'] = df['playerId'].astype(str)  # Convert to string
            prospects_list.append(df)
    
    if not prospects_list:
        raise ValueError("No prospect files were found")
        
    prospects = pd.concat(prospects_list, ignore_index=True)
    
    return prospects, mlb_hitters, mlb_pitchers
def analyze_missing_values(df, position):
    """Print missing value analysis for dataset"""
    print(f"\n{position.capitalize()} Dataset Missing Values:")
    missing = df.isnull().sum()
    missing_pct = (missing / len(df)) * 100
    
    print("\nMissing by column:")
    for col in df.columns:
        if missing[col] > 0:
            print(f"{col}: {missing[col]} ({missing_pct[col]:.1f}%)")
    
    print(f"\nTotal rows: {len(df)}")
    print(f"Rows with any missing: {df.isnull().any(axis=1).sum()} ({df.isnull().any(axis=1).mean()*100:.1f}%)")

def process_missing_values(df, position):
    """Handle missing values in prospect data"""
    print(f"\nProcessing missing values for {position} data:")
    
    # Handle Top 100 rankings
    df['Top_100'] = df['Top_100'].fillna(250)
    print("Filled Top 100 rankings with 250")
    
    if position == 'pitcher':
        # Get future grade columns
        future_cols = ['FB_future', 'SL_future', 'CB_future', 'CH_future', 'CMD_future']
        
        # Print medians before imputation
        print("\nMedian values for imputation:")
        for col in future_cols:
            median = df[col].median()
            print(f"{col}: {median:.1f}")
            df[col] = df[col].fillna(median)
    
    # Verify imputation
    missing = df.isnull().sum()
    print("\nRemaining missing values:")
    for col in df.columns:
        if missing[col] > 0:
            print(f"{col}: {missing[col]} ({missing[col]/len(df)*100:.1f}%)")
    
    return df
def process_future_grades(df, position):
    """Extract future grades from grade columns"""
    if position == 'hitter':
        grade_columns = ['Hit', 'Game', 'Raw', 'Spd', 'FV']
    else:
        grade_columns = ['FB', 'SL', 'CB', 'CH', 'CMD', 'FV']
    
    for col in grade_columns:
        if col in df.columns:
            if col == 'FV':
                # Handle FV with plus grades
                df[f'{col}_future'] = df[col].apply(lambda x: float(x.replace('+', '')) + 2.5 
                                                  if '+' in str(x) else float(x))
            else:
                # Handle regular tool grades
                df[f'{col}_future'] = df[col].str.split('/').str[1].astype(float)
            # Drop original column
            df = df.drop(columns=[col])
    
    return df


def weighted_avg(group, stat_col, weight_col):
    """Calculate weighted average handling zero weights"""
    weights = group[weight_col]
    if weights.sum() == 0:
        return 0
    return np.average(group[stat_col], weights=weights)
def generate_poor_performance(df, column, position, percentile=10):
    """Generate random poor performance values based on position"""
    valid_data = df[column].dropna()
    
    # Define which stats are "higher is better" for each position
    hitter_higher_better = {
        'WAR_150': True,
        'wRC_plus_mlb': True,
        'BB_pct_mlb': True,
        'K_pct_mlb': False,
        'HR_150': True,
        'SB_150': True,
        'AVG_mlb': True,
        'OBP_mlb': True,
        'SLG_mlb': True
    }
    
    pitcher_higher_better = {
        'WAR_150': True,
        'ERA_mlb': False,
        'K_pct_mlb': True,
        'BB_pct_mlb': False,
        'GB_pct_mlb': True
    }
    
    # Select appropriate mapping
    higher_better = hitter_higher_better if position == 'hitter' else pitcher_higher_better
    
    # Generate poor performance based on whether higher or lower is better
    if higher_better.get(column, True):  # Default to higher=better if not specified
        threshold = np.percentile(valid_data, percentile)
        min_val = min(valid_data)
        return np.random.uniform(min_val, threshold, size=df[column].isna().sum())
    else:
        threshold = np.percentile(valid_data, 100-percentile)
        max_val = max(valid_data)
        return np.random.uniform(threshold, max_val, size=df[column].isna().sum())




def fill_missing_performance(df, position):
    """Fill missing MLB stats with poor performance values"""
    print(f"\nFilling missing {position} MLB stats with bottom 10% random values")
    
    if position == 'hitter':
        target_cols = {
            'WAR_150': True,
            'wRC_plus_mlb': True,
            'BB_pct_mlb': True,
            'K_pct_mlb': False,
            'HR_150': True,
            'SB_150': True,
            'AVG_mlb': True,
            'OBP_mlb': True,
            'SLG_mlb': True
        }
    else:
        target_cols = {
            'WAR_150': True,
            'ERA_mlb': False,
            'K_pct_mlb': True,
            'BB_pct_mlb': False,
            'GB_pct_mlb': True
        }
    
    # Debug information
    print("\nBefore filling:")
    missing_before = df[list(target_cols.keys())].isnull().sum()
    print(missing_before)
    
    # Fill each column
    for col, higher_better in target_cols.items():
        if col not in df.columns:
            print(f"Warning: Column {col} not found in dataframe")
            continue
            
        valid_data = df[col].dropna()
        if len(valid_data) == 0:
            print(f"Warning: No valid data for {col}")
            continue
            
        # Generate poor performance values
        n_missing = df[col].isna().sum()
        if higher_better:
            threshold = np.percentile(valid_data, 10)
            min_val = valid_data.min()
            poor_values = np.random.uniform(min_val, threshold, size=n_missing)
        else:
            threshold = np.percentile(valid_data, 90)
            max_val = valid_data.max()
            poor_values = np.random.uniform(threshold, max_val, size=n_missing)
        
        # Fill missing values
        df.loc[df[col].isna(), col] = poor_values
        
        # Verify fill
        still_missing = df[col].isnull().sum()
        print(f"\n{col}:")
        print(f"Missing before: {n_missing}")
        print(f"Still missing: {still_missing}")
        print(f"Values filled: {n_missing - still_missing}")
    
    return df



def match_prospects_with_mlb(prospects, mlb_stats, position):
    prospects = process_future_grades(prospects, position)
    prospects = prospects.rename(columns={'Top 100': 'Top_100'})
    prospects = prospects.rename(columns={'Org Rk': 'Org_Rk'})
    prospects['Top_100'] = prospects['Top_100'].replace(0, np.nan)
    
    if position == 'hitter':
        # Keep original MLBstats columns
        mlb_stats = mlb_stats[['IDfg', 'G', 'PA', 'HR', 'SB', 'AVG', 
                              'OBP', 'SLG', 'wRC+', 'L-WAR', 'BB%', 'K%', 
                              'Season']].copy()
        
        # Keep original groupby with same aggregations
        mlb_stats_grouped = mlb_stats.groupby('IDfg').agg({
            'G': 'sum',
            'L-WAR': 'sum',
            'HR': 'sum',
            'SB': 'sum',
            'PA': 'sum',
            'AVG': lambda x: weighted_avg(mlb_stats.loc[x.index], 'AVG', 'PA'),
            'OBP': lambda x: weighted_avg(mlb_stats.loc[x.index], 'OBP', 'PA'),
            'SLG': lambda x: weighted_avg(mlb_stats.loc[x.index], 'SLG', 'PA'),
            'wRC+': lambda x: weighted_avg(mlb_stats.loc[x.index], 'wRC+', 'PA'),
            'BB%': lambda x: weighted_avg(mlb_stats.loc[x.index], 'BB%', 'PA'),
            'K%': lambda x: weighted_avg(mlb_stats.loc[x.index], 'K%', 'PA'),
            'Season': 'min'
        }).reset_index()

        # Calculate rate stats
        mlb_stats_grouped['WAR_150'] = (mlb_stats_grouped['L-WAR'] * 150) / mlb_stats_grouped['G']
        mlb_stats_grouped['HR_150'] = (mlb_stats_grouped['HR'] * 150) / mlb_stats_grouped['G']
        mlb_stats_grouped['SB_150'] = (mlb_stats_grouped['SB'] * 150) / mlb_stats_grouped['G']

        # Updated rename dictionary
        rename_dict = {
            'PA_x': 'PA_minors',
            'OBP_x': 'OBP_minors',
            'SLG_x': 'SLG_minors',
            'BB%_x': 'BB_pct_minors',
            'K%_x': 'K_pct_minors',
            'wRC+_x': 'wRC_plus_minors',
            'PA_y': 'PA_mlb',
            'OBP_y': 'OBP_mlb',
            'SLG_y': 'SLG_mlb',
            'wRC+_y': 'wRC_plus_mlb',
            'BB%_y': 'BB_pct_mlb',
            'K%_y': 'K_pct_mlb',
            'AVG': 'AVG_mlb'
        }
        
        keep_columns = [
            # Predictors
            'Age', 'Top_100', 'Org_Rk',
            'Hit_future', 'Game_future', 'Raw_future', 'Spd_future', 'FV_future',
            'PA_minors', 'OBP_minors', 'SLG_minors', 'ISO',
            'BB_pct_minors', 'K_pct_minors', 'wRC_plus_minors',
            'Year',
            
            # Targets
            'WAR_150', 'wRC_plus_mlb', 'BB_pct_mlb', 'K_pct_mlb',
            'HR_150', 'SB_150', 'AVG_mlb', 'OBP_mlb', 'SLG_mlb'
        ]
        
    else:  # pitcher
        mlb_stats = mlb_stats[['IDfg', 'G', 'IP', 'ERA', 'K%', 'BB%', 'GB%', 'WAR', 'Season']].copy()
        
        mlb_stats_grouped = mlb_stats.groupby('IDfg').agg({
            'G': 'sum',
            'WAR': 'sum',
            'IP': 'sum',
            'ERA': lambda x: weighted_avg(mlb_stats.loc[x.index], 'ERA', 'IP'),
            'K%': lambda x: weighted_avg(mlb_stats.loc[x.index], 'K%', 'IP'),
            'BB%': lambda x: weighted_avg(mlb_stats.loc[x.index], 'BB%', 'IP'),
            'GB%': lambda x: weighted_avg(mlb_stats.loc[x.index], 'GB%', 'IP'),
            'Season': 'min'
        }).reset_index()
        
        mlb_stats_grouped['WAR_150'] = (mlb_stats_grouped['WAR'] * 150) / mlb_stats_grouped['G']

        rename_dict = {
            'IP_x': 'IP_minors',
            'K%_x': 'K_pct_minors',
            'BB%_x': 'BB_pct_minors',
            'GB%_x': 'GB_pct_minors',
            'ERA_x': 'ERA_minors',
            'xFIP': 'xFIP_minors',
            'IP_y': 'IP_mlb',
            'ERA_y': 'ERA_mlb',
            'K%_y': 'K_pct_mlb',
            'BB%_y': 'BB_pct_mlb',
            'GB%_y': 'GB_pct_mlb'
        }
        
        keep_columns = [
            # Predictors
            'Age', 'Top_100', 'Org_Rk',
            'FB_future', 'SL_future', 'CB_future', 'CH_future', 'CMD_future', 'FV_future',
            'IP_minors', 'ERA_minors', 'xFIP_minors', 'K_pct_minors', 'BB_pct_minors', 'GB_pct_minors',
            'Year',
            
            # Targets
            'WAR_150', 'ERA_mlb', 'K_pct_mlb', 'BB_pct_mlb', 'GB_pct_mlb'
        ]

    # Merge datasets
    matched_df = pd.merge(
        prospects,
        mlb_stats_grouped,
        left_on='playerId',
        right_on='IDfg',
        how='left'
    )
    
    # Rename columns
    matched_df = matched_df.rename(columns=rename_dict)
    
    # After merging, before processing
    print(f"\nMatched {position} data shape before processing: {matched_df.shape}")
    print("Year distribution:")
    print(matched_df['Year'].value_counts().sort_index())
    
    # Process missing values
    matched_df = process_missing_values(matched_df, position)
    matched_df = fill_missing_performance(matched_df, position)
    
    print(f"\nMatched {position} data shape after processing: {matched_df.shape}")
    print("\nColumns with missing values:")
    print(matched_df.isnull().sum()[matched_df.isnull().sum() > 0])
    
    matched_df = matched_df[keep_columns]
    return matched_df

def save_matched_data(hitters_data, pitchers_data, output_hitters_file, output_pitchers_file):
    hitters_data.to_csv(output_hitters_file, index=False, encoding='utf-8-sig')
    pitchers_data.to_csv(output_pitchers_file, index=False, encoding='utf-8-sig')

def main():
    # Get absolute path
    base_dir = os.path.abspath('./')
    print(f"Base directory: {base_dir}")
    
    prospect_years = range(2017, 2022)
    
    hitter_prospect_files = [
        os.path.join(base_dir,'raw//batters', f'{year}.csv') 
        for year in prospect_years
    ]
    
    pitcher_prospect_files = [
        os.path.join(base_dir,'raw//pitchers', f'{year}.csv')
        for year in prospect_years
    ]
    
    # Verify paths exist
    for path in hitter_prospect_files + pitcher_prospect_files:
        if not os.path.exists(path):
            print(f"Missing file: {path}")
    mlb_hitters_file = os.path.join(base_dir, 'raw//batters//mlb_batting_data_2000_2024.csv')
    mlb_pitchers_file = os.path.join(base_dir, 'raw//pitchers//mlb_pitching_data_2000_2024.csv')
    output_hitters_file = os.path.join(base_dir, 'processed//matched_hitters.csv')
    output_pitchers_file = os.path.join(base_dir, 'processed//matched_pitchers.csv')
    
    # Ensure directories exist
    os.makedirs(os.path.dirname(output_hitters_file), exist_ok=True)
    os.makedirs(os.path.dirname(output_pitchers_file), exist_ok=True)
    
    # Load data
    hitter_prospects, mlb_hitters, mlb_pitchers = load_data(hitter_prospect_files, mlb_hitters_file, mlb_pitchers_file)
    pitcher_prospects, _, _ = load_data(pitcher_prospect_files, mlb_hitters_file, mlb_pitchers_file)
    
    # Match prospects with MLB data
    matched_hitters = match_prospects_with_mlb(hitter_prospects, mlb_hitters, 'hitter')
    matched_pitchers = match_prospects_with_mlb(pitcher_prospects, mlb_pitchers, 'pitcher')
    
    # Save matched data
    save_matched_data(matched_hitters, matched_pitchers, output_hitters_file, output_pitchers_file)

if __name__ == "__main__":
    main()