// ============================================================
// 임신 체크리스트 - 4대 소스 통합 데이터 정의 (5주차 ~ 출산 후)
// ============================================================

const DEFAULT_CHECKLIST_DATA = [
  {
    week: 5,
    title: "임신 여정의 첫 걸음",
    trimester: 1,
    items: [
      { id: "w5_1", text: "산부인과 첫 방문 예약 및 아기집/난황 확인하기", category: "health", done: false },
      { id: "w5_2", text: "임신 테스트기 양성 및 hCG 혈액 수치로 진단 확정하기", category: "health", done: false },
      { id: "w5_3", text: "엽산 복용 시작 (하루 400~800mcg 복용, 보건소에서 12주까지 제공)", category: "health", done: false },
      { id: "w5_4", text: "관할 보건소 임산부 등록 (준비물: 신분증, 임신확인서 / 정부24 온라인 가능)", category: "admin", done: false },
      { id: "w5_5", text: "국민행복카드 신청하여 임신·출산 진료비 바우처 발급받기 (100만원 지원)", category: "admin", done: false },
      { id: "w5_6", text: "임신 초기부터 튼살 예방을 위해 튼살 크림/오일 꼼꼼히 바르기 시작", category: "prep", done: false },
      { id: "w5_7", text: "태아 건강을 위해 술·담배·카페인 중단하고 복용 중인 약 의사와 상담하기", category: "health", done: false },
    ]
  },
  {
    week: 6,
    title: "태아 안정을 위한 행정 준비",
    trimester: 1,
    items: [
      { id: "w6_1", text: "초음파로 태아 심장박동 소리 확인하기", category: "health", done: false },
      { id: "w6_2", text: "임산부 단축근무 신청 (임신 12주 이내 하루 2시간 단축근무, 임금 삭감 없음)", category: "admin", done: false },
      { id: "w6_3", text: "산후조리원 비교 및 신속 예약 (인기 많은 곳은 임신 초기 마감되므로 가계약 추천)", category: "prep", done: false },
      { id: "w6_4", text: "임산부 전용 앱(베이비빌리, 열달후에 등) 설치 및 주수별 변화 체크 시작", category: "prep", done: false },
      { id: "w6_5", text: "체중, 혈압, 혈당 등 기초 건강 수치 메모하여 정기 진료 시 비교용 기록 시작", category: "health", done: false },
    ]
  },
  {
    week: 7,
    title: "보험 혜택 및 마음 가꾸기",
    trimester: 1,
    items: [
      { id: "w7_1", text: "자동차 보험 임산부 할인 특약 신청 (자녀 할인 특약으로 보험료 4~17% 환급)", category: "admin", done: false },
      { id: "w7_2", text: "입덧, 피로감, 감정 기복 등 임신 초기 증상에 대비하고 충분한 휴식 취하기", category: "mental", done: false },
      { id: "w7_3", text: "가족, 직장 동료 등 임신 소식을 공유할 대상과 시기 정하기", category: "mental", done: false },
    ]
  },
  {
    week: 8,
    title: "보건소 산전검사 활용",
    trimester: 1,
    items: [
      { id: "w8_1", text: "보건소 무료 산전검사 받기 (임신 6~10주 사이 보건소 1회 무료, 평일 9-11시, 3시간 금식)", category: "health", done: false },
      { id: "w8_2", text: "보건소 검사 결과지 온라인(e보건소) 출력하여 산부인과에 제출 (검사 비용 절약)", category: "health", done: false },
    ]
  },
  {
    week: 9,
    title: "맘편한 임신 혜택 신청",
    trimester: 1,
    items: [
      { id: "w9_1", text: "정부24 '맘편한 임신 서비스' 신청하기 (엽산/철분제 지급, KTX/SRT 열차 할인 원스톱 등록)", category: "admin", done: false },
      { id: "w9_2", text: "임산부 배려 교통카드 발급 및 지자체 임산부 주차증 발급받기", category: "admin", done: false },
    ]
  },
  {
    week: 11,
    title: "태아보험 가입과 검사 준비",
    trimester: 1,
    items: [
      { id: "w11_1", text: "태아보험 비교 견적 및 가입 완료하기 (기형아 검사 결과 나오기 전인 12주 전 권장)", category: "admin", done: false },
      { id: "w11_2", text: "NIPT(니프티) 검사 등 추가 유전자 검사 진행 여부 의사와 상담하고 결정하기", category: "health", done: false },
      { id: "w11_3", text: "임신축하박스(베이비페어, 임신 육아 카페 등) 무료 이벤트 신청하기", category: "prep", done: false },
    ]
  },
  {
    week: 12,
    title: "1차 기형아 검사와 안정기 준비",
    trimester: 1,
    items: [
      { id: "w12_1", text: "1차 기형아 검사 진행 (목투명대NT 초음파 두께 측정 및 1차 혈액검사)", category: "health", done: false },
      { id: "w12_2", text: "임신 중기 대비 영양제(철분, 비타민D, 유산균 등) 미리 공부하고 구입하기", category: "prep", done: false },
      { id: "w12_3", text: "컨디션이 허락하는 경우, 산전 필라테스 등 가벼운 운동 루틴 고민 및 시작", category: "health", done: false },
    ]
  },
  {
    week: 16,
    title: "중기 시작과 2차 기형아 검사",
    trimester: 2,
    items: [
      { id: "w16_1", text: "2차 기형아 검사 진행 (은평구 보건소 16~18주 쿼드검사 무료, 평일 9-11시, 결과는 방문수령)", category: "health", done: false },
      { id: "w16_2", text: "철분제 본격 섭취 시작 (임신 16주부터 출산 후 3개월까지 복용, 보건소 16주~40주 무료 제공)", category: "health", done: false },
      { id: "w16_3", text: "보건소 영유아 방문간호사업 등록 신청 (임신 16주 이상 대상, 서울시 임신출산정보센터 온라인 신청)", category: "admin", done: false },
      { id: "w16_4", text: "임산부 구강 검진 및 치과 치료 받기 (안정기인 임신 중기 초반이 치과 치료의 적기)", category: "health", done: false },
      { id: "w16_5", text: "몸이 점차 변화하므로 임부복 및 발이 편한 임산부용 운동화/신발 준비하기", category: "prep", done: false },
    ]
  },
  {
    week: 20,
    title: "정밀 초음파와 소중한 태동",
    trimester: 2,
    items: [
      { id: "w20_1", text: "정밀 초음파 검사 받기 (20~22주 사이, 태아의 장기, 뇌, 심장, 손발가락 정밀 진단)", category: "health", done: false },
      { id: "w20_2", text: "태동 느껴지기 시작하면 배우자와 함께 조용히 태아의 움직임 느껴보고 교감하기", category: "mental", done: false },
      { id: "w20_3", text: "정밀 초음파를 통해 비교적 정확한 태아 성별 확인하고 기념 사진 남기기", category: "mental", done: false },
      { id: "w20_4", text: "산모 컨디션이 가장 안정적인 중기를 활용하여 무리하지 않는 선의 태교여행 계획하기", category: "mental", done: false },
    ]
  },
  {
    week: 23,
    title: "산후 케어 사전 계획",
    trimester: 2,
    items: [
      { id: "w23_1", text: "정부지원 산후도우미 업체 선예약 (정부 정식 신청은 D-40이지만 인기 업체 예약을 위해 사전 가계약)", category: "prep", done: false },
      { id: "w23_2", text: "남편과 함께 신생아 수유 방법 및 출산 후 육아 역할 분담에 대해 미리 대화하기", category: "mental", done: false },
    ]
  },
  {
    week: 25,
    title: "임당 검사와 용품 리서치",
    trimester: 2,
    items: [
      { id: "w25_1", text: "임신성 당뇨(임당) 검사 받기 (보건소 24~27주 무료, 4시간 이상 금식 후 포도당 섭취 및 1시간 뒤 채혈)", category: "health", done: false },
      { id: "w25_2", text: "태아 얼굴 모습을 입체적으로 확인하는 3D 입체 초음파 검사 받기 (24~28주 추천)", category: "health", done: false },
      { id: "w25_3", text: "베이비페어 또는 아기용품 매장 방문하여 유모차, 카시트, 아기침대 등 대형 용품 실물 비교하기", category: "baby", done: false },
      { id: "w25_4", text: "태어날 아기를 위한 아기방 구상 및 수납장/가구 배치 공간 미리 정리 시작하기", category: "baby", done: false },
    ]
  },
  {
    week: 27,
    title: "출산 준비 본격화",
    trimester: 2,
    items: [
      { id: "w27_1", text: "출산 가방 및 조리원 입실 시 필요한 준비물 리스트 작성하기 (병원용 / 조리원용 구분)", category: "prep", done: false },
      { id: "w27_2", text: "아기 배냇저고리, 속싸개, 손수건 등 기초 아기 의류 리스트업 및 구매", category: "baby", done: false },
      { id: "w27_3", text: "임산부 왁싱 1차 시작하기 (출산 전 총 3회 권장: 26주, 32주, 38주차 추천)", category: "prep", done: false },
      { id: "w27_4", text: "출산을 돕는 막달 체력 대비 가벼운 걷기 운동 및 골반 스트레칭 꾸준히 하기", category: "health", done: false },
    ]
  },
  {
    week: 30,
    title: "백일해 예방접종과 만삭사진",
    trimester: 3,
    items: [
      { id: "w30_1", text: "임산부 백일해 예방접종 맞기 (신생아 감염 예방을 위해 27~36주 사이 접종 필수)", category: "health", done: false },
      { id: "w30_2", text: "아빠(남편) 및 아기와 자주 접촉할 조부모 등 주 양육자도 백일해 예방접종 맞도록 권장 (출산 2주~한달 전)", category: "health", done: false },
      { id: "w30_3", text: "배가 가장 예쁘게 나오는 28~32주 사이에 만삭사진 촬영하기", category: "mental", done: false },
      { id: "w30_4", text: "조리원 예약 사항 재확인 (입실 예정일 조율 및 프로그램 체크)", category: "prep", done: false },
    ]
  },
  {
    week: 33,
    title: "아기 세탁과 정부 지원 도우미 신청",
    trimester: 3,
    items: [
      { id: "w33_1", text: "출산 예정일에 따른 자연분만 / 제왕절개 분만 방식 의사와 최종 상담하기", category: "health", done: false },
      { id: "w33_2", text: "정부지원 산모·신생아 건강관리 도우미 신청 (출산 예정일 40일 전부터 가능, 복지로 온라인 신청)", category: "admin", done: false },
      { id: "w33_3", text: "태어날 아기의 이름을 고민하여 작명소 의뢰 또는 후보군 이름 정리해두기", category: "admin", done: false },
      { id: "w33_4", text: "아기 옷, 손수건, 침구류 등 전용 세제로 안심 세탁 후 항균 지퍼백에 밀봉 보관 시작", category: "baby", done: false },
      { id: "w33_5", text: "신생아 젖병, 분유포트, 젖병소독기 등 수유 관련 기기 세척 및 열탕/살균 완료하기", category: "baby", done: false },
      { id: "w33_6", text: "임산부 왁싱 2차 진행하기 (32주차 추천)", category: "prep", done: false },
    ]
  },
  {
    week: 36,
    title: "막달검사와 출산 임박 대비",
    trimester: 3,
    items: [
      { id: "w36_1", text: "보건소 무료 임신막달검사 받기 (임신 35~37주 사이 보건소 지원, 3시간 금식 후 방문)", category: "health", done: false },
      { id: "w36_2", text: "제왕절개 출산인 경우, 수술 예정 시간 및 일자 최종 조율하여 확정하기", category: "health", done: false },
      { id: "w36_3", text: "아기 침대, 유아차, 바운서 등 남편의 조립과 세팅이 필요한 아기 가구 조립 완료하기", category: "baby", done: false },
      { id: "w36_4", text: "예약한 산후도우미 업체에 연락하여 세부 특이사항 및 일정 최종 확인하기", category: "prep", done: false },
    ]
  },
  {
    week: 40,
    title: "출산 준비 완성 및 대기",
    trimester: 3,
    items: [
      { id: "w40_1", text: "매주 산부인과 막달 검진 방문 (아기 머리 위치, 양수 상태 및 태동 검사 확인)", category: "health", done: false },
      { id: "w40_2", text: "출산 가방 최종 점검 및 완벽하게 꾸려 현관 앞에 준비해두기 (37주 이전 권장)", category: "prep", done: false },
      { id: "w40_3", text: "아기 맞이 홈 세팅 최종 완료 (기저귀 교환대, 아기 침대, 젖병 소독기 등 바로 쓸 수 있게 배치)", category: "baby", done: false },
      { id: "w40_4", text: "출산 전 마지막 임산부 왁싱 3차 진행하기 (38주차 추천)", category: "prep", done: false },
      { id: "w40_5", text: "근로기준법상 '태아검진휴가' 적극 활용하여 연차 소모 없이 산전 진료 다녀오기 (36주 이후 주 1회 제공)", category: "admin", done: false },
      { id: "w40_6", text: "출산 시 호흡법 및 분만 징후(규칙적인 진통, 양수 파수, 이슬 등) 숙지해두기", category: "health", done: false },
      { id: "w40_7", text: "언제든 아기를 만날 수 있는 상태이므로 충분한 휴식과 수면으로 산모 체력 비축하기", category: "mental", done: false },
    ]
  },
  {
    week: "출산 후",
    title: "보건소 혜택 및 신생아 건강 지원",
    trimester: 3,
    items: [
      { id: "post_1", text: "보건소 모유수유 유축기 대여 신청하기 (출산 후 전화예약 또는 정부24 신청, 대여 기간 1개월)", category: "admin", done: false },
      { id: "post_2", text: "서울형 산후조리경비 지원 사업 신청하기 (출산 후 180일 이내 본인 신청, 첫째 100만/둘째 120만 등 포인트 지급)", category: "admin", done: false },
      { id: "post_3", text: "셋째아 이상인 경우, 보건소에 산후건강관리 서비스 본인부담금 90% 지원금 신청 (이용 후 30일 이내)", category: "admin", done: false },
      { id: "post_4", text: "보건소 생애초기 영유아 기본 방문간호서비스 받기 (출산 후 8주 이내 전문 간호사가 가정 방문하여 산모/영유아 평가 및 수유상담 제공)", category: "health", done: false },
      { id: "post_5", text: "미숙아 및 선천성이상아 의료비 지원 신청하기 (생후 2년 이내 입원 수술한 경우, e보건소 신청)", category: "admin", done: false },
      { id: "post_6", text: "영유아 발달장애 정밀검사비 지원 신청하기 (영유아 건강검진 시 심화평가 의심 아동 판정 시, 보건소 신청)", category: "admin", done: false },
      { id: "post_7", text: "선천성대사이상 선별/확진 검사비 지원 및 의료비 신청 (보건소 방문 신청)", category: "admin", done: false },
      { id: "post_8", text: "출생신고 및 첫만남이용권, 부모급여, 아동수당 원스톱 신청하기 (출산 후 1개월 이내 주민센터 또는 정부24)", category: "admin", done: false },
    ]
  }
];
