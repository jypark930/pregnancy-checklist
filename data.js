// ============================================================
// 임신 체크리스트 - 데이터 정의 (5주차 ~ 40주차)
// ============================================================

const DEFAULT_CHECKLIST_DATA = [
  {
    week: 5,
    title: "임신 초기 시작",
    trimester: 1,
    items: [
      { id: "w5_1", text: "산부인과 첫 방문 예약하기", category: "health", done: false },
      { id: "w5_2", text: "엽산 복용 시작 (하루 400~800mcg)", category: "health", done: false },
      { id: "w5_3", text: "임신 사실 확인 (소변 또는 혈액 검사)", category: "health", done: false },
      { id: "w5_4", text: "담배·술·카페인 줄이기", category: "health", done: false },
    ]
  },
  {
    week: 6,
    title: "첫 산전 검사",
    trimester: 1,
    items: [
      { id: "w6_1", text: "산부인과 방문 → 태아 심장박동 확인", category: "health", done: false },
      { id: "w6_2", text: "혈액형 및 기본 혈액 검사", category: "health", done: false },
      { id: "w6_3", text: "임신 초기 증상(입덧 등) 대처법 알아보기", category: "mental", done: false },
      { id: "w6_4", text: "임신 사실을 가까운 가족에게 알리기", category: "mental", done: false },
    ]
  },
  {
    week: 7,
    title: "생활 환경 점검",
    trimester: 1,
    items: [
      { id: "w7_1", text: "약 복용 전 의사 상담 (기존 복용약 확인)", category: "health", done: false },
      { id: "w7_2", text: "유해 환경 노출 줄이기 (방사선, 화학물질)", category: "health", done: false },
      { id: "w7_3", text: "임산부 적합 운동 알아보기 (걷기 등)", category: "health", done: false },
    ]
  },
  {
    week: 8,
    title: "산전 검사 준비",
    trimester: 1,
    items: [
      { id: "w8_1", text: "산전 기본 검사 받기 (빈혈, 갑상선 등)", category: "health", done: false },
      { id: "w8_2", text: "풍진·수두 항체 검사 확인", category: "health", done: false },
      { id: "w8_3", text: "직장 임신 알림 시기 결정하기", category: "admin", done: false },
      { id: "w8_4", text: "임산부 복지 혜택 알아보기 (국가 바우처)", category: "admin", done: false },
    ]
  },
  {
    week: 9,
    title: "초기 적응",
    trimester: 1,
    items: [
      { id: "w9_1", text: "입덧 관리법 실천 (소량 자주 먹기)", category: "health", done: false },
      { id: "w9_2", text: "산모 수첩 만들기 / 앱 활용 시작", category: "prep", done: false },
      { id: "w9_3", text: "남편 임신 지원 교육 알아보기", category: "mental", done: false },
    ]
  },
  {
    week: 10,
    title: "1차 기형아 검사 준비",
    trimester: 1,
    items: [
      { id: "w10_1", text: "1차 기형아 검사(NT 검사) 예약", category: "health", done: false },
      { id: "w10_2", text: "모성보호 관련 법률 확인 (육아휴직, 출산휴가)", category: "admin", done: false },
      { id: "w10_3", text: "임산부 식단 계획 세우기", category: "health", done: false },
    ]
  },
  {
    week: 11,
    title: "NT 검사 실시",
    trimester: 1,
    items: [
      { id: "w11_1", text: "NT 초음파 검사 받기 (11~14주 권장)", category: "health", done: false },
      { id: "w11_2", text: "임산부 건강보험 혜택 신청 (국민행복카드)", category: "admin", done: false },
      { id: "w11_3", text: "임신 초기 감정 변화 대화하기 (배우자와)", category: "mental", done: false },
    ]
  },
  {
    week: 12,
    title: "1분기 마무리",
    trimester: 1,
    items: [
      { id: "w12_1", text: "1차 기형아 통합검사 완료 확인", category: "health", done: false },
      { id: "w12_2", text: "직장 동료에게 임신 알림 결정", category: "admin", done: false },
      { id: "w12_3", text: "임산부 보험 가입 검토", category: "admin", done: false },
      { id: "w12_4", text: "임신 12주 기념 사진 찍기", category: "mental", done: false },
    ]
  },
  {
    week: 13,
    title: "2분기 시작",
    trimester: 2,
    items: [
      { id: "w13_1", text: "입덧 완화 여부 확인 및 식단 회복", category: "health", done: false },
      { id: "w13_2", text: "임산부 운동 루틴 만들기 (요가, 수영 등)", category: "health", done: false },
      { id: "w13_3", text: "태아보험 가입 시기 검토 (22주 전 권장)", category: "admin", done: false },
    ]
  },
  {
    week: 14,
    title: "안정기 적응",
    trimester: 2,
    items: [
      { id: "w14_1", text: "정기 산전 검진 방문 (혈압, 체중 확인)", category: "health", done: false },
      { id: "w14_2", text: "임산부 치과 검진 받기 (임신 중 권장)", category: "health", done: false },
      { id: "w14_3", text: "임신 중 여행 계획 있으면 의사 상담", category: "health", done: false },
    ]
  },
  {
    week: 15,
    title: "2차 기형아 검사 준비",
    trimester: 2,
    items: [
      { id: "w15_1", text: "2차 기형아 검사(쿼드 검사) 예약 (15~20주)", category: "health", done: false },
      { id: "w15_2", text: "임산부 피부 변화 관리 (스트레치마크 크림)", category: "prep", done: false },
      { id: "w15_3", text: "태아 이름(태명) 짓기", category: "mental", done: false },
    ]
  },
  {
    week: 16,
    title: "태동 기다리기",
    trimester: 2,
    items: [
      { id: "w16_1", text: "쿼드 검사 또는 기형아 검사 받기", category: "health", done: false },
      { id: "w16_2", text: "임신 중 수면 자세 점검 (좌측 누워 자기)", category: "health", done: false },
      { id: "w16_3", text: "임신 일기 또는 기록 시작하기", category: "mental", done: false },
    ]
  },
  {
    week: 17,
    title: "태동 시작",
    trimester: 2,
    items: [
      { id: "w17_1", text: "태동 느끼기 (17~20주 첫 태동 경험)", category: "health", done: false },
      { id: "w17_2", text: "임산부 복대 또는 허리 지지대 준비", category: "prep", done: false },
      { id: "w17_3", text: "태아보험 가입 완료 (22주 전 권장)", category: "admin", done: false },
    ]
  },
  {
    week: 18,
    title: "중기 건강 관리",
    trimester: 2,
    items: [
      { id: "w18_1", text: "정밀 초음파 예약 (18~22주)", category: "health", done: false },
      { id: "w18_2", text: "임산부 영양제 점검 (철분, 오메가3 등)", category: "health", done: false },
      { id: "w18_3", text: "아기 이름 고민 시작하기", category: "mental", done: false },
    ]
  },
  {
    week: 19,
    title: "정밀 검사 준비",
    trimester: 2,
    items: [
      { id: "w19_1", text: "정밀 초음파 검사 받기", category: "health", done: false },
      { id: "w19_2", text: "성별 확인 (의사에게 문의)", category: "health", done: false },
      { id: "w19_3", text: "태교 음악 / 동화책 읽어주기 시작", category: "mental", done: false },
    ]
  },
  {
    week: 20,
    title: "임신 반환점",
    trimester: 2,
    items: [
      { id: "w20_1", text: "임신 20주 정기 검진", category: "health", done: false },
      { id: "w20_2", text: "임신 중기 혈당 검사 일정 확인", category: "health", done: false },
      { id: "w20_3", text: "출산 병원 결정 및 사전 방문", category: "admin", done: false },
      { id: "w20_4", text: "아기 방 또는 공간 계획 시작", category: "baby", done: false },
    ]
  },
  {
    week: 21,
    title: "아기 용품 준비 시작",
    trimester: 2,
    items: [
      { id: "w21_1", text: "아기용품 쇼핑 리스트 작성", category: "baby", done: false },
      { id: "w21_2", text: "출산 준비물 목록 만들기", category: "prep", done: false },
      { id: "w21_3", text: "산후조리원 알아보기 / 예약", category: "admin", done: false },
    ]
  },
  {
    week: 22,
    title: "태아보험 마감 & 준비",
    trimester: 2,
    items: [
      { id: "w22_1", text: "태아보험 가입 최종 확인 (22주 마감)", category: "admin", done: false },
      { id: "w22_2", text: "임산부 교실 / 출산 준비 강의 등록", category: "mental", done: false },
      { id: "w22_3", text: "남편과 출산 역할 분담 이야기하기", category: "mental", done: false },
    ]
  },
  {
    week: 23,
    title: "임신성 당뇨 검사",
    trimester: 2,
    items: [
      { id: "w23_1", text: "임신성 당뇨 선별 검사 (23~28주)", category: "health", done: false },
      { id: "w23_2", text: "임산부 철분제 복용 시작 (빈혈 예방)", category: "health", done: false },
      { id: "w23_3", text: "아기 침대, 유모차 등 큰 용품 결정", category: "baby", done: false },
    ]
  },
  {
    week: 24,
    title: "중기 마무리",
    trimester: 2,
    items: [
      { id: "w24_1", text: "정기 산전 검진 (혈압, 체중, 소변 검사)", category: "health", done: false },
      { id: "w24_2", text: "조기 진통 증상 공부하기", category: "health", done: false },
      { id: "w24_3", text: "산후조리원 예약 완료", category: "admin", done: false },
    ]
  },
  {
    week: 25,
    title: "체중 관리",
    trimester: 2,
    items: [
      { id: "w25_1", text: "체중 관리 목표 확인 (총 11~16kg 권장)", category: "health", done: false },
      { id: "w25_2", text: "임산부 스트레칭 루틴 점검", category: "health", done: false },
      { id: "w25_3", text: "아기 이름 후보 3개 이상 정하기", category: "mental", done: false },
    ]
  },
  {
    week: 26,
    title: "후기 준비 시작",
    trimester: 2,
    items: [
      { id: "w26_1", text: "당뇨 선별 검사 결과 확인", category: "health", done: false },
      { id: "w26_2", text: "출산 후 육아휴직 신청 계획 세우기", category: "admin", done: false },
      { id: "w26_3", text: "출산 준비 가방 리스트 작성 시작", category: "prep", done: false },
    ]
  },
  {
    week: 27,
    title: "2분기 마무리",
    trimester: 2,
    items: [
      { id: "w27_1", text: "정기 검진 (태아 성장 측정)", category: "health", done: false },
      { id: "w27_2", text: "모유수유 vs 분유 수유 결정 및 준비", category: "prep", done: false },
      { id: "w27_3", text: "임신 중 부부 데이트 계획 세우기", category: "mental", done: false },
    ]
  },
  {
    week: 28,
    title: "3분기 시작",
    trimester: 3,
    items: [
      { id: "w28_1", text: "Rh(−) 혈액형인 경우 면역글로불린 주사 상담", category: "health", done: false },
      { id: "w28_2", text: "인플루엔자 백신 접종 (권장 시기 확인)", category: "health", done: false },
      { id: "w28_3", text: "태동 카운팅 시작 (하루 10회 이상 확인)", category: "health", done: false },
      { id: "w28_4", text: "신생아 용품 구매 시작", category: "baby", done: false },
    ]
  },
  {
    week: 29,
    title: "후기 건강 관리",
    trimester: 3,
    items: [
      { id: "w29_1", text: "정기 검진 (2주 간격으로 방문 시작)", category: "health", done: false },
      { id: "w29_2", text: "부종 관리 (다리 올리기, 저염식 식단)", category: "health", done: false },
      { id: "w29_3", text: "출산 교실 / 라마즈 호흡법 배우기", category: "mental", done: false },
    ]
  },
  {
    week: 30,
    title: "출산 준비 가속",
    trimester: 3,
    items: [
      { id: "w30_1", text: "출산 준비 가방 꾸리기 시작", category: "prep", done: false },
      { id: "w30_2", text: "신생아 카시트 구매 및 설치 연습", category: "baby", done: false },
      { id: "w30_3", text: "출산 후 도움받을 사람 확정 (가족, 지인)", category: "mental", done: false },
    ]
  },
  {
    week: 31,
    title: "모유수유 준비",
    trimester: 3,
    items: [
      { id: "w31_1", text: "모유수유 교육 받기 or 유튜브 공부", category: "health", done: false },
      { id: "w31_2", text: "유축기 준비 (건강보험 대여 확인)", category: "baby", done: false },
      { id: "w31_3", text: "아기방 준비 완료 (침대, 기저귀 대 등)", category: "baby", done: false },
    ]
  },
  {
    week: 32,
    title: "역아 확인",
    trimester: 3,
    items: [
      { id: "w32_1", text: "태아 위치 확인 (역아 여부)", category: "health", done: false },
      { id: "w32_2", text: "제왕절개 vs 자연분만 계획 확정", category: "health", done: false },
      { id: "w32_3", text: "출산 병원 최종 확정 및 분만 예약", category: "admin", done: false },
    ]
  },
  {
    week: 33,
    title: "조기 출산 대비",
    trimester: 3,
    items: [
      { id: "w33_1", text: "조기 진통·양수 파수 증상 숙지", category: "health", done: false },
      { id: "w33_2", text: "출산 동반자(남편) 역할 연습", category: "mental", done: false },
      { id: "w33_3", text: "신생아 옷, 배냇저고리 세탁 완료", category: "baby", done: false },
    ]
  },
  {
    week: 34,
    title: "출산 가방 완성",
    trimester: 3,
    items: [
      { id: "w34_1", text: "출산 가방 최종 점검 및 완성", category: "prep", done: false },
      { id: "w34_2", text: "병원 가는 경로 및 방법 사전 확인", category: "admin", done: false },
      { id: "w34_3", text: "신생아 목욕 용품 준비", category: "baby", done: false },
    ]
  },
  {
    week: 35,
    title: "막달 대비",
    trimester: 3,
    items: [
      { id: "w35_1", text: "GBS(B군 연쇄상구균) 검사 받기", category: "health", done: false },
      { id: "w35_2", text: "출산 신고 / 출생신고 서류 미리 알아보기", category: "admin", done: false },
      { id: "w35_3", text: "산후 우울증 예방 정보 공부하기", category: "mental", done: false },
    ]
  },
  {
    week: 36,
    title: "매주 검진 시작",
    trimester: 3,
    items: [
      { id: "w36_1", text: "매주 정기 검진 시작 (36주 이후)", category: "health", done: false },
      { id: "w36_2", text: "집 정리 및 청소 완료 (아기 맞이 준비)", category: "prep", done: false },
      { id: "w36_3", text: "아기 이름 최종 확정", category: "admin", done: false },
      { id: "w36_4", text: "출산 후 식사 준비 계획 세우기", category: "prep", done: false },
    ]
  },
  {
    week: 37,
    title: "만삭 준비",
    trimester: 3,
    items: [
      { id: "w37_1", text: "태아 두위(머리 아래 방향) 확인", category: "health", done: false },
      { id: "w37_2", text: "분만 가능 증상 복습 (이슬, 규칙적 진통)", category: "health", done: false },
      { id: "w37_3", text: "산후조리원 최종 확인 연락", category: "admin", done: false },
    ]
  },
  {
    week: 38,
    title: "출산 임박",
    trimester: 3,
    items: [
      { id: "w38_1", text: "언제든 병원 출발 준비 완료", category: "prep", done: false },
      { id: "w38_2", text: "반려동물/다른 자녀 케어 계획 확정", category: "etc", done: false },
      { id: "w38_3", text: "배우자 비상 연락망 정리", category: "admin", done: false },
      { id: "w38_4", text: "마음 편히 쉬기 / 충분한 수면", category: "mental", done: false },
    ]
  },
  {
    week: 39,
    title: "D-Day 직전",
    trimester: 3,
    items: [
      { id: "w39_1", text: "진통 앱 설치 및 사용법 익히기", category: "prep", done: false },
      { id: "w39_2", text: "출산 후 육아 역할 분담 최종 합의", category: "mental", done: false },
      { id: "w39_3", text: "배우자와 마지막 둘만의 시간 갖기", category: "mental", done: false },
    ]
  },
  {
    week: 40,
    title: "출산 D-Day",
    trimester: 3,
    items: [
      { id: "w40_1", text: "출산 진행 (또는 유도분만 상담)", category: "health", done: false },
      { id: "w40_2", text: "출생신고 서류 준비 (출생 후 1개월 이내)", category: "admin", done: false },
      { id: "w40_3", text: "신생아 건강보험 등록", category: "admin", done: false },
      { id: "w40_4", text: "소중한 순간 사진/영상으로 기록하기 📷", category: "mental", done: false },
    ]
  },
];
