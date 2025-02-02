export interface BaseProspect {
    Name: string;
    Age: number;
    Organization: string;
    Top_100: number;
    Org_Rk: number;
    FV_future: number;
}

export interface HitterProspect extends BaseProspect {
    Hit_future: number;
    Game_future: number;
    Raw_future: number;
    Spd_future: number;
    Predicted_WAR: number;
    Predicted_WAR_Lower: number;
    Predicted_WAR_Upper: number;
    Predicted_wRC: number;
    Predicted_wRC_Lower: number;
    Predicted_wRC_Upper: number;
}

export interface PitcherProspect extends BaseProspect {
    FB_future: number;
    SL_future: number;
    CB_future: number;
    CH_future: number;
    CMD_future: number;
    Predicted_WAR: number;
    Predicted_WAR_Lower: number;
    Predicted_WAR_Upper: number;
    Predicted_ERA: number;
    Predicted_ERA_Lower: number;
    Predicted_ERA_Upper: number;
}

export type ProspectType = 'hitter' | 'pitcher';
export type Prospect = HitterProspect | PitcherProspect;