import pandas as pd
import json
def calculate_era_from_war(war: float, innings: float, league_era: float = 4.50) -> float:
    """Calculate ERA from WAR value and projected innings"""
    run_value = war * 6  # Approximate runs saved per WAR
    era_diff = (run_value * 9) / innings  # Convert to ERA scale
    return league_era - era_diff

def get_projected_innings(pos: str) -> float:
    """Get projected innings based on pitcher role"""
    if pos == 'SP':
        return 180.0
    elif pos == 'MIRP':
        return 90.0
    elif pos == 'SIRP':
        return 50.0
    return 180.0  # Default to SP innings

def adjust_war_by_role(war: float, pos: str) -> float:
    """Adjust WAR based on pitcher role"""
    if pos == 'SP':
        return war*1.4
    elif pos == 'MIRP':
        return war * 0.5
    elif pos == 'SIRP':
        return war * 0.3
    return war  # Default to SP value
def get_fv_multiplier(fv: str) -> float:
    """Get WAR multiplier based on FV grade"""
    #if war is positive:
    try:
        fv_value = int(fv)
        if fv_value >= 70: return 1.4
        elif fv_value >= 65: return 1.3
        elif fv_value >= 60: return 1.3
        elif fv_value >= 55: return 1.2
        elif fv_value >= 50: return 1.1
        elif fv_value >= 45: return 1.0
        else: return 1
    except:
        return 1.0

def calculate_wrc_from_war(war: float, pos: str) -> float:
    """Calculate wRC+ from WAR based on position"""
    base_multiplier = 15  # Base WAR to wRC+ conversion
    
    position_multipliers = {
        'C': 7,    # Defense-first position
        'SS': 9,   # Defense-first position
        'CF': 9,   # Defense-first position
        '2B': 11,   # Balance position
        '3B': 11,   # Standard position
        'RF': 12,   # Offense-first position
        'LF': 12,   # Offense-first position
        '1B': 14,   # Offense-only position
        'DH': 16    # Pure offense position
    }
    
    multiplier = position_multipliers.get(pos, 15)  # Default to standard position
    war_above_average = war - 2  # Adjust WAR relative to 2 WAR baseline
    return 100 + (war_above_average * multiplier)  # 100 is league average
def process_data():
    # Load prediction files
    hitter_war = pd.read_csv('predictions/2024_hitter_war_predictions.csv')
    pitcher_war = pd.read_csv('predictions/2024_pitcher_war_predictions.csv')
    
    # Load prospect data
    hitters = pd.read_csv('raw/batters/2024.csv')
    pitchers = pd.read_csv('raw/pitchers/2024.csv')



    # Merge with corrected column names
    hitter_final = pd.merge(
        hitter_war,
        hitters[['Name', 'Age', 'Org', 'Pos', 'Top 100', 'Org Rk', 
                'Hit', 'Game', 'Raw', 'Spd', 'FV', 'playerId',
                'PA', 'OBP', 'SLG', 'ISO', 'BB%', 'K%', 'wRC+']],
        on=['Name', 'Age'],
        how='left'
    )
    
    pitcher_final = pd.merge(
        pitcher_war,
        pitchers[['Name', 'Org', 'Pos', 'Top 100', 'Org Rk',
                 'FB', 'SL', 'CB', 'CH', 'CMD', 'FV', 'playerId',
                 'IP', 'K%', 'BB%', 'GB%', 'ERA', 'xFIP']],
        on='Name',
        how='left'
    )

    # Calculate ERA after WAR adjustment
    pitcher_final['Projected_IP'] = pitcher_final['Pos'].apply(get_projected_innings)
    # Apply FV scaling to hitters
    hitter_final['Predicted_WAR'] = hitter_final.apply(
        lambda x: x['Predicted_WAR'] * get_fv_multiplier(x['FV']),
        axis=1
    )
    
    # Apply FV scaling to pitchers after role adjustment
    pitcher_final['Predicted_WAR'] = pitcher_final.apply(
        lambda x: x['Predicted_WAR'] * get_fv_multiplier(x['FV']),
        axis=1
    )
    
    # Adjust WAR based on pitcher role
    pitcher_final['Predicted_WAR'] = pitcher_final.apply(
        lambda x: adjust_war_by_role(x['Predicted_WAR'], x['Pos']),
        axis=1
    )
    # Recalculate ERA with new WAR values
    pitcher_final['Predicted_ERA'] = pitcher_final.apply(
        lambda x: calculate_era_from_war(x['Predicted_WAR'], x['Projected_IP']),
        axis=1
    )
    hitter_final['Age'] = hitter_final['Age'].round(1)
    hitter_final['Predicted_WAR'] = hitter_final['Predicted_WAR'].round(1)
    # Calculate wRC+ from adjusted WAR
    hitter_final['Predicted_wRC+'] = hitter_final.apply(
        lambda x: calculate_wrc_from_war(x['Predicted_WAR'], x['Pos']),
        axis=1
    )
    pitcher_final['Age'] = pitcher_final['Age'].round(1)
    pitcher_final['Predicted_WAR'] = pitcher_final['Predicted_WAR'].round(1)
    pitcher_final['Predicted_ERA'] = pitcher_final['Predicted_ERA'].round(2)
    hitter_final['PA'] = hitter_final['PA'].astype(float).round(0)
    hitter_final['OBP'] = hitter_final['OBP'].astype(float).round(3)
    hitter_final['SLG'] = hitter_final['SLG'].astype(float).round(3)
    hitter_final['ISO'] = hitter_final['ISO'].astype(float).round(3)
    hitter_final['BB%'] = hitter_final['BB%'].astype(float).round(3)
    hitter_final['K%'] = hitter_final['K%'].astype(float).round(3)
    hitter_final['Predicted_wRC+'] = hitter_final['Predicted_wRC+'].astype(float).round(0)
    hitter_final['wRC+'] = hitter_final['wRC+'].astype(float).round(0)


    pitcher_final['IP'] = pitcher_final['IP'].astype(float).round(1)
    pitcher_final['ERA'] = pitcher_final['ERA'].astype(float).round(2)
    pitcher_final['xFIP'] = pitcher_final['xFIP'].astype(float).round(2)
    pitcher_final['K%'] = pitcher_final['K%'].astype(float).round(3)
    pitcher_final['BB%'] = pitcher_final['BB%'].astype(float).round(3)
    pitcher_final['GB%'] = pitcher_final['GB%'].astype(float).round(3)
    # Replace NaN values with 'N/A'
    hitter_final = hitter_final.fillna('N/A')
    pitcher_final = pitcher_final.fillna('N/A')

    #rewrite columns with % or + in them
    hitter_final = hitter_final.rename(columns={
        'BB%': 'BB_pct',
        'K%': 'K_pct',
        'wRC+': 'wRC_plus',
        'Predicted_wRC+': 'Predicted_wRC',
        'Org Rk': 'Org_Rk'
    })
    pitcher_final = pitcher_final.rename(columns={
        'K%': 'K_pct',
        'BB%': 'BB_pct',
        'GB%': 'GB_pct',
        'Org Rk': 'Org_Rk',
    })
    # Drop unnecessary columns
    hitter_final = hitter_final.drop(columns=['Lower_Bound', 'Upper_Bound'])
    pitcher_final = pitcher_final.drop(columns=['Lower_Bound', 'Upper_Bound'])
    
    # Convert to JSON structure
    hitter_json = {"prospects": hitter_final.to_dict(orient='records')}
    pitcher_json = {"prospects": pitcher_final.to_dict(orient='records')}
    
    return hitter_json, pitcher_json

if __name__ == "__main__":
    hitter_data, pitcher_data = process_data()
    
    with open('hitter_predictions.json', 'w') as f:
        json.dump(hitter_data, f, indent=2)
    
    with open('pitcher_predictions.json', 'w') as f:
        json.dump(pitcher_data, f, indent=2)