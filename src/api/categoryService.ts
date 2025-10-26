import { db } from '../../firebase-config.ts'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  type DocumentData
} from 'firebase/firestore'
import type { Category } from '@/types'

const COLLECTION_NAME = 'categories'

export async function getCategories(): Promise<Category[]> {
  try {
    const categoriesCollection = collection(db, COLLECTION_NAME)
    const snapshot = await getDocs(categoriesCollection)

    const categories: Category[] = []
    snapshot.forEach(doc => {
      const data = doc.data() as DocumentData
      categories.push({
        id: doc.id,
        name: data.name,
        icon: data.icon,
        color: data.color,
        schema: data.schema || []
      })
    })

    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}


export async function getCategoryById(id: string): Promise<Category> {
  try {
    const categoryRef = doc(db, COLLECTION_NAME, id)
    const snapshot = await getDoc(categoryRef)

    const data = snapshot.data() as DocumentData

    return {
      id: snapshot.id,
      name: data.name,
      icon: data.icon,
      color: data.color,
      schema: data.schema || []
    }
  } catch (error) {
    console.error('Error fetching category:', error)
    throw error
  }
}


export async function CreateCategory(category: Omit<Category, 'id'>): Promise<string> {
  try {
    const categoriesCollection = collection(db, COLLECTION_NAME)
    const docRef = await addDoc(categoriesCollection, {
      name: category.name,
      icon: category.icon,
      color: category.color,
      schema: category.schema
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding category:', error)
    throw error
  }
}


export async function updateCategory(category: Category): Promise<void> {
  try {
    const categoryRef = doc(db, COLLECTION_NAME, category.id)
    const { id: _id, ...data } = category
    await updateDoc(categoryRef, data)
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}


export async function deleteCategory(id: string): Promise<void> {
  try {
    const categoryRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(categoryRef)
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}
