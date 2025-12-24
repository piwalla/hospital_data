# PDF → WebP 변환 가이드

이 가이드에서는 다운로드한 PDF 파일을 WebP 이미지로 변환하는 방법을 안내합니다.

## 방법 1: 온라인 변환 도구 사용 (가장 간단) ⭐ 권장

### SmallPDF (https://smallpdf.com/kr/pdf-to-jpg)
1. https://smallpdf.com/kr/pdf-to-jpg 접속
2. "PDF를 JPG로" 선택
3. `temp-pdfs/step1.pdf` 파일 업로드
4. "변환" 클릭
5. 다운로드한 이미지를 WebP로 변환
   - 온라인 도구: https://convertio.co/kr/jpg-webp/
   - 또는 이미지 편집 프로그램 사용

### CloudConvert (https://cloudconvert.com/pdf-to-webp)
1. https://cloudconvert.com/pdf-to-webp 접속
2. PDF 파일 업로드
3. 설정:
   - **Quality**: 85
   - **DPI**: 150
4. "변환" 클릭
5. 다운로드 후 `temp-pdfs/` 폴더에 저장
   - 파일명: `step1.webp`, `step2.webp`, `step3.webp`, `step4.webp`

## 방법 2: Python 사용 (로컬)

### 1. Python 설치
- Python 3.7 이상 필요
- https://www.python.org/downloads/

### 2. 필요한 패키지 설치
```bash
pip install pdf2image pillow
```

**Windows 사용자 추가 설치:**
- Poppler for Windows 다운로드: https://github.com/oschwartz10612/poppler-windows/releases
- 압축 해제 후 `poppler/bin` 폴더를 PATH에 추가

### 3. 변환 스크립트 실행
```bash
python scripts/convert-pdf-to-webp.py
```

## 방법 3: ImageMagick 사용 (명령줄)

### 1. ImageMagick 설치
- Windows: https://imagemagick.org/script/download.php
- macOS: `brew install imagemagick`
- Linux: `sudo apt-get install imagemagick`

### 2. 변환 명령어 실행
```bash
cd temp-pdfs

# 각 PDF 파일을 WebP로 변환
magick step1.pdf -density 150 -quality 85 step1.webp
magick step2.pdf -density 150 -quality 85 step2.webp
magick step3.pdf -density 150 -quality 85 step3.webp
magick step4.pdf -density 150 -quality 85 step4.webp
```

## 변환 설정

- **DPI**: 150 (모바일 가독성 충분)
- **Quality**: 85 (품질과 크기 균형)
- **포맷**: WebP

## 변환 후 확인사항

1. 파일 크기 확인 (예상: 900KB-1.5MB/파일)
2. 이미지 품질 확인 (텍스트 가독성)
3. 파일명 확인 (`step1.webp`, `step2.webp`, `step3.webp`, `step4.webp`)

## 다음 단계

변환된 WebP 파일을 `temp-pdfs/` 폴더에 저장한 후:
```bash
node scripts/upload-webp.js
```












