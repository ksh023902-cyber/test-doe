import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { canUseCloud } from './firestorePosts'

const META_COLLECTION = 'appMeta'
const LIKES_DOC = 'likes'
const REPORTS_DOC = 'reports'
const STATS_DOC = 'stats'
const COMMENTS_DOC = 'comments'

function toObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return value
}

async function fetchLikesFromCloud() {
  if (!canUseCloud() || !db) return null
  const snap = await getDoc(doc(db, META_COLLECTION, LIKES_DOC))
  if (!snap.exists()) return null
  const raw = snap.data()?.items
  return Array.isArray(raw) ? raw.map(String) : []
}

async function saveLikesToCloud(likesSet) {
  if (!canUseCloud() || !db) return
  await setDoc(
    doc(db, META_COLLECTION, LIKES_DOC),
    { items: Array.from(likesSet).map(String), updatedAt: new Date().toISOString() },
    { merge: true }
  )
}

async function fetchReportsFromCloud() {
  if (!canUseCloud() || !db) return null
  const snap = await getDoc(doc(db, META_COLLECTION, REPORTS_DOC))
  if (!snap.exists()) return null
  return toObject(snap.data()?.items)
}

async function saveReportsToCloud(reportMap) {
  if (!canUseCloud() || !db) return
  await setDoc(
    doc(db, META_COLLECTION, REPORTS_DOC),
    { items: toObject(reportMap), updatedAt: new Date().toISOString() },
    { merge: true }
  )
}

async function fetchStatsFromCloud() {
  if (!canUseCloud() || !db) return null
  const snap = await getDoc(doc(db, META_COLLECTION, STATS_DOC))
  if (!snap.exists()) return null
  return toObject(snap.data()?.items)
}

async function saveStatsToCloud(statsMap) {
  if (!canUseCloud() || !db) return
  await setDoc(
    doc(db, META_COLLECTION, STATS_DOC),
    { items: toObject(statsMap), updatedAt: new Date().toISOString() },
    { merge: true }
  )
}

async function fetchCommentsFromCloud() {
  if (!canUseCloud() || !db) return null
  const snap = await getDoc(doc(db, META_COLLECTION, COMMENTS_DOC))
  if (!snap.exists()) return null
  return toObject(snap.data()?.items)
}

async function saveCommentsToCloud(commentsMap) {
  if (!canUseCloud() || !db) return
  await setDoc(
    doc(db, META_COLLECTION, COMMENTS_DOC),
    { items: toObject(commentsMap), updatedAt: new Date().toISOString() },
    { merge: true }
  )
}

export {
  fetchLikesFromCloud,
  saveLikesToCloud,
  fetchReportsFromCloud,
  saveReportsToCloud,
  fetchStatsFromCloud,
  saveStatsToCloud,
  fetchCommentsFromCloud,
  saveCommentsToCloud
}
