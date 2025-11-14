#!/bin/bash

# CSV 데이터 Import 및 Geocoding 스크립트
# 사용법: ./scripts/import-and-geocode.sh

BASE_URL="http://localhost:3000"

echo "=========================================="
echo "병원 데이터 Import 및 Geocoding 시작"
echo "=========================================="
echo ""

# 1단계: CSV 데이터 Import (주소만 저장)
echo "[1단계] CSV 데이터를 Supabase에 저장 중..."
echo "예상 소요 시간: 약 1-2분"
echo ""

RESPONSE=$(curl -s -X POST "${BASE_URL}/api/hospitals/import-csv?filename=hospital_data.csv")

SUCCESS=$(echo $RESPONSE | jq -r '.success')
if [ "$SUCCESS" = "true" ]; then
    TOTAL_ROWS=$(echo $RESPONSE | jq -r '.summary.totalRows')
    SAVED=$(echo $RESPONSE | jq -r '.summary.savedCount')
    UPDATED=$(echo $RESPONSE | jq -r '.summary.updatedCount')
    SKIPPED=$(echo $RESPONSE | jq -r '.summary.skippedCount')
    
    echo "✅ CSV Import 완료!"
    echo "   - 총 행 수: $TOTAL_ROWS"
    echo "   - 새로 저장: $SAVED"
    echo "   - 업데이트: $UPDATED"
    echo "   - 실패: $SKIPPED"
    echo ""
else
    ERROR=$(echo $RESPONSE | jq -r '.error')
    echo "❌ CSV Import 실패: $ERROR"
    exit 1
fi

# 2단계: Geocoding 배치 처리
echo "[2단계] 주소를 위도/경도로 변환 중..."
echo "예상 소요 시간: 약 15-20분 (6,000개 기준, 100개씩 처리)"
echo ""

BATCH_SIZE=100
DELAY_MS=150
TOTAL_PROCESSED=0
TOTAL_SUCCESS=0
TOTAL_FAILED=0

while true; do
    echo "배치 처리 중... (현재까지 처리: $TOTAL_PROCESSED개)"
    
    RESPONSE=$(curl -s -X POST "${BASE_URL}/api/hospitals/geocode-batch?limit=${BATCH_SIZE}&delayMs=${DELAY_MS}")
    
    SUCCESS=$(echo $RESPONSE | jq -r '.success')
    if [ "$SUCCESS" = "true" ]; then
        PROCESSED=$(echo $RESPONSE | jq -r '.summary.processed')
        SUCCESS_COUNT=$(echo $RESPONSE | jq -r '.summary.success')
        FAILED_COUNT=$(echo $RESPONSE | jq -r '.summary.failed')
        
        TOTAL_PROCESSED=$((TOTAL_PROCESSED + PROCESSED))
        TOTAL_SUCCESS=$((TOTAL_SUCCESS + SUCCESS_COUNT))
        TOTAL_FAILED=$((TOTAL_FAILED + FAILED_COUNT))
        
        echo "   - 이번 배치: 처리 $PROCESSED개, 성공 $SUCCESS_COUNT개, 실패 $FAILED_COUNT개"
        
        # 더 이상 처리할 데이터가 없으면 종료
        if [ "$PROCESSED" -eq 0 ]; then
            echo ""
            echo "✅ 모든 Geocoding 완료!"
            break
        fi
    else
        ERROR=$(echo $RESPONSE | jq -r '.error')
        echo "❌ Geocoding 실패: $ERROR"
        exit 1
    fi
    
    echo ""
done

echo ""
echo "=========================================="
echo "전체 작업 완료!"
echo "=========================================="
echo "총 처리: $TOTAL_PROCESSED개"
echo "성공: $TOTAL_SUCCESS개"
echo "실패: $TOTAL_FAILED개"
echo ""


