export interface BaseProspect {
    Name: string;
    Age: number;
    Org: string;
    Top_100: number;
    Org_Rk: number;
    FV_future: number;
    Pos: string;
}

interface MinorLeagueHitterStats {
    PA: number;
    OBP: number;
    SLG: number;
    ISO: number;
    BB_pct: number;
    K_pct: number;
    wRC_plus: number;
}

interface MinorLeaguePitcherStats {
    IP: number;
    K_pct: number;
    BB_pct: number;
    GB_pct: number;
    ERA: number;
    xFIP: number;
}

export interface HitterProspect extends BaseProspect, MinorLeagueHitterStats {
    Hit: string;
    Game: string;
    Raw: string;
    Spd: string;
    FV: string;
    Predicted_WAR: number;
    Predicted_wRC: number;
}

export interface PitcherProspect extends BaseProspect, MinorLeaguePitcherStats {
    FB: string;
    SL: string;
    CB: string;
    CH: string;
    CMD: string;
    FV: string;
    Predicted_WAR: number;
    Predicted_ERA: number;
}

export type ProspectType = 'hitter' | 'pitcher';
export type Prospect = HitterProspect | PitcherProspect;