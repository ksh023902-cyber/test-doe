import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore'
import { db, hasFirebaseConfig } from './firebase'

const POSTS_COLLECTION = 'posts'

function toIsoString(value) {
  if (!value) return new Date().toISOString()
  if (typeof value === 'string') return value
  if (typeof value?.toDate === 'function') return value.toDate().toISOString()
  return new Date(value).toISOString()
}

function normalizePost(id, raw) {
  return {
    id: String(id),
    type: raw?.type === 'shot' ? 'shot' : 'post',
    title: String(raw?.title || ''),
    topic: String(raw?.topic || ''),
    content: String(raw?.content || ''),
    createdAt: toIsoString(raw?.createdAt),
    likeCount: Number(raw?.likeCount ?? 0),
    ...(raw?.line ? { line: String(raw.line) } : {})
  }
}

function canUseCloud() {
  return hasFirebaseConfig() && !!db
}

async function fetchPostsFromCloud() {
  if (!canUseCloud()) return []
  const snap = await getDocs(collection(db, POSTS_COLLECTION))
  return snap.docs.map((d) => normalizePost(d.id, d.data()))
}

async function upsertPostToCloud(post) {
  if (!canUseCloud()) return
  const id = String(post?.id || '').trim()
  if (!id) return
  await setDoc(doc(db, POSTS_COLLECTION, id), post, { merge: true })
}

async function deletePostFromCloud(postId) {
  if (!canUseCloud()) return
  const id = String(postId || '').trim()
  if (!id) return
  await deleteDoc(doc(db, POSTS_COLLECTION, id))
}

export { canUseCloud, fetchPostsFromCloud, upsertPostToCloud, deletePostFromCloud }
