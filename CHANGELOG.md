# Change Log

## 1.9.0 (2026-04-12)

### Features

- **Common**

  - 응답 값 시간 포맷 변경: KST -> UTC (ex. requestTime, completeTime 등)
  - Get 명령어 기본 페이지네이션 사이즈 변경: 100개
  - List 명령어 기본 페이지네이션 사이즈 및 검색 범위 변경: 20개 / 30일
  - List 명령어 검색 날짜 UTC 포맷 지원: `Z` 접미사가 없는 경우 기본 KST로 처리
  - List 명령어 페이지네이션 조건 강화: `nextToken` 사용 시 최초 요청한 검색 옵션(시간, 사이즈 등) 변경 제한 및 필수값 검증 추가

- **Alimtalk**

  - **SendAlimtalk**: `useSmsFailover` 옵션 추가

- **SMS**

  - **GetSMSStatus**: 페이지네이션 기능 추가 및 응답 내 `메시지 발송 상태` 파라미터 추가
  - **GetSMSResult**: 응답 값에 `subject`, `fileId` 파라미터 추가
  - **ListSMSStatus**: 메시지 발송 목록 조회 명령어 추가 (SMS, LMS, MMS 지원)
