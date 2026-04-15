import './assets/main.css'

const STORAGE_KEY = 'doe.posts.v2'
const LIKES_KEY = 'doe.likes.v1'
const REPORTS_KEY = 'doe.reports.v1'
const STATS_KEY = 'doe.stats.v1'
const REPORT_HIDE_THRESHOLD = 3
const AUTO_SEED_KEY = 'doe.autoseed.v2'

const AUTO_SHOTS = [
  { topic: '일상썰', title: '엘리베이터 정적썰', line: '솔직히 말하면, 엘베에서 어색할 때 층수 버튼 한 번 더 누르는 척 다 해봤지?' },
  { topic: '일상썰', title: '카페 자리전쟁', line: '근데 이게 진짜였음. 콘센트 있는 자리 비면 사람들 눈빛부터 달라짐.' },
  { topic: '일상썰', title: '배달앱 현실', line: '다들 이거 모르더라고. 메뉴 고르는 30분이 먹는 10분보다 길어질 때가 있음.' },
  { topic: '일상썰', title: '알람과의 전쟁', line: '나만 늦은 줄 알았는데 아니었음. 1차 알람은 기상용이 아니라 마음의 준비용이었음.' },
  { topic: '일상썰', title: '읽씹 착각썰', line: '솔직히 말하면, 답장 늦었다고 서운했는데 보니까 나도 알림 꺼두고 살고 있었음.' },
  { topic: '연애썰', title: '소개팅 애매함', line: '근데 이게 진짜였음. 소개팅은 별로였는데 집 가는 길 대화가 더 재밌는 경우 있음.' },
  { topic: '연애썰', title: '사진과 실물', line: '다들 이거 모르더라고. 프로필 사진보다 말투에서 호감이 갈릴 때가 더 많더라.' },
  { topic: '학교썰', title: '조별과제 국룰', line: '나만 늦은 줄 알았는데 아니었음. 조별과제 톡방은 항상 한 명이 새벽에 살려냄.' },
  { topic: '학교썰', title: '시험기간 밈', line: '솔직히 말하면, 시험기간엔 갑자기 책상 정리 실력이 만렙이 됨.' },
  { topic: '직장썰', title: '회의 공감', line: '근데 이게 진짜였음. 회의 길수록 결론은 마지막 3분에 나옴.' },
  { topic: '직장썰', title: '점심메뉴 회의', line: '다들 이거 모르더라고. 업무 회의보다 점심 메뉴 정하는 데 에너지 더 씀.' },
  { topic: '직장썰', title: '퇴근 직전 미스터리', line: '나만 늦은 줄 알았는데 아니었음. 급한 건 항상 퇴근 10분 전에 도착함.' },
  { topic: '돈썰', title: '통장잔고 체감', line: '솔직히 말하면, 큰 지출보다 소액 결제 누적이 더 무섭게 느껴짐.' },
  { topic: '인간관계썰', title: '단톡방 관찰일지', line: '근데 이게 진짜였음. 단톡에선 이모지 하나로 분위기 읽는 사람들 있음.' },
  { topic: '인간관계썰', title: '약속 잡기 난이도', line: '다들 이거 모르더라고. 진짜 바쁜 건 시간 없는 게 아니라 일정 맞추기가 어려운 거였음.' },
  { topic: '연애', title: '편한 관계의 기준', line: '솔직히 말하면, 좋아하는데도 계속 불안하면 사랑보다 확인이 더 필요한 상태였음.' },
  { topic: '연애', title: '답장의 의미', line: '근데 이게 진짜였음. 연락 속도보다 연락 이후의 태도가 더 중요하더라.' },
  { topic: '연애', title: '식는 건 갑자기 아님', line: '나만 늦은 줄 알았는데 아니었음. 멀어지는 건 사건 하나보다 작은 실망의 누적이었음.' },
  { topic: '연애', title: '사과의 완성', line: '다들 이거 모르더라고. 미안하다는 말은 시작이고, 같은 실수를 안 하는 게 끝이더라.' },
  { topic: '인간관계', title: '가까울수록 선', line: '솔직히 말하면, 친하다는 이유로 선을 넘는 순간 관계가 오래가기 어려웠음.' },
  { topic: '인간관계', title: '말투의 무게', line: '근데 이게 진짜였음. 장난처럼 한 말도 반복되면 그 사람이 가진 기준이 보이더라.' },
  { topic: '인간관계', title: '존중의 신호', line: '다들 이거 모르더라고. 바쁠 때 어떻게 대하는지가 진짜 존중의 신호였음.' },
  { topic: '인간관계', title: '말보다 반복', line: '나만 늦은 줄 알았는데 아니었음. 사람은 말보다 행동 패턴으로 보는 게 맞더라.' },
  { topic: '자기계발', title: '의지보다 환경', line: '솔직히 말하면, 꾸준함은 참는 힘보다 방해를 줄인 환경에서 더 잘 만들어졌음.' },
  { topic: '자기계발', title: '작은 시작', line: '근데 이게 진짜였음. 완벽한 계획보다 10분 실행이 다음 하루를 바꾸더라.' },
  { topic: '자기계발', title: '비교의 함정', line: '다들 이거 모르더라고. 남의 속도랑 비교할수록 내 페이스를 잃게 되더라.' },
  { topic: '자기계발', title: '루틴의 본질', line: '나만 늦은 줄 알았는데 아니었음. 잘하는 사람도 무너지고, 다시 돌아오는 속도가 빨랐음.' },
  { topic: '돈', title: '수입과 지출', line: '솔직히 말하면, 많이 버는 것보다 새는 습관을 먼저 잡는 게 체감이 더 빨랐음.' },
  { topic: '돈', title: '소비의 이유', line: '근데 이게 진짜였음. 필요한 것보다 기분을 달래려는 소비가 더 많더라.' },
  { topic: '돈', title: '작은 기록의 힘', line: '다들 이거 모르더라고. 지출을 적기만 해도 선택이 생각보다 차분해지더라.' },
  { topic: '돈', title: '속도보다 지속', line: '나만 늦은 줄 알았는데 아니었음. 돈은 한 번의 점프보다 오래 버티는 습관 게임이었음.' },
  { topic: '학교', title: '복습 타이밍', line: '솔직히 말하면, 오래 앉아 있는 시간보다 당일 복습 20분이 더 남더라.' },
  { topic: '학교', title: '오답 노트의 역할', line: '근데 이게 진짜였음. 틀린 문제를 다시 보는 횟수가 점수보다 자신감을 먼저 올려줌.' },
  { topic: '학교', title: '불안은 공통', line: '나만 늦은 줄 알았는데 아니었음. 다들 불안한데 겉으로만 담담해 보였던 거였음.' },
  { topic: '직장', title: '바쁨과 성과', line: '솔직히 말하면, 바쁜 하루가 좋은 하루는 아니었음. 중요한 일을 끝낸 날이 좋은 날이더라.' },
  { topic: '직장', title: '회의의 핵심', line: '근데 이게 진짜였음. 말 잘하는 것보다 요점을 짧게 정리하는 사람이 신뢰를 얻더라.' },
  { topic: '직장', title: '체력도 실력', line: '다들 이거 모르더라고. 업무 효율은 의욕보다 수면 상태에 더 크게 흔들렸음.' },
  { topic: '일상', title: '컨디션의 비밀', line: '솔직히 말하면, 하루 컨디션은 거창한 목표보다 잠과 물에서 먼저 갈리더라.' },
  { topic: '일상', title: '기분의 방향', line: '근데 이게 진짜였음. 기분이 좋아서 움직이는 게 아니라, 움직여야 기분이 조금씩 풀리더라.' },
  { topic: '일상', title: '작은 성취', line: '나만 늦은 줄 알았는데 아니었음. 해야 할 일 하나 끝내는 순간 불안이 조금 줄더라.' }
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
  return [
    `${l}`,
    '',
    `요약하면 ${k}에서 한 번쯤 겪는 “아 이거 나만 그런 거 아니네” 싶은 순간이었음.`,
    '',
    `${t} 얘기를 조금만 더 풀면 이렇다.`,
    '처음엔 별일 아닌 줄 알았는데, 막상 지나고 보니 그 장면이 계속 생각났음.',
    '대단한 교훈이라기보단, 작은 포인트 하나를 알게 된 느낌.',
    '',
    '비슷한 상황이 오면 너무 크게 해석하지 말고,',
    '내가 불편했던 지점 하나만 정확히 짚어보는 게 제일 깔끔했음.',
    '',
    '한 줄로는 짧게 끝나지만, 실제 썰은 생각보다 디테일이 많더라.'
  ].join('\n')
}

function nowIso() {
  return new Date().toISOString()
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
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

function saveLikes(likesSet) {
  localStorage.setItem(LIKES_KEY, JSON.stringify(Array.from(likesSet)))
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
  const likes = loadLikes()
  const reports = loadReports()
  const stats = loadStats()

  const q = String(query.q ?? '').trim().toLowerCase()
  const topic = String(query.topic ?? '').trim().toLowerCase()

  const filtered = posts
    .slice()
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .filter((p) => !isHiddenByReports(p, reports))
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
  const isHome = path === '/'

  const topicSet = Array.from(
    new Set(
      posts
        .filter((p) => !isHiddenByReports(p, reports))
        .map((p) => String(p.topic || '').trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b))

  const shots = posts
    .filter((p) => isShot(p))
    .filter((p) => !isHiddenByReports(p, reports))
    .slice()
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

  const scoredShots = rankShots(shots, likes, stats)

  const page =
    isHome
      ? renderHome(scoredShots, likes, reports, stats)
      : isList
        ? renderList(filtered, { q: query.q ?? '', topic: query.topic ?? '' }, topicSet, selectedId)
        : isNew
          ? renderNewForm()
          : selected
            ? renderDetail(selected, likes, reports, stats)
            : renderNotFound()

  root.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div class="brand">
          <div class="brand__title">게시글</div>
          <div class="brand__sub">홈은 추천, 목록은 전체 제목, 작성은 새 글</div>
        </div>
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

function rankShots(shots, likes, statsMap) {
  // 초기엔 시간순. 데이터가 쌓이면 (좋아요+저장+공유+체류) 기반으로 노출.
  const totalSignals = shots.reduce((acc, p) => {
    const st = getPostStats(statsMap, p.id)
    const liked = likes.has(p.id)
    return acc + (liked ? 1 : 0) + st.saves + st.shares + Math.min(3, Math.floor(st.dwellMs / 2000))
  }, 0)

  const scoreShot = (p) => {
    if (totalSignals < 8) return 0
    const st = getPostStats(statsMap, p.id)
    const liked = likes.has(p.id)
    const dwellScore = Math.min(8, Math.floor(st.dwellMs / 1500))
    return (liked ? 3 : 0) + st.saves * 4 + st.shares * 5 + dwellScore
  }

  const sortBySignalThenRecent = (arr) =>
    arr
      .map((p) => ({ p, score: scoreShot(p) }))
      .sort((a, b) => b.score - a.score || (b.p.createdAt || '').localeCompare(a.p.createdAt || ''))
      .map((x) => x.p)

  const light = sortBySignalThenRecent(
    shots.filter((p) => String(p.topic || '').includes('썰'))
  )
  const deep = sortBySignalThenRecent(
    shots.filter((p) => !String(p.topic || '').includes('썰'))
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

  return mixed
}

function renderHome(shots, likes, reports, stats) {
  return `
    <section class="feed">
      <div class="feed__top">
        <div class="feed__title">추천 한 줄</div>
        <div class="feed__sub">손가락으로 위/아래로 넘겨요</div>
      </div>

      <div class="feed__viewport" id="feedViewport" aria-label="추천 한 줄 피드">
        ${
          shots.length
            ? shots
                .map((p, idx) => {
                  const liked = likes.has(p.id)
                  const likeCount = Number(p.likeCount ?? 0) + (liked ? 1 : 0)
                  const st = getPostStats(stats, p.id)
                  const reportCount = Number(reports?.[p.id]?.count ?? 0)
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

                      <div class="feed__actions" aria-label="피드 액션">
                        <button class="iconbtn ${liked ? 'is-on' : ''}" data-action="like" data-id="${escapeHtml(
                          p.id
                        )}" aria-label="좋아요">
                          ♥
                        </button>
                        <div class="feed__count" aria-label="좋아요 수">${likeCount}</div>

                        <button class="iconbtn" data-action="save" data-id="${escapeHtml(
                          p.id
                        )}" aria-label="저장">
                          ⤓
                        </button>
                        <div class="feed__count" aria-label="저장 수">${st.saves}</div>

                        <button class="iconbtn" data-action="share" data-id="${escapeHtml(
                          p.id
                        )}" aria-label="공유">
                          ↗
                        </button>
                        <div class="feed__count" aria-label="공유 수">${st.shares}</div>

                        <button class="iconbtn" data-action="report" data-id="${escapeHtml(
                          p.id
                        )}" aria-label="신고">
                          !
                        </button>
                        <div class="feed__count" aria-label="신고 수">${reportCount}</div>

                        <button class="iconbtn" data-action="open" data-id="${escapeHtml(
                          p.id
                        )}" aria-label="자세히 보기">
                          ⓘ
                        </button>
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

function renderDetail(post, likes, reports, stats) {
  const liked = likes.has(post.id)
  const likeCount = Number(post.likeCount ?? 0) + (liked ? 1 : 0)
  const oneLine = isShot(post) ? post.line : ''
  const st = getPostStats(stats, post.id)
  const reportCount = Number(reports?.[post.id]?.count ?? 0)
  const contentText = String(post.content || '')
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
        <div class="detail__stats">
          <span class="detail__stat"><span class="detail__statIcon">♥</span><span class="detail__statNum">${likeCount}</span></span>
          <span class="detail__stat"><span class="detail__statIcon">⤓</span><span class="detail__statNum">${st.saves}</span></span>
          <span class="detail__stat"><span class="detail__statIcon">↗</span><span class="detail__statNum">${st.shares}</span></span>
        </div>

        <div class="detail__actions">
          <button class="btn ${liked ? 'btn--liked' : ''}" data-action="like" data-id="${escapeHtml(post.id)}">♥ 좋아요 ${likeCount}</button>
          <button class="btn" data-action="save" data-id="${escapeHtml(post.id)}">⤓ 저장 ${st.saves}</button>
          <button class="btn" data-action="share" data-id="${escapeHtml(post.id)}">↗ 공유 ${st.shares}</button>
        </div>

        <div class="detail__danger">
          <button class="btn btn--ghost" data-action="report" data-id="${escapeHtml(post.id)}">신고 ${reportCount}</button>
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
          <input id="new-topic" name="topic" class="input" placeholder="예: 개발, 일상, 여행" required maxlength="20" />
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

function onRootClick(e) {
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
    const { query } = getRoute()
    setHash('/', query)
    render()
    return
  }

  if (action === 'like') {
    const id = el.getAttribute('data-id')
    if (!id) return
    const likes = loadLikes()
    if (likes.has(id)) likes.delete(id)
    else likes.add(id)
    saveLikes(likes)
    render()
    return
  }

  if (action === 'save' || action === 'share') {
    const id = el.getAttribute('data-id')
    if (!id) return
    const stats = loadStats()
    const current = getPostStats(stats, id)
    const next =
      action === 'save'
        ? { ...current, saves: current.saves + 1 }
        : { ...current, shares: current.shares + 1 }
    stats[id] = next
    saveStats(stats)
    render()
    return
  }

  if (action === 'report') {
    const id = el.getAttribute('data-id')
    if (!id) return
    const reports = loadReports()
    const curr = reports[id] && typeof reports[id] === 'object' ? reports[id] : { count: 0 }
    const nextCount = Number(curr.count ?? 0) + 1
    reports[id] = { count: nextCount, lastAt: nowIso() }
    saveReports(reports)

    if (nextCount >= REPORT_HIDE_THRESHOLD) {
      // 2단계: 임시 숨김 (유저에겐 자연스럽게 노출에서 빠짐)
      // 운영자 검토 단계는 현재 앱에 관리자 UI가 없으므로 저장소에만 상태가 남음.
    }
    render()
  }
}

function onRootSubmit(e) {
  const form = e.target instanceof HTMLFormElement ? e.target : null
  if (!form) return
  const action = form.getAttribute('data-action')
  if (action !== 'create') return
  e.preventDefault()

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
