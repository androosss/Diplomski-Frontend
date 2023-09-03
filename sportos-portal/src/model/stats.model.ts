export interface Stats {
  winRatio: string;
  matches: {
    myTeam: string[];
    oppTeam: string[];
    date: string;
    score: string;
  };
}
