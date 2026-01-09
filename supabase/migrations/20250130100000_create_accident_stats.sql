-- Create table for aggregated industrial accident statistics
CREATE TABLE IF NOT EXISTS industrial_accident_stats (
    id SERIAL PRIMARY KEY,
    injury_name TEXT NOT NULL,         -- 상병명 (예: 소음성 난청, 허리 디스크)
    region_name TEXT NOT NULL,         -- 지역명 (예: 서울 강남구)
    
    total_applications INTEGER DEFAULT 0, -- 총 신청 수 (OPA020MT_03_INFO 기준)
    total_approvals INTEGER DEFAULT 0,    -- 총 승인 수 (OPA020MT_04_INFO 기준)
    
    avg_processing_days NUMERIC,       -- 평균 승인 소요 기간 (일)
    avg_treatment_days NUMERIC,        -- 평균 요양 기간 (일)
    
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique combination for upserting
    UNIQUE(injury_name, region_name)
);

-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS idx_accident_stats_injury ON industrial_accident_stats(injury_name);
CREATE INDEX IF NOT EXISTS idx_accident_stats_region ON industrial_accident_stats(region_name);
