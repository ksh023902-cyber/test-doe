import './assets/main.css'
import { hasFirebaseConfig } from './firebase'
import {
  canUseCloud,
  deletePostFromCloud,
  fetchPostsFromCloud,
  upsertPostToCloud
} from './firestorePosts'
import {
  fetchCommentsFromCloud,
  fetchLikesFromCloud,
  fetchReportsFromCloud,
  fetchStatsFromCloud,
  saveCommentsToCloud,
  saveLikesToCloud,
  saveReportsToCloud,
  saveStatsToCloud
} from './firestoreMeta'

const STORAGE_KEY = 'doe.posts.v2'
const COMMENTS_KEY = 'doe.comments.v1'
const LIKES_KEY = 'doe.likes.v1'
const REPORTS_KEY = 'doe.reports.v1'
const STATS_KEY = 'doe.stats.v1'
const REPORT_HIDE_THRESHOLD = 3
const AUTO_SEED_KEY = 'doe.autoseed.v3'
const CLOUD_SYNC_KEY = 'doe.cloudsync.v1'
const CLOUD_META_SYNC_KEY = 'doe.cloudmeta.v1'
const COLD_START_RANDOM_SEED_KEY = 'doe.coldstart.seed.v1'
const USER_ID_KEY = 'doe.user.id.v1'

if (hasFirebaseConfig()) {
  console.info('[firebase] Firebase is configured and ready.')
}

const AUTO_SHOTS = [
  { topic: '일상썰', title: '엘리베이터 정적썰', line: '솔직히 이거 진짜임. 엘베에서 둘이 탔는데 서로 핸드폰만 보다 내릴 때까지 한마디도 안 했음. 그게 더 편했음.' },
  { topic: '일상썰', title: '카페 자리전쟁', line: '콘센트 있는 자리 비는 순간, 5명이 동시에 일어나는 거 목격함. 카페가 아니라 배틀로얄이었음.' },
  { topic: '일상썰', title: '배달앱 현실', line: '배달앱 켠 지 40분 됐는데 아직 메뉴 못 정함. 이쯤 되면 주문을 하는 게 아니라 인생을 결정하는 거임.' },
  { topic: '일상썰', title: '알람과의 전쟁', line: '1차 알람은 기상이 목적이 아님. "나 아직 살아있음" 확인용임. 진짜 일어나는 건 4번째 이후.' },
  { topic: '일상썰', title: '읽씹 분노', line: '읽씹 당했다고 화났다가, 내 카톡함 보니까 나도 3일째 안 읽은 게 6개였음. 할 말이 없어졌음.' },
  { topic: '연애썰', title: '소개팅 역대급', line: '소개팅 내내 별로였는데, 헤어지고 집 가는 길에 갑자기 톡 와서 "지하철 방향 같으면 같이 가도 돼요?" 했을 때 심장이 터질 뻔했음.' },
  { topic: '연애썰', title: '사진 vs 실물', line: '프로필 사진 보고 기대 뚝 떨어졌다가, 첫 문장 뱉는 순간 완전히 뒤집혔음. 말투 하나로 사람이 달라 보임.' },
  { topic: '학교썰', title: '조별과제 영웅', line: '조별과제 발표 전날 새벽 2시에 혼자 PPT 다 고치고 "다들 수고했어요" 보낸 인간 실존함. 그게 나였음.' },
  { topic: '학교썰', title: '시험기간 현실', line: '시험 3일 전에 갑자기 방 전체 청소하고, 향초 켜고, 플레이리스트 만들다가 공부 한 줄도 못 함. 이게 루틴임.' },
  { topic: '직장썰', title: '회의 법칙', line: '1시간 회의의 결론은 항상 마지막 4분에 나옴. 나머지 56분은 그 결론을 내기 위한 준비운동이었음.' },
  { topic: '직장썰', title: '점심 전쟁', line: '"아무거나 먹어요" 해놓고 다 거부하는 사람이 반드시 한 명 있음. 이 사람이 결국 메뉴 정함.' },
  { topic: '직장썰', title: '퇴근 저격', line: '퇴근 7분 전 급한 건 법칙임. 예외 없음. 전 직장, 현 직장, 업종 불문. 이게 직장인의 숙명임.' },
  { topic: '돈썰', title: '통장 공포', line: '큰돈 나가는 건 각오가 되는데, 3천원 4천원씩 빠져나가는 구독 서비스들이 더 무서움. 합치면 월 6만원이었음.' },
  { topic: '인간관계썰', title: '단톡 심리전', line: '단톡에서 이모지 하나 잘못 쓰면 분위기 싸해지는 거 아는 사람만 앎. "ㅋ"와 "ㅋㅋ"는 완전히 다른 말임.' },
  { topic: '인간관계썰', title: '약속 잡기 지옥', line: '"다음에 밥 한번 먹자" 한 게 벌써 8개월째임. 근데 진짜 만나고 싶은 마음은 있음. 그냥 일정이 안 맞을 뿐임.' },
  { topic: '연애', title: '불안의 정체', line: '좋아하는데 계속 불안하면, 그 사람이 싫어서가 아님. 내가 충분히 안 괜찮다는 느낌 때문인 경우가 더 많더라.' },
  { topic: '연애', title: '연락 속도의 진실', line: '답장 빠른 사람보다, 바쁠 때도 "나중에 얘기해"라고 먼저 알려주는 사람이 더 믿음이 갔음.' },
  { topic: '연애', title: '식는 건 티가 안 남', line: '갑자기 식은 게 아님. 사소한 실망이 10번 쌓인 거임. 그걸 말 안 해서 몰랐던 것뿐임.' },
  { topic: '연애', title: '사과의 레벨', line: '"미안해"는 레벨 1임. 같은 상황에서 다르게 행동하는 게 레벨 10임. 대부분은 레벨 1에서 멈춤.' },
  { topic: '인간관계', title: '친함의 함정', line: '친하다는 이유로 "쟤는 원래 그래"가 통용되기 시작하면, 그때부터 관계가 기울어지기 시작하더라.' },
  { topic: '인간관계', title: '말투가 다임', line: '장난이었어도 같은 말을 반복하면 그게 그 사람의 진짜 생각임. 말투에 다 나와 있음.' },
  { topic: '인간관계', title: '바쁠 때 보면 앎', line: '평소엔 다 잘 대해줌. 진짜 사람 됨됨이는 자기가 힘들 때 남한테 어떻게 하는지에서 드러남.' },
  { topic: '인간관계', title: '말보다 패턴', line: '"앞으로 잘할게"를 세 번 이상 들었다면, 그 말이 아니라 그 패턴을 봐야 할 타이밍임.' },
  { topic: '자기계발', title: '의지력의 한계', line: '꾸준히 못 하는 건 의지가 약해서가 아님. 환경이 그걸 방해하도록 세팅된 거임. 환경부터 바꿔야 함.' },
  { topic: '자기계발', title: '10분의 힘', line: '완벽한 계획 세우다 아무것도 안 한 날보다, 10분이라도 실제로 한 날이 다음 날을 살렸음.' },
  { topic: '자기계발', title: '비교가 망치는 것', line: '남이랑 비교하면 항상 내가 늦은 것처럼 느껴짐. 근데 그 사람도 다른 누군가랑 비교하며 불안해하고 있음.' },
  { topic: '자기계발', title: '루틴의 진짜 의미', line: '루틴 안 지켜지는 날이 생겼다고 다 무너진 게 아님. 빠르게 돌아오는 능력이 루틴의 본질임.' },
  { topic: '돈', title: '수입보다 구멍', line: '월급 올라도 통장 잔고는 비슷한 이유 찾았음. 수입보다 새는 구멍이 먼저 컸던 거임.' },
  { topic: '돈', title: '감정 소비의 정체', line: '기분 안 좋은 날 장바구니에 뭔가 쌓여 있으면, 그건 필요해서가 아님. 기분 달래려는 거임. 그게 나였음.' },
  { topic: '돈', title: '가계부의 효과', line: '지출 기록하기 시작하면 "이걸 왜 샀지?" 싶은 게 반드시 나옴. 그 충격이 다음 소비를 바꿈.' },
  { topic: '돈', title: '부자의 실체', line: '한 번에 크게 버는 사람보다, 꾸준히 새지 않는 사람이 10년 후에 더 많이 남아있더라.' },
  { topic: '학교', title: '공부 시간의 함정', line: '6시간 앉아 있었어도 집중한 건 40분이었음. 시간이 아니라 집중 밀도가 다임.' },
  { topic: '학교', title: '오답 노트의 진짜 역할', line: '틀린 문제 다시 보는 게 점수를 올리기 전에 자신감을 먼저 올려줬음. 아는 게 늘어나는 느낌이 났음.' },
  { topic: '학교', title: '다들 불안함', line: '공부 잘하는 것처럼 보이는 애한테 물어봤더니 걔도 불안하다고 했음. 겉으로만 안 보였던 거였음.' },
  { topic: '직장', title: '바쁨 ≠ 성과', line: '야근 많이 한 날이 꼭 잘한 날은 아니었음. 중요한 거 하나 끝낸 날이 진짜 잘한 날이더라.' },
  { topic: '직장', title: '말 잘하는 것의 오해', line: '회의에서 말 많이 하는 사람보다, 말 짧고 핵심만 치는 사람한테 신뢰가 쌓이더라.' },
  { topic: '직장', title: '체력이 실력', line: '열정도 컨디션 앞에서 꺾임. 잘 자고 온 날 집중력이 커피 3잔보다 훨씬 셌음.' },
  { topic: '일상', title: '하루의 시작', line: '좋은 하루를 만드는 게 아침 루틴이나 동기부여가 아니었음. 전날 밤에 잘 자는 게 다였음.' },
  { topic: '일상', title: '기분 먼저 vs 행동 먼저', line: '기분 좋아질 때까지 기다리다가 아무것도 못 함. 몸을 먼저 움직이면 기분이 뒤따라왔음.' },
  { topic: '일상', title: '불안이 줄어드는 순간', line: '불안이 없어진 게 아니라, 해야 할 거 하나 끝냈더니 불안이 조금 작아졌음. 그게 전부였음.' },

  // 시사공감
  { topic: '시사공감', title: '뉴스 보다 지침', line: '뉴스 5분 보다가 무기력해진 적 있음. 세상이 문제가 많은 게 아니라, 나쁜 소식을 알고리즘이 골라서 주는 거였음.' },
  { topic: '시사공감', title: '댓글 전쟁 목격', line: '온라인 댓글창은 설득하는 곳이 아님. 진영별 점수따기 전쟁터임. 그걸 모르고 뛰어들었다가 하루 기분 다 버린 적 있음.' },
  { topic: '시사공감', title: '이슈 피로감', line: '3일짜리 이슈가 너무 많음. 다음 주면 아무도 기억 안 할 걸 지금 목숨 걸고 싸우고 있음. 이게 반복되면서 무감각해지더라.' },
  { topic: '시사공감', title: '정치 얘기 금기', line: '가족 모임에서 정치 얘기 꺼내는 순간 분위기 싸해짐. 근데 그게 이상한 게 아니라, 서로 의견이 완전히 달라졌다는 신호였음.' },
  { topic: '시사공감', title: '선거철 피로', line: '이번이 진짜 중요하다는 말이 선거마다 반복됨. 근데 실제로 매번 중요했음. 문제는 그 말을 이제 아무도 안 믿는다는 거임.' },
  { topic: '시사공감', title: '팩트체크 피로', line: '가짜뉴스인지 확인하다가 지침. 확인할 에너지 없으면 그냥 믿게 됨. 이게 가짜뉴스가 퍼지는 진짜 이유라고 생각했음.' },
  { topic: '시사공감', title: '정책 체감', line: '정부 정책이 나한테 실제로 어떤 영향인지 계산해본 적 없는 사람이 대부분임. 막연히 좋다/싫다만 있는 거였음. 나도 그랬음.' },
  { topic: '시사공감', title: '언론 편향 실감', line: '같은 사건인데 매체마다 제목이 완전히 다름. 이걸 처음 비교했을 때 진짜 충격이었음. 그 이후로 뉴스 하나만 믿지 않게 됐음.' },

  // 연예공감
  { topic: '연예공감', title: '팬심의 정체', line: '좋아하는 연예인이 생기면 그 사람을 좋아하는 게 아니라, 그 사람 볼 때 내 기분이 좋아지는 걸 좋아하는 거라는 걸 나중에 알았음.' },
  { topic: '연예공감', title: '연예인 사생활', line: '좋아하는 연예인 사생활 뉴스 나오면 배신감 드는 사람 있음. 근데 생각해보면 우리가 그 사람 개인을 알 수 있는 부분은 원래부터 없었음.' },
  { topic: '연예공감', title: '오디션 프로 심리', line: '오디션 프로 보다가 응원하는 참가자 탈락하면 진짜 기분 나쁨. 내가 떨어진 것도 아닌데. 이 감정이 뭔지 설명이 잘 안 됨.' },
  { topic: '연예공감', title: '연예인 은퇴 충격', line: '좋아했던 연예인이 은퇴하거나 활동 중단하면 내 10대 혹은 20대 일부가 끝난 느낌이 듦. 단순한 팬심이 아닌 이유가 여기 있음.' },
  { topic: '연예공감', title: '악플 문화', line: '악플 심리 공부해봤더니 익명성+군중심리+내면 불만족의 결합이라고 했음. 납득은 안 되지만 이해는 됨. 근데 더 무서워졌음.' },
  { topic: '연예공감', title: '굿즈 소비 심리', line: '콘서트 굿즈에 30만원 썼는데 후회 없음. 이걸 설명하면 이해 못 하는 사람이 꼭 있음. 그냥 안 설명하고 사는 게 정신건강에 좋음.' },
  { topic: '연예공감', title: '해외 팬덤 컬처', line: '해외 팬들이 한국 콘텐츠 소비하는 방식 보면서 신기했음. 우리가 당연하게 여기는 게 외부에선 완전히 낯선 문화였음.' },

  // 이슈반응
  { topic: '이슈반응', title: '인터넷 집단심리', line: '인터넷에서 어떤 사람을 공공의 적으로 만드는 데 48시간이면 됨. 그리고 일주일 뒤엔 아무도 기억 안 함. 이게 반복됨.' },
  { topic: '이슈반응', title: '사회이슈 무감각화', line: '사회 문제에 분노하다가 지쳐서 무감각해지는 과정을 세 번 반복했음. 내가 나빠진 게 아니라 뇌가 보호 모드로 전환한 거라고 들었음.' },
  { topic: '이슈반응', title: '트렌드 따라가기', line: '트렌드 따라가느라 지침. 안 따라가면 대화에서 겉돌고. 이 사이 균형 찾는 게 요즘 세대 숙제인 것 같음.' },
  { topic: '이슈반응', title: 'SNS 여론의 착시', line: 'SNS 여론이 실제 여론이 아니라는 걸 알면서도 자꾸 그걸로 세상을 판단하게 됨. 알고리즘이 보여주는 세상이 전부인 줄 착각하게 되더라.' },
  { topic: '이슈반응', title: '세대 갈등 피로', line: '요즘 젊은 세대, 꼰대 표현 나오는 순간 대화가 막힘. 세대 차이 없는 척도 거짓말이고. 중간 어딘가가 있는데 아무도 못 찾고 있음.' },
  { topic: '이슈반응', title: '재난 뉴스 소비', line: '재난 뉴스 보면서 슬프고 무섭다가도 다음 영상으로 넘어가는 내 손가락이 이상하게 느껴진 적 있음. 디지털 감각 마비의 증거인 것 같았음.' },
  { topic: '이슈반응', title: '해외 분쟁 실감', line: '해외 분쟁 뉴스가 잘 실감 안 났는데, 현지에 아는 사람 있다는 걸 알았을 때 갑자기 완전히 다르게 보였음. 거리가 공감을 막는다는 게 이런 거였음.' },

  // 경제공감
  { topic: '경제공감', title: '부동산 포기 선언', line: '내 연봉으로 서울 30평 사려면 한 푼도 안 쓰고 47년 모아야 함. 계산기 두드리다가 그냥 덮었음. 이게 포기가 아니라 현실 직면이라고 스스로 납득함.' },
  { topic: '경제공감', title: '주식 입문 충격', line: '주식 처음 시작했을 때 수익 나면 내 실력인 줄 알았음. 손실 나니까 시장 탓을 했음. 6개월 지나서야 그게 반대였다는 걸 알았음.' },
  { topic: '경제공감', title: '물가 체감', line: '마트 갈 때마다 가격이 올라 있음. 한 번에 확 오른 게 아니라 조금씩이라 언제부터인지 모르겠는데, 어느 순간 장바구니가 무거워졌음.' },
  { topic: '경제공감', title: '취업 현실', line: '스펙 쌓는 데 4년 썼는데 막상 취업시장은 경험을 물어봄. 경험 쌓으려면 취업이 돼야 하는데. 이 모순이 진짜 존재함. 내 얘기임.' },
  { topic: '경제공감', title: '부의 격차 실감', line: '친구 중에 부모님 도움으로 집 산 애가 생겼음. 부럽다기보다 이제 같은 출발선이 아니라는 실감이 먼저 왔음. 그게 더 공허했음.' }
]

const BANNED_PATTERNS = [
  /혐오/gi,
  /비하/gi,
  /죽어/gi,
  /병신/gi,
  /ㅂㅅ/gi,
  /미친/gi
]

function violatesGuideline(text) {
  const s = String(text ?? '')
  return BANNED_PATTERNS.some((re) => re.test(s))
}

function countLines(text) {
  return String(text ?? '')
    .replaceAll('\r\n', '\n')
    .replaceAll('\r', '\n')
    .split('\n')
    .filter((l) => l.trim() !== '').length
}

function clampLine(s) {
  const v = String(s ?? '')
    .replaceAll('\r\n', '\n')
    .replaceAll('\r', '\n')
    .replaceAll('\n', ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return v
}

function generateLongDetailFromShot({ title, topic, line }) {
  const t = String(title || '').trim() || '짧은 문장 하나'
  const k = String(topic || '').trim() || '일상'
  const l = String(line || '').trim() || '오늘 문득 떠오른 생각'

  const openers = [
    `진짜임. 처음에 나도 “설마 나만 이런가” 싶었는데 아니었음.`,
    `${k} 얘기 중에 이거 공감 안 하는 사람 거의 못 봤음.`,
    `말하기 애매했는데 이참에 다 털어놓음.`,
    `이게 사소해 보여도 꽤 많은 사람이 같은 상황 겪고 있더라.`,
  ]
  const middles = [
    [
      `${t} 얘기를 더 풀면, 처음엔 그냥 지나칠 뻔했음.`,
      `근데 나중에 돌아봤을 때 “아, 그때 그게 포인트였구나” 싶었음.`,
      `생각보다 많은 사람이 이 상황에서 아무 말도 못 하고 넘어가더라.`,
    ],
    [
      `처음 겪었을 땐 그냥 어이없어서 웃었는데,`,
      `반복되니까 이게 패턴이라는 걸 알았음.`,
      `${k}에서 이 포인트를 모르면 계속 같은 데서 걸림.`,
    ],
    [
      `주변에 물어봤더니 비슷한 경험 있는 사람이 생각보다 많았음.`,
      `근데 다들 말 안 했을 뿐이지 속으로는 다 느끼고 있었음.`,
      `그 순간 뭔가 연대감 같은 게 생겼음.`,
    ],
  ]
  const closers = [
    [
      `결국 정리하면 이거 하나임.`,
      `불편했던 순간을 그냥 넘기지 말고, 딱 한 줄로라도 메모해두면`,
      `나중에 같은 상황에서 훨씬 빠르게 대처가 됨.`,
    ],
    [
      `이런 거 혼자 알고 있기엔 너무 아까운 포인트라 올림.`,
      `공감되면 저장해두면 됨. 나중에 진짜 쓸모있는 날 옴.`,
    ],
    [
      `이거 알고 나서 비슷한 상황이 왔을 때 전혀 다르게 대처했음.`,
      `몰랐으면 또 같은 실수 했을 거임.`,
      `그냥 지나치기엔 너무 흔한 상황이라 기록해둠.`,
    ],
  ]

  const pick = (arr) => arr[Math.floor(Math.abs(Math.sin(t.length + k.length)) * arr.length)]

  return [
    l,
    '',
    pick(openers),
    '',
    ...pick(middles),
    '',
    ...pick(closers),
  ].join('\n')
}

function nowIso() {
  return new Date().toISOString()
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function getCurrentUserId() {
  const existing = localStorage.getItem(USER_ID_KEY)
  if (existing && String(existing).trim() !== '') return String(existing)
  const next = uid()
  localStorage.setItem(USER_ID_KEY, next)
  return next
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedPosts()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return seedPosts()
    return parsed
  } catch {
    return seedPosts()
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

async function syncPostsWithCloud() {
  if (!canUseCloud()) return
  try {
    const cloudPosts = await fetchPostsFromCloud()
    const localPosts = loadPosts()

    if (cloudPosts.length > 0) {
      savePosts(cloudPosts)
      render()
      return
    }

    // Cloud is empty and local already has posts: seed cloud once from local.
    const alreadySeeded = localStorage.getItem(CLOUD_SYNC_KEY) === '1'
    if (!alreadySeeded && localPosts.length > 0) {
      await Promise.all(localPosts.map((post) => upsertPostToCloud(post)))
      localStorage.setItem(CLOUD_SYNC_KEY, '1')
    }
  } catch (err) {
    console.warn('[firebase] Failed to sync posts with Firestore.', err)
  }
}

function ensureAutoSeedShots(posts) {
  const already = localStorage.getItem(AUTO_SEED_KEY) === '1'
  if (already) return posts

  const existingLines = new Set(
    posts.filter((p) => isShot(p)).map((p) => String(p.line || '').trim())
  )

  const baseTime = Date.now()
  const toAdd = AUTO_SHOTS.filter((s) => !existingLines.has(String(s.line).trim())).map((s, i) => ({
    id: uid(),
    type: 'shot',
    title: s.title,
    topic: s.topic,
    line: s.line,
    content: generateLongDetailFromShot({ title: s.title, topic: s.topic, line: s.line }),
    createdAt: new Date(baseTime - i * 60_000).toISOString(),
    likeCount: 0
  }))

  const next = posts.concat(toAdd)
  savePosts(next)
  localStorage.setItem(AUTO_SEED_KEY, '1')
  return next
}

function ensureShotDetailContent(posts) {
  let changed = false
  const next = posts.map((p) => {
    if (!isShot(p)) return p
    const content = String(p.content || '').trim()
    if (content.length >= 80) return p
    changed = true
    return {
      ...p,
      content: generateLongDetailFromShot({
        title: p.title,
        topic: p.topic,
        line: p.line
      })
    }
  })
  if (changed) savePosts(next)
  return next
}

function loadLikes() {
  try {
    const raw = localStorage.getItem(LIKES_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.map(String))
  } catch {
    return new Set()
  }
}

function loadComments() {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed
  } catch {
    return {}
  }
}

function saveComments(commentsMap) {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(commentsMap))
  saveCommentsToCloud(commentsMap).catch((err) => {
    console.warn('[firebase] Failed to save comments to Firestore.', err)
  })
}

function saveLikes(likesSet) {
  localStorage.setItem(LIKES_KEY, JSON.stringify(Array.from(likesSet)))
  saveLikesToCloud(likesSet).catch((err) => {
    console.warn('[firebase] Failed to save likes to Firestore.', err)
  })
}

function loadReports() {
  try {
    const raw = localStorage.getItem(REPORTS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed
  } catch {
    return {}
  }
}

function saveReports(reportMap) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reportMap))
  saveReportsToCloud(reportMap).catch((err) => {
    console.warn('[firebase] Failed to save reports to Firestore.', err)
  })
}

function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed
  } catch {
    return {}
  }
}

function saveStats(statsMap) {
  localStorage.setItem(STATS_KEY, JSON.stringify(statsMap))
  saveStatsToCloud(statsMap).catch((err) => {
    console.warn('[firebase] Failed to save stats to Firestore.', err)
  })
}

async function syncMetaWithCloud() {
  if (!canUseCloud()) return
  try {
    const [cloudLikes, cloudReports, cloudStats, cloudComments] = await Promise.all([
      fetchLikesFromCloud(),
      fetchReportsFromCloud(),
      fetchStatsFromCloud(),
      fetchCommentsFromCloud()
    ])

    const hasCloudMeta =
      cloudLikes !== null || cloudReports !== null || cloudStats !== null || cloudComments !== null

    if (hasCloudMeta) {
      if (cloudLikes !== null) localStorage.setItem(LIKES_KEY, JSON.stringify(cloudLikes))
      if (cloudReports !== null) localStorage.setItem(REPORTS_KEY, JSON.stringify(cloudReports))
      if (cloudStats !== null) localStorage.setItem(STATS_KEY, JSON.stringify(cloudStats))
      if (cloudComments !== null) localStorage.setItem(COMMENTS_KEY, JSON.stringify(cloudComments))
      render()
      return
    }

    const alreadySeeded = localStorage.getItem(CLOUD_META_SYNC_KEY) === '1'
    if (!alreadySeeded) {
      await Promise.all([
        saveLikesToCloud(loadLikes()),
        saveReportsToCloud(loadReports()),
        saveStatsToCloud(loadStats()),
        saveCommentsToCloud(loadComments())
      ])
      localStorage.setItem(CLOUD_META_SYNC_KEY, '1')
    }
  } catch (err) {
    console.warn('[firebase] Failed to sync meta with Firestore.', err)
  }
}

function getPostStats(statsMap, id) {
  const v = statsMap?.[id]
  if (!v || typeof v !== 'object') return { dwellMs: 0, saves: 0, shares: 0 }
  return {
    dwellMs: Number(v.dwellMs ?? 0),
    saves: Number(v.saves ?? 0),
    shares: Number(v.shares ?? 0)
  }
}

function isHiddenByReports(post, reportsMap) {
  const id = String(post?.id ?? '')
  const rc = Number(reportsMap?.[id]?.count ?? 0)
  return rc >= REPORT_HIDE_THRESHOLD
}

function isShot(post) {
  return post && post.type === 'shot' && typeof post.line === 'string' && post.line.trim() !== ''
}

function seedPosts() {
  const posts = [
    {
      id: uid(),
      type: 'shot',
      title: '말을 아끼게 되는 밤',
      topic: '감정',
      line: '솔직히 말하면, 답을 기다리는 시간보다 내 마음을 정리하는 시간이 더 오래 걸렸음.',
      content:
        '짧은 문장 하나가 하루의 분위기를 바꿀 때가 있어요.\n\n이 피드는 그런 한 줄을 담아 보여줍니다.',
      createdAt: nowIso(),
      likeCount: 12
    },
    {
      id: uid(),
      type: 'shot',
      title: '완벽보다 시작',
      topic: '자기계발',
      line: '근데 이게 진짜였음. 준비가 덜 되어도 5분만 시작하면 생각보다 오래 가더라.',
      content:
        '긴 계획보다 짧은 실행이 다음 행동을 부릅니다.',
      createdAt: nowIso(),
      likeCount: 7
    },
    {
      id: uid(),
      title: '프론트엔드 공부 시작하기',
      topic: '개발',
      content:
        'HTML/CSS/JS로 작은 앱을 만들어보는 게 가장 빠른 연습입니다.\n\n- 목록 화면\n- 상세 화면\n- 글쓰기 화면\n\n이 3개를 먼저 만들어보세요.',
      createdAt: nowIso()
    },
    {
      id: uid(),
      title: '맛집 추천 기준',
      topic: '일상',
      content:
        '내가 좋아하는 맛집은 “재방문 의사”로 판단합니다.\n\n- 다시 가고 싶은가?\n- 가격 대비 만족도가 좋은가?\n- 같이 간 사람도 만족했는가?',
      createdAt: nowIso(),
      likeCount: 0
    }
  ]
  savePosts(posts)
  return posts
}

function getRoute() {
  const hash = location.hash || '#/'
  const clean = hash.replace(/^#/, '')
  const [pathPart, queryPart = ''] = clean.split('?')
  const path = pathPart || '/'
  const query = Object.fromEntries(new URLSearchParams(queryPart))
  return { path, query }
}

function setHash(path, query = {}) {
  const qs = new URLSearchParams(
    Object.entries(query).filter(([, v]) => v != null && String(v).trim() !== '')
  ).toString()
  location.hash = `#${path}${qs ? `?${qs}` : ''}`
}

function formatDate(iso) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleString()
  } catch {
    return ''
  }
}

function render() {
  const root = document.querySelector('#app')
  if (!root) return

  const posts = ensureShotDetailContent(ensureAutoSeedShots(loadPosts()))
  const { path, query } = getRoute()
  const commentsMap = loadComments()
  const likes = loadLikes()
  const stats = loadStats()

  const q = String(query.q ?? '').trim().toLowerCase()
  const topic = String(query.topic ?? '').trim().toLowerCase()

  const filtered = posts
    .slice()
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .filter((p) => {
      const t = `${p.title ?? ''}`.toLowerCase()
      const tp = `${p.topic ?? ''}`.toLowerCase()
      const matchesQ = !q || t.includes(q) || tp.includes(q)
      const matchesTopic = !topic || tp === topic
      return matchesQ && matchesTopic
    })

  const selectedId = path.startsWith('/post/') ? path.split('/post/')[1] : null
  const selected = selectedId ? posts.find((p) => p.id === selectedId) : null
  const isNew = path === '/new'
  const isList = path === '/list'
  const isMine = path === '/mine'
  const isHome = path === '/'
  const currentUserId = getCurrentUserId()

  const topicSet = Array.from(
    new Set(
      posts
        .map((p) => String(p.topic || '').trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b))

  const shots = posts
    .filter((p) => isShot(p))
    .slice()
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

  const scoredShots = rankShots(shots, likes, stats, query.topic ?? '')
  const myPosts = posts
    .filter((p) => String(p.authorId || '') === currentUserId)
    .slice()
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

  const page =
    isHome
      ? renderHome(scoredShots)
      : isList
        ? renderList(filtered, { q: query.q ?? '', topic: query.topic ?? '' }, topicSet, selectedId)
        : isMine
          ? renderMine(myPosts)
        : isNew
          ? renderNewForm()
          : selected
            ? renderDetail(selected, commentsMap)
            : renderNotFound()

  root.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div class="brand"></div>
        <div class="topbar__actions"></div>
      </header>

      <main class="content">
        ${page}
      </main>

      <nav class="bottomnav" aria-label="하단 메뉴">
        <button class="bottomnav__btn ${isHome ? 'is-active' : ''}" data-action="go-home">
          홈
        </button>
        <button class="bottomnav__btn ${isList ? 'is-active' : ''}" data-action="go-list">
          목록
        </button>
        <button class="bottomnav__btn ${isMine ? 'is-active' : ''}" data-action="go-mine">
          내 프로필
        </button>
        <button class="bottomnav__btn ${isNew ? 'is-active' : ''}" data-action="go-new">
          글작성
        </button>
      </nav>
    </div>
  `

  if (isHome) {
    setupFeedDwellTracking()
  }
}

function renderNotFound() {
  return `
    <section class="card">
      <h2 class="h2">페이지를 찾지 못했어요</h2>
      <p class="muted">하단의 홈/목록 버튼을 눌러 이동해 주세요.</p>
      <div class="spacer"></div>
      <button class="btn btn--primary" data-action="go-home">홈으로</button>
    </section>
  `
}

function rankShots(shots, likes, statsMap, preferredTopic = '') {
  const normalizeTopicKey = (v) => String(v || '').trim().toLowerCase()
  const getRandomSeedMap = () => {
    try {
      const raw = localStorage.getItem(COLD_START_RANDOM_SEED_KEY)
      const parsed = raw ? JSON.parse(raw) : {}
      return parsed && typeof parsed === 'object' ? parsed : {}
    } catch {
      return {}
    }
  }
  const saveRandomSeedMap = (seedMap) => {
    localStorage.setItem(COLD_START_RANDOM_SEED_KEY, JSON.stringify(seedMap))
  }
  const topicScores = {}
  let totalSignals = 0

  for (const post of shots) {
    const st = getPostStats(statsMap, post.id)
    const liked = likes.has(post.id)
    const signal = (liked ? 1 : 0) + st.saves + st.shares + Math.min(3, Math.floor(st.dwellMs / 2000))
    totalSignals += signal
    const key = normalizeTopicKey(post.topic)
    if (!key) continue
    topicScores[key] = Number(topicScores[key] ?? 0) + signal
  }

  const maxTopicSignal = Math.max(1, ...Object.values(topicScores).map((v) => Number(v || 0)))
  const preferredTopicKey = normalizeTopicKey(preferredTopic)
  const totalInteractions = Object.values(statsMap || {}).reduce((acc, st) => {
    const s = st && typeof st === 'object' ? st : {}
    return acc + Number(s.saves ?? 0) + Number(s.shares ?? 0) + Math.min(5, Math.floor(Number(s.dwellMs ?? 0) / 2000))
  }, 0)

  // Cold start: 상호작용이 적을수록 탐색 비율을 높여 다양한 후보를 노출.
  const coldStartProgress = Math.min(1, totalInteractions / 25)
  const explorationWeight = 1 - coldStartProgress
  const seedMap = getRandomSeedMap()
  let seedDirty = false
  const getStableRandom = (id) => {
    const key = String(id || '')
    if (!key) return 0
    if (typeof seedMap[key] !== 'number') {
      seedMap[key] = Math.random()
      seedDirty = true
    }
    return Number(seedMap[key] || 0)
  }

  const scoreShot = (p) => {
    const st = getPostStats(statsMap, p.id)
    const liked = likes.has(p.id)
    const key = normalizeTopicKey(p.topic)
    const topicAffinity = key ? Number(topicScores[key] ?? 0) / maxTopicSignal : 0
    const dwellScore = Math.min(8, Math.floor(st.dwellMs / 1500))
    const engagementScore = totalSignals < 8 ? 0 : (liked ? 3 : 0) + st.saves * 4 + st.shares * 5 + dwellScore

    // 최근 글도 일정 비율 섞어서 피드가 고이지 않게 함.
    const ageHours = Math.max(
      0,
      (Date.now() - new Date(p.createdAt || Date.now()).getTime()) / (1000 * 60 * 60)
    )
    const freshnessBonus = Math.max(0, 2 - ageHours / 24)

    // 사용자가 주제 필터를 선택한 경우 해당 주제에 추가 가중치.
    const explicitPreferenceBonus =
      preferredTopicKey && key && preferredTopicKey === key ? 6 : 0

    const explorationBonus = getStableRandom(p.id) * 6 * explorationWeight
    return engagementScore + topicAffinity * 6 + freshnessBonus + explicitPreferenceBonus + explorationBonus
  }

  const sortBySignalThenRecent = (arr) =>
    arr
      .map((p) => ({ p, score: scoreShot(p) }))
      .sort((a, b) => b.score - a.score || (b.p.createdAt || '').localeCompare(a.p.createdAt || ''))
      .map((x) => x.p)

  const light = sortBySignalThenRecent(
    shots.filter((p) => { const t = String(p.topic || ''); return t.includes('썰') || t.includes('공감') || t.includes('반응'); })
  )
  const deep = sortBySignalThenRecent(
    shots.filter((p) => { const t = String(p.topic || ''); return !t.includes('썰') && !t.includes('공감') && !t.includes('반응'); })
  )

  // 홈 노출 비율: 가벼운 썰 50% / 심화 50%
  const total = shots.length
  const targetLight = Math.floor(total / 2)
  const targetDeep = total - targetLight

  const takeLight = light.slice(0, targetLight)
  const takeDeep = deep.slice(0, targetDeep)
  const mixed = []
  const maxLen = Math.max(takeLight.length, takeDeep.length)
  for (let i = 0; i < maxLen; i += 1) {
    if (takeLight[i]) mixed.push(takeLight[i])
    if (takeDeep[i]) mixed.push(takeDeep[i])
  }

  // 한쪽 풀이 부족할 때 남은 쪽으로 보충
  if (mixed.length < total) {
    const used = new Set(mixed.map((p) => p.id))
    const fallback = sortBySignalThenRecent(shots).filter((p) => !used.has(p.id))
    mixed.push(...fallback.slice(0, total - mixed.length))
  }

  if (seedDirty) saveRandomSeedMap(seedMap)

  return mixed
}

function renderHome(shots) {
  return `
    <section class="feed">
      <div class="feed__viewport" id="feedViewport" aria-label="추천 한 줄 피드">
        ${
          shots.length
            ? shots
                .map((p, idx) => {
                  const bg = (idx % 6) + 1
                  return `
                    <section class="feed__item" data-bg="${bg}" data-action="open" data-id="${escapeHtml(
                      p.id
                    )}">
                      <div class="feed__overlay"></div>
                      <div class="feed__content">
                        <div class="feed__line">${escapeHtml(p.line)}</div>
                        <div class="feed__meta">
                          <span class="pill pill--ghost">${escapeHtml(p.topic || '추천')}</span>
                          <span class="muted">${escapeHtml(formatDate(p.createdAt))}</span>
                        </div>
                      </div>

                      <div class="feed__hint" aria-hidden="true">
                        <div class="feed__hintDot"></div>
                        <div class="feed__hintText">스크롤</div>
                      </div>
                    </section>
                  `
                })
                .join('')
            : `
              <section class="feed__empty">
                <div class="feed__emptyTitle">아직 “한 줄”이 없어요</div>
                <div class="feed__emptySub">하단의 글작성에서 “한 줄 글(쇼츠)”를 작성해 주세요.</div>
                <div class="spacer"></div>
                <button class="btn btn--primary" data-action="go-new">한 줄 쓰기</button>
              </section>
            `
        }
      </div>
    </section>
  `
}

function renderList(posts, currentFilters, topicSet, selectedId) {
  const q = String(currentFilters.q ?? '')
  const topic = String(currentFilters.topic ?? '').trim().toLowerCase()

  return `
    <section class="card">
      <h2 class="h2">게시글 제목 목록</h2>
      <div class="grid2">
        <div class="panel panel--flat">
          <div class="panel__title">찾기</div>
          <div class="field">
            <label class="field__label" for="search">검색 (제목/주제)</label>
            <input id="search" class="input" placeholder="예: 개발" value="${escapeHtml(q)}" />
          </div>
          <div class="field">
            <label class="field__label" for="topic">주제 필터</label>
            <select id="topic" class="select">
              <option value="">전체</option>
              ${topicSet
                .map((t) => {
                  const selectedAttr = t.toLowerCase() === topic ? ' selected' : ''
                  return `<option value="${escapeHtml(t)}"${selectedAttr}>${escapeHtml(t)}</option>`
                })
                .join('')}
            </select>
          </div>
        </div>

        <div class="panel panel--flat">
          <div class="panel__title">제목</div>
          <div class="list" role="list">
            ${
              posts.length
                ? posts
                    .map((p) => {
                      const active = p.id === selectedId
                      return `
                        <button
                          class="list__item ${active ? 'is-active' : ''}"
                          data-action="open"
                          data-id="${escapeHtml(p.id)}"
                          role="listitem"
                          title="${escapeHtml(p.title)}"
                        >
                          <div class="list__title">${escapeHtml(p.title)}</div>
                          <div class="list__meta">
                            <span class="pill">${escapeHtml(p.topic || '기타')}</span>
                            <span class="muted">${escapeHtml(formatDate(p.createdAt))}</span>
                          </div>
                        </button>
                      `
                    })
                    .join('')
                : `<div class="empty">조건에 맞는 게시글이 없어요.</div>`
            }
          </div>
        </div>
      </div>
    </section>
  `
}

function renderMine(posts) {
  return `
    <section class="card">
      <h2 class="h2">내 프로필</h2>
      <div class="list" role="list">
        ${
          posts.length
            ? posts
                .map(
                  (p) => `
                    <button
                      class="list__item"
                      data-action="open"
                      data-id="${escapeHtml(p.id)}"
                      role="listitem"
                      title="${escapeHtml(p.title)}"
                    >
                      <div class="list__title">${escapeHtml(p.title)}</div>
                      <div class="list__meta">
                        <span class="pill">${escapeHtml(p.topic || '기타')}</span>
                        <span class="muted">${escapeHtml(formatDate(p.createdAt))}</span>
                      </div>
                    </button>
                  `
                )
                .join('')
            : `<div class="empty">아직 작성한 글이 없어요. 글작성 탭에서 첫 글을 써보세요.</div>`
        }
      </div>
    </section>
  `
}

function renderDetail(post, commentsMap) {
  const oneLine = isShot(post) ? post.line : ''
  const contentText = String(post.content || '')
  const comments = Array.isArray(commentsMap?.[post.id]) ? commentsMap[post.id] : []
  const wordCount = contentText.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length
  const readMin = Math.max(1, Math.round(wordCount / 200))

  return `
    <article class="card detail">
      <div class="detail__back">
        <button class="btn" data-action="go-back">← 뒤로</button>
      </div>

      <div class="detail__head">
        <div>
          <div class="detail__title">${escapeHtml(post.title)}</div>
          <div class="detail__meta">
            <span class="pill">${escapeHtml(post.topic || '기타')}</span>
            <span class="muted small">${escapeHtml(formatDate(post.createdAt))}</span>
            <span class="muted small">읽기 약 ${readMin}분</span>
          </div>
        </div>
      </div>

      ${oneLine ? `<div class="detail__line">${escapeHtml(oneLine)}</div>` : ''}

      <div class="detail__body">
        ${escapeHtml(contentText).replaceAll('\n', '<br/>')}
      </div>

      <div class="detail__footer">
        <div class="detail__comments">
          <div class="panel__title">댓글</div>
          <form class="detail__commentForm" data-action="create-comment">
            <input type="hidden" name="postId" value="${escapeHtml(post.id)}" />
            <textarea
              name="comment"
              class="textarea"
              rows="3"
              maxlength="400"
              placeholder="댓글을 입력하세요"
              required
            ></textarea>
            <div class="form__actions">
              <button type="submit" class="btn btn--primary">댓글 작성</button>
            </div>
          </form>
          <div class="detail__commentList">
            ${
              comments.length
                ? comments
                    .slice()
                    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
                    .map(
                      (c) => `
                        <div class="detail__commentItem">
                          <div class="detail__commentBody">${escapeHtml(String(c?.content || ''))}</div>
                          <div class="muted small">${escapeHtml(formatDate(c?.createdAt))}</div>
                        </div>
                      `
                    )
                    .join('')
                : '<div class="muted">첫 댓글을 남겨보세요.</div>'
            }
          </div>
        </div>
        <div class="detail__danger">
          <button class="btn btn--ghost" data-action="delete" data-id="${escapeHtml(post.id)}">삭제</button>
        </div>
      </div>
    </article>
  `
}

function renderNewForm() {
  return `
    <section class="card">
      <h2 class="h2">새 게시글 작성</h2>
      <form class="form" data-action="create">
        <div class="field">
          <label class="field__label" for="new-type">작성 종류</label>
          <select id="new-type" name="type" class="select">
            <option value="post" selected>일반 글</option>
            <option value="shot">한 줄 글(쇼츠)</option>
          </select>
          <div class="muted small">“한 줄 글”은 홈(추천) 피드에 카드로 뜹니다.</div>
        </div>
        <div class="field">
          <label class="field__label" for="new-title">제목</label>
          <input id="new-title" name="title" class="input" placeholder="제목을 입력하세요" required maxlength="60" />
        </div>
        <div class="field">
          <label class="field__label" for="new-topic">주제</label>
          <input id="new-topic" name="topic" class="input" placeholder="예: 일상, 연애, 직장" required maxlength="20" />
          <div class="muted small">추천 주제: 일상썰 · 연애썰 · 직장썰 · 학교썰 · 시사공감 · 연예공감 · 이슈반응 · 경제공감</div>
        </div>
        <div class="field" data-field="line">
          <label class="field__label" for="new-line">한 줄 (1~2줄)</label>
          <input id="new-line" name="line" class="input" placeholder="예: 오늘만큼은 너가 먼저 와줬으면…" maxlength="120" />
        </div>
        <div class="field">
          <label class="field__label" for="new-content">내용</label>
          <textarea id="new-content" name="content" class="textarea" placeholder="내용을 입력하세요" required rows="10" maxlength="5000"></textarea>
        </div>
        <div class="form__actions">
          <button type="button" class="btn" data-action="go-home">취소</button>
          <button type="submit" class="btn btn--primary">게시</button>
        </div>
      </form>
      <p class="muted small">저장은 브라우저의 로컬 저장소(localStorage)에 됩니다.</p>
    </section>
  `
}

async function onRootClick(e) {
  const el = e.target instanceof Element ? e.target.closest('[data-action]') : null
  if (!el) return
  const action = el.getAttribute('data-action')
  if (!action) return

  if (action === 'open') {
    const id = el.getAttribute('data-id')
    if (!id) return
    const { query } = getRoute()
    setHash(`/post/${id}`, query)
    return
  }

  if (action === 'go-back') {
    const { query } = getRoute()
    const hasListFilters = query.q || query.topic
    if (hasListFilters) {
      setHash('/list', query)
    } else {
      setHash('/', {})
    }
    return
  }

  if (action === 'go-new') {
    const { query } = getRoute()
    setHash('/new', query)
    return
  }

  if (action === 'go-list') {
    const { query } = getRoute()
    setHash('/list', query)
    return
  }

  if (action === 'go-mine') {
    const { query } = getRoute()
    setHash('/mine', query)
    return
  }

  if (action === 'go-home') {
    const { query } = getRoute()
    setHash('/', query)
    return
  }

  if (action === 'delete') {
    const id = el.getAttribute('data-id')
    if (!id) return
    const ok = confirm('이 게시글을 삭제할까요?')
    if (!ok) return
    const posts = loadPosts().filter((p) => p.id !== id)
    savePosts(posts)
    deletePostFromCloud(id).catch((err) => {
      console.warn('[firebase] Failed to delete post in Firestore.', err)
    })
    const { query } = getRoute()
    setHash('/', query)
    render()
    return
  }

}

async function onRootSubmit(e) {
  const form = e.target instanceof HTMLFormElement ? e.target : null
  if (!form) return
  const action = form.getAttribute('data-action')
  if (!action) return
  e.preventDefault()

  if (action === 'create-comment') {
    const fd = new FormData(form)
    const postId = String(fd.get('postId') ?? '').trim()
    const comment = String(fd.get('comment') ?? '').trim()
    if (!postId || !comment) return
    const commentsMap = loadComments()
    const current = Array.isArray(commentsMap[postId]) ? commentsMap[postId] : []
    commentsMap[postId] = current.concat({
      id: uid(),
      content: comment,
      createdAt: nowIso()
    })
    saveComments(commentsMap)
    render()
    return
  }

  if (action !== 'create') return

  const fd = new FormData(form)
  const type = String(fd.get('type') ?? 'post').trim()
  const title = String(fd.get('title') ?? '').trim()
  const topic = String(fd.get('topic') ?? '').trim()
  const content = String(fd.get('content') ?? '').trim()
  const line = clampLine(fd.get('line'))

  if (!title || !topic) return
  if (type === 'shot' && !line) return
  if (type !== 'shot' && !content) return

  // 커뮤니티 가이드라인(기능적 적용): 혐오/비하 등 금지 + 짧고 명확하게(쇼츠는 3줄 이내)
  if (violatesGuideline(`${title}\n${topic}\n${line}\n${content}`)) {
    alert('가이드라인에 위반될 수 있는 표현이 있어요. 문장을 수정해 주세요.')
    return
  }
  if (type === 'shot') {
    const contentLines = countLines(content)
    if (contentLines > 3) {
      alert('한 줄 글(쇼츠)은 설명을 포함해도 3줄 이내로 작성해 주세요.')
      return
    }
  }

  const posts = loadPosts()
  const post = {
    id: uid(),
    type: type === 'shot' ? 'shot' : 'post',
    authorId: getCurrentUserId(),
    title,
    topic,
    content:
      type === 'shot'
        ? (content || generateLongDetailFromShot({ title, topic, line }))
        : content,
    createdAt: nowIso(),
    likeCount: 0,
    ...(type === 'shot' ? { line } : {})
  }
  posts.push(post)
  savePosts(posts)
  upsertPostToCloud(post).catch((err) => {
    console.warn('[firebase] Failed to write post to Firestore.', err)
  })

  const { query } = getRoute()
  setHash(`/post/${post.id}`, query)
  render()
}

function onSidebarSearchInput() {
  const q = String(document.querySelector('#search')?.value ?? '')
  const topic = String(document.querySelector('#topic')?.value ?? '')
  const { path } = getRoute()
  setHash(path, { q, topic })
}

function bindGlobalEvents() {
  const root = document.querySelector('#app')
  if (!root) return

  root.addEventListener('click', onRootClick)
  root.addEventListener('submit', onRootSubmit)
  root.addEventListener('input', (e) => {
    const t = e.target
    if (!(t instanceof Element)) return
    if (t.id === 'search' || t.id === 'topic') onSidebarSearchInput()

    if (t.id === 'new-type') {
      const v = String(document.querySelector('#new-type')?.value ?? 'post')
      const lineField = document.querySelector('[data-field="line"]')
      if (lineField instanceof HTMLElement) {
        lineField.style.display = v === 'shot' ? '' : 'none'
      }
    }
  })

  window.addEventListener('hashchange', render)
}

bindGlobalEvents()
render()
syncPostsWithCloud()
syncMetaWithCloud()

let feedObserver = null
function setupFeedDwellTracking() {
  const viewport = document.querySelector('#feedViewport')
  if (!(viewport instanceof HTMLElement)) return

  if (feedObserver) {
    feedObserver.disconnect()
    feedObserver = null
  }

  const startedAt = new Map()
  feedObserver = new IntersectionObserver(
    (entries) => {
      const stats = loadStats()
      for (const entry of entries) {
        const item = entry.target
        if (!(item instanceof HTMLElement)) continue
        const id = item.querySelector('[data-action="like"]')?.getAttribute('data-id')
        if (!id) continue

        if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
          startedAt.set(id, performance.now())
        } else {
          const start = startedAt.get(id)
          if (typeof start === 'number') {
            const delta = Math.max(0, performance.now() - start)
            const curr = getPostStats(stats, id)
            stats[id] = { ...curr, dwellMs: curr.dwellMs + Math.round(delta) }
            startedAt.delete(id)
          }
        }
      }
      saveStats(stats)
    },
    { root: viewport, threshold: [0.0, 0.65, 1.0] }
  )

  viewport.querySelectorAll('.feed__item').forEach((el) => feedObserver.observe(el))
}
