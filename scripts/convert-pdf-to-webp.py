"""
PDF → WebP 변환 스크립트 (Python)

사용법:
    python scripts/convert-pdf-to-webp.py

필요한 패키지:
    pip install pdf2image pillow

Windows 사용자:
    Poppler for Windows 설치 필요
    https://github.com/oschwartz10612/poppler-windows/releases
"""

import os
from pathlib import Path
from pdf2image import convert_from_path
from PIL import Image

# 설정
DPI = 150  # 모바일 가독성 충분
QUALITY = 85  # 품질과 크기 균형
INPUT_DIR = Path(__file__).parent.parent / 'temp-pdfs'
OUTPUT_DIR = INPUT_DIR

# PDF 파일 목록
PDF_FILES = ['step1.pdf', 'step2.pdf', 'step3.pdf', 'step4.pdf']

def convert_pdf_to_webp(pdf_path, output_path):
    """PDF 파일을 WebP 이미지로 변환"""
    try:
        print(f'📄 변환 중: {pdf_path.name}...')
        
        # PDF를 이미지로 변환
        images = convert_from_path(
            str(pdf_path),
            dpi=DPI,
            fmt='png'
        )
        
        if not images:
            print(f'❌ 실패: {pdf_path.name} (이미지가 없습니다)')
            return False
        
        # 첫 번째 페이지만 사용 (여러 페이지가 있으면 첫 페이지만)
        # 여러 페이지가 있는 경우, 모든 페이지를 하나의 이미지로 합칠 수도 있습니다
        if len(images) > 1:
            print(f'   ⚠️  경고: {len(images)}개 페이지가 있습니다. 첫 페이지만 변환합니다.')
        
        # WebP로 저장
        images[0].save(
            str(output_path),
            'WEBP',
            quality=QUALITY,
            optimize=True
        )
        
        # 파일 크기 확인
        file_size = output_path.stat().st_size
        file_size_mb = file_size / (1024 * 1024)
        print(f'✅ 완료: {output_path.name} ({file_size_mb:.2f} MB)')
        
        return True
        
    except Exception as e:
        print(f'❌ 실패: {pdf_path.name}')
        print(f'   오류: {str(e)}')
        return False

def main():
    print('🔄 PDF → WebP 변환 시작...\n')
    
    # 입력 디렉토리 확인
    if not INPUT_DIR.exists():
        print(f'❌ 입력 디렉토리를 찾을 수 없습니다: {INPUT_DIR}')
        print('   먼저 PDF 파일을 다운로드하세요: node scripts/download-pdfs.js')
        return
    
    success_count = 0
    fail_count = 0
    
    for pdf_file in PDF_FILES:
        pdf_path = INPUT_DIR / pdf_file
        
        if not pdf_path.exists():
            print(f'⚠️  건너뜀: {pdf_file} (파일을 찾을 수 없습니다)')
            continue
        
        webp_file = pdf_file.replace('.pdf', '.webp')
        webp_path = OUTPUT_DIR / webp_file
        
        if convert_pdf_to_webp(pdf_path, webp_path):
            success_count += 1
        else:
            fail_count += 1
        
        print()
    
    print('🔄 변환 완료!')
    print(f'✅ 성공: {success_count}개')
    if fail_count > 0:
        print(f'❌ 실패: {fail_count}개')
    
    if success_count > 0:
        print(f'\n📁 변환된 파일 위치: {OUTPUT_DIR}')
        print('\n다음 단계:')
        print('  node scripts/upload-webp.js')

if __name__ == '__main__':
    main()














