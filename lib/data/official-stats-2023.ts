
export interface YearlyStat {
  year: number;
  
  apply_total: number;
  apply_accident: number;
  apply_disease: number;
  apply_commute?: number;

  approve_total: number;
  approve_accident: number;
  approve_disease: number;
  approve_commute?: number;

  duration_total?: number;
  duration_accident?: number;
  duration_disease?: number;
}

export const OFFICIAL_STATS_HISTORY: YearlyStat[] = [
  {
    year: 2014,
    apply_total: 97644, apply_accident: 88433, apply_disease: 9211,
    approve_total: 87652, approve_accident: 83261, approve_disease: 4391
  },
  {
    year: 2015,
    apply_total: 97932, apply_accident: 87815, apply_disease: 10117,
    approve_total: 87550, approve_accident: 82709, approve_disease: 4841
  },
  {
    year: 2016,
    apply_total: 97252, apply_accident: 86951, apply_disease: 10301,
    approve_total: 87215, approve_accident: 82474, approve_disease: 4741
  },
  {
    year: 2017,
    apply_total: 98093, apply_accident: 86421, apply_disease: 11672,
    approve_total: 87792, approve_accident: 81811, approve_disease: 5981,
    duration_total: 31.0, duration_accident: 15.1, duration_disease: 149.2
  },
  {
    year: 2018,
    apply_total: 114687, apply_accident: 95966, apply_disease: 12975, apply_commute: 5746,
    approve_total: 104901, approve_accident: 91911, approve_disease: 7733, approve_commute: 5257,
    duration_total: 33.7, duration_accident: 16.7, duration_disease: 166.8
  },
  {
    year: 2019,
    apply_total: 124988, apply_accident: 99159, apply_disease: 18266, apply_commute: 7563,
    approve_total: 113727, approve_accident: 95651, approve_disease: 11075, approve_commute: 7001,
    duration_total: 40.9, duration_accident: 16.1, duration_disease: 186.0
  },
  {
    year: 2020,
    apply_total: 123921, apply_accident: 97555, apply_disease: 18634, apply_commute: 7732,
    approve_total: 112670, approve_accident: 94081, approve_disease: 11432, approve_commute: 7157,
    duration_total: 39.1, duration_accident: 15.5, duration_disease: 172.4
  },
  {
    year: 2021,
    apply_total: 141727, apply_accident: 107924, apply_disease: 24871, apply_commute: 8932,
    approve_total: 128466, approve_accident: 104411, approve_disease: 15699, approve_commute: 8356,
    duration_total: 43.4, duration_accident: 15.3, duration_disease: 175.8
  },
  {
    year: 2022,
    apply_total: 150862, apply_accident: 112740, apply_disease: 28796, apply_commute: 9326,
    approve_total: 135983, approve_accident: 109125, approve_disease: 18043, approve_commute: 8815,
    duration_total: 47.6, duration_accident: 15.9, duration_disease: 182.0
  },
  {
    year: 2023,
    apply_total: 162947, apply_accident: 119529, apply_disease: 31666, apply_commute: 11752,
    approve_total: 144965, approve_accident: 115535, approve_disease: 18333, approve_commute: 11097,
    duration_total: 55.0, duration_accident: 16.5, duration_disease: 214.5
  }
];

export const LATEST_OFFICIAL_STAT = OFFICIAL_STATS_HISTORY[OFFICIAL_STATS_HISTORY.length - 1];
