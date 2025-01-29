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

def match_prospects_with_mlb(prospects, mlb_stats, position):
    prospects = process_future_grades(prospects, position)
    if position == 'hitter':
        mlb_stats = mlb_stats[['IDfg', 'G', 'PA', 'HR', 'SB', 'AVG', 
                              'OBP', 'SLG', 'wRC+', 'L-WAR', 'BB%', 'K%', 
                              'Season']].copy()
        
        # Group by IDfg and calculate stats
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
            'Season': 'min'  # Changed from list to single agg
        }).reset_index()
        # Column renaming for hitters
        rename_dict = {
            'PA_x': 'PA_minors',
            'OBP_x': 'OBP_minors',
            'SLG_x': 'SLG_minors',
            'BB%_x': 'BB%_minors',
            'K%_x': 'K%_minors',
            'wRC+_x': 'wRC+_minors',
            'PA_y': 'PA_mlb',
            'OBP_y': 'OBP_mlb',
            'SLG_y': 'SLG_mlb',
            'wRC+_y': 'wRC+_mlb',
            'BB%_y': 'BB%_mlb',
            'K%_y': 'K%_mlb'
        }
        
        # Calculate per-150 stats
        mlb_stats_grouped['WAR_150'] = (mlb_stats_grouped['L-WAR'] * 150) / mlb_stats_grouped['G']
        mlb_stats_grouped['HR_150'] = (mlb_stats_grouped['HR'] * 150) / mlb_stats_grouped['G']
        mlb_stats_grouped['SB_150'] = (mlb_stats_grouped['SB'] * 150) / mlb_stats_grouped['G']
        
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
        rename_dict = {
            'IP_x': 'IP_minors',
            'K%_x': 'K%_minors',
            'BB%_x': 'BB%_minors',
            'GB%_x': 'GB%_minors',
            'ERA_x': 'ERA_minors',
            'IP_y': 'IP_mlb',
            'ERA_y': 'ERA_mlb',
            'K%_y': 'K%_mlb',
            'BB%_y': 'BB%_mlb',
            'GB%_y': 'GB%_mlb'
        }

        
        mlb_stats_grouped['WAR_150'] = (mlb_stats_grouped['WAR'] * 150) / mlb_stats_grouped['G']

    matched_df = pd.merge(
        prospects,
        mlb_stats_grouped,
        left_on='playerId',
        right_on='IDfg',
        how='left'
    )
    
    # Rename columns
    matched_df = matched_df.rename(columns=rename_dict)
    

    
    # Fill NaN values
    matched_df = matched_df.fillna({
        'G': 0,
        'WAR_150': 0,
        'HR_150': 0 if position == 'hitter' else None,
        'SB_150': 0 if position == 'hitter' else None
    })
    
    return matched_df

def save_matched_data(hitters_data, pitchers_data, output_hitters_file, output_pitchers_file):
    hitters_data.to_csv(output_hitters_file, index=False, encoding='utf-8-sig')
    pitchers_data.to_csv(output_pitchers_file, index=False, encoding='utf-8-sig')

def main():
    # Get absolute path
    base_dir = os.path.abspath('./data')
    print(f"Base directory: {base_dir}")
    
    prospect_years = range(2017, 2025)
    
    hitter_prospect_files = [
        os.path.join(base_dir,'batters', f'{year}.csv') 
        for year in prospect_years
    ]
    
    pitcher_prospect_files = [
        os.path.join(base_dir,'pitchers', f'{year}.csv')
        for year in prospect_years
    ]
    
    # Verify paths exist
    for path in hitter_prospect_files + pitcher_prospect_files:
        if not os.path.exists(path):
            print(f"Missing file: {path}")
    mlb_hitters_file = os.path.join(base_dir, 'batters//mlb_batting_data_2000_2024.csv')
    mlb_pitchers_file = os.path.join(base_dir, 'pitchers//mlb_pitching_data_2000_2024.csv')
    output_hitters_file = os.path.join(base_dir, 'matched_hitters.csv')
    output_pitchers_file = os.path.join(base_dir, 'matched_pitchers.csv')
    
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