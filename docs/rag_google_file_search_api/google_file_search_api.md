
Gemini API를 사용하면 파일 검색 도구를 통해 검색 증강 생성 ('RAG')이 가능합니다. 파일 검색은 제공된 프롬프트를 기반으로 관련 정보를 빠르게 검색할 수 있도록 데이터를 가져오고, 청크로 나누고, 색인을 생성합니다. 이 정보는 모델의 컨텍스트로 사용되어 모델이 더 정확하고 관련성 있는 답변을 제공할 수 있습니다.

개발자가 저렴한 비용으로 파일 검색을 사용할 수 있도록 쿼리 시 파일 저장 및 임베딩 생성을 무료로 제공합니다. 파일을 처음 색인 생성할 때만 임베딩 생성 비용 (해당 임베딩 모델 비용)과 일반 Gemini 모델 입력 / 출력 토큰 비용을 지불하면 됩니다. 이 새로운 청구 패러다임 덕분에 파일 검색 도구를 더 쉽고 비용 효율적으로 빌드하고 확장할 수 있습니다.

파일 검색 스토어에 직접 업로드
다음 예시에서는 파일 검색 스토어에 파일을 직접 업로드하는 방법을 보여줍니다.

Python
자바스크립트

from google import genai
from google.genai import types
import time

client = genai.Client()

# File name will be visible in citations
file_search_store = client.file_search_stores.create(config={'display_name': 'your-fileSearchStore-name'})

operation = client.file_search_stores.upload_to_file_search_store(
  file='sample.txt',
  file_search_store_name=file_search_store.name,
  config={
      'display_name' : 'display-file-name',
  }
)

while not operation.done:
    time.sleep(5)
    operation = client.operations.get(operation)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="""Can you tell me about [insert question]""",
    config=types.GenerateContentConfig(
        tools=[
            types.Tool(
                file_search=types.FileSearch(
                    file_search_store_names=[file_search_store.name]
                )
            )
        ]
    )
)

print(response.text)
자세한 내용은 uploadToFileSearchStore API 참조를 확인하세요.

파일 가져오기
또는 기존 파일을 업로드하고 파일 검색 저장소로 가져올 수 있습니다.

Python
자바스크립트

from google import genai
from google.genai import types
import time

client = genai.Client()

# File name will be visible in citations
sample_file = client.files.upload(file='sample.txt', config={'name': 'display_file_name'})

file_search_store = client.file_search_stores.create(config={'display_name': 'your-fileSearchStore-name'})

operation = client.file_search_stores.import_file(
    file_search_store_name=file_search_store.name,
    file_name=sample_file.name
)

while not operation.done:
    time.sleep(5)
    operation = client.operations.get(operation)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="""Can you tell me about [insert question]""",
    config=types.GenerateContentConfig(
        tools=[
            types.Tool(
                file_search=types.FileSearch(
                    file_search_store_names=[file_search_store.name]
                )
            )
        ]
    )
)

print(response.text)
자세한 내용은 importFile API 참조를 확인하세요.

청크 구성
파일을 파일 검색 스토어로 가져오면 파일이 자동으로 청크로 분할되고, 삽입되고, 색인이 생성되고, 파일 검색 스토어로 업로드됩니다. 청크 전략을 더 세부적으로 관리해야 하는 경우 chunking_config 설정을 지정하여 청크당 최대 토큰 수와 중복되는 최대 토큰 수를 설정할 수 있습니다.

Python
자바스크립트

operation = client.file_search_stores.upload_to_file_search_store(
    file_search_store_name=file_search_store.name,
    file_name=sample_file.name,
    config={
        'chunking_config': {
          'white_space_config': {
            'max_tokens_per_chunk': 200,
            'max_overlap_tokens': 20
          }
        }
    }
)
파일 검색 저장소를 사용하려면 업로드 및 가져오기 예시에 표시된 대로 generateContent 메서드에 도구로 전달합니다.

작동 방식
파일 검색은 시맨틱 검색이라는 기법을 사용하여 사용자 프롬프트와 관련된 정보를 찾습니다. 표준 키워드 기반 검색과 달리 시맨틱 검색은 질문의 의미와 컨텍스트를 이해합니다.

파일을 가져오면 텍스트의 시맨틱 의미를 포착하는 임베딩이라는 숫자 표현으로 변환됩니다. 이러한 임베딩은 특수 파일 검색 데이터베이스에 저장됩니다. 쿼리를 입력하면 쿼리도 임베딩으로 변환됩니다. 그런 다음 시스템은 파일 검색을 실행하여 파일 검색 저장소에서 가장 유사하고 관련성 높은 문서 청크를 찾습니다.

파일 검색 uploadToFileSearchStore API를 사용하는 과정은 다음과 같습니다.

파일 검색 스토어 만들기: 파일 검색 스토어에는 파일에서 처리된 데이터가 포함됩니다. 시맨틱 검색이 작동하는 임베딩의 영구 컨테이너입니다.

파일을 업로드하고 파일 검색 스토어로 가져오기: 파일을 업로드하고 결과를 파일 검색 스토어로 동시에 가져옵니다. 이렇게 하면 원시 문서를 참조하는 임시 File 객체가 생성됩니다. 그런 다음 데이터가 청크로 분할되고, 파일 검색 임베딩으로 변환되고, 색인이 생성됩니다. File 객체는 48시간 후에 삭제되지만 파일 검색 스토어로 가져온 데이터는 삭제할 때까지 무기한 저장됩니다.

파일 검색으로 쿼리: 마지막으로 generateContent 호출에서 FileSearch 도구를 사용합니다. 도구 구성에서 검색할 FileSearchStore를 가리키는 FileSearchRetrievalResource를 지정합니다. 이렇게 하면 모델이 해당 특정 파일 검색 스토어에서 시맨틱 검색을 실행하여 대답을 그라운딩하는 데 필요한 관련 정보를 찾습니다.

파일 검색의 색인 생성 및 쿼리 프로세스
파일 검색의 색인 생성 및 쿼리 프로세스
이 다이어그램에서 문서에서 임베딩 모델(gemini-embedding-001 사용)로 연결되는 점선은 uploadToFileSearchStore API (파일 스토리지 우회)를 나타냅니다. 그렇지 않으면 Files API를 사용하여 파일을 별도로 만든 후 가져오면 색인 생성 프로세스가 Documents에서 File storage로 이동한 후 Embedding model로 이동합니다.

파일 검색 스토어
파일 검색 저장소는 문서 임베딩의 컨테이너입니다. 파일 API를 통해 업로드된 원시 파일은 48시간 후에 삭제되지만 파일 검색 스토어로 가져온 데이터는 수동으로 삭제할 때까지 무기한 저장됩니다. 문서를 정리하기 위해 여러 파일 검색 저장소를 만들 수 있습니다. FileSearchStore API를 사용하면 파일 검색 저장소를 생성, 나열, 가져오기, 삭제하여 관리할 수 있습니다. 파일 검색 스토어 이름은 전역 범위입니다.

파일 검색 저장소를 관리하는 방법의 몇 가지 예는 다음과 같습니다.

Python
자바스크립트
REST

file_search_store = client.file_search_stores.create(config={'display_name': 'my-file_search-store-123'})

for file_search_store in client.file_search_stores.list():
    print(file_search_store)

my_file_search_store = client.file_search_stores.get(name='fileSearchStores/my-file_search-store-123')

client.file_search_stores.delete(name='fileSearchStores/my-file_search-store-123', config={'force': True})
파일 스토어의 문서를 관리하는 데 관련된 메서드와 필드의 파일 검색 문서 API 참조

파일 메타데이터
파일을 필터링하거나 추가 컨텍스트를 제공하는 데 도움이 되도록 파일에 맞춤 메타데이터를 추가할 수 있습니다. 메타데이터는 키-값 쌍의 집합입니다.

Python
자바스크립트

op = client.file_search_stores.import_file(
    file_search_store_name=file_search_store.name,
    file_name=sample_file.name,
    custom_metadata=[
        {"key": "author", "string_value": "Robert Graves"},
        {"key": "year", "numeric_value": 1934}
    ]
)
이는 파일 검색 저장소에 여러 문서가 있고 그중 일부만 검색하려는 경우에 유용합니다.

Python
자바스크립트
REST

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Tell me about the book 'I, Claudius'",
    config=types.GenerateContentConfig(
        tools=[
            types.Tool(
                file_search=types.FileSearch(
                    file_search_store_names=[file_search_store.name],
                    metadata_filter="author=Robert Graves",
                )
            )
        ]
    )
)

print(response.text)
metadata_filter의 목록 필터 문법 구현에 관한 안내는 google.aip.dev/160에서 확인할 수 있습니다.

인용
파일 검색을 사용하면 모델의 대답에 업로드된 문서의 어떤 부분이 대답을 생성하는 데 사용되었는지 명시하는 인용이 포함될 수 있습니다. 이를 통해 사실 확인 및 검증이 가능합니다.

응답의 grounding_metadata 속성을 통해 인용 정보에 액세스할 수 있습니다.

Python
자바스크립트

print(response.candidates[0].grounding_metadata)
구조화된 출력
Gemini 3 모델부터 파일 검색 도구를 구조화된 출력과 결합할 수 있습니다.

Python
자바스크립트
REST

from pydantic import BaseModel, Field

class Money(BaseModel):
    amount: str = Field(description="The numerical part of the amount.")
    currency: str = Field(description="The currency of amount.")

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="What is the minimum hourly wage in Tokyo right now?",
    config=types.GenerateContentConfig(
                tools=[
                    types.Tool(
                        file_search=types.FileSearch(
                            file_search_store_names=[file_search_store.name]
                        )
                    )
                ],
                responseMimeType="application/json",
                responseJsonSchema= Money.model_json_schema()
      )
)
result = Money.model_validate_json(response.text)
print(result)
지원되는 모델
다음 모델은 파일 검색을 지원합니다.

gemini-3-pro-preview
gemini-3-flash-preview
gemini-2.5-pro
gemini-2.5-flash 및 미리보기 버전
gemini-2.5-flash-lite 및 미리보기 버전