import { db } from '../../firebase-config.ts'
import {
  collection,
  getDocs,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  type DocumentData
} from 'firebase/firestore'
import type { Product } from '@/types'

const COLLECTION_NAME = 'products'

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const productsCollection = collection(db, COLLECTION_NAME)
    const q = query(productsCollection, where('categoryId', '==', categoryId))
    const snapshot = await getDocs(q)

    const products: Product[] = []
    snapshot.forEach(doc => {
      const data = doc.data() as DocumentData
      products.push({
        id: doc.id,
        name: data.name,
        categoryId: data.categoryId,
        price: data.price,
        stock: data.stock,
        attributes: data.attributes || {}
      })
    })

    return products
  } catch (error) {
    console.error('Error fetching products by category:', error)
    throw error
  }
}


export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  try {
    const productsCollection = collection(db, COLLECTION_NAME)
    const docRef = await addDoc(productsCollection, {
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock,
      attributes: product.attributes
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding product:', error)
    throw error
  }
}


export async function updateProduct(product: Product): Promise<void> {
  try {
    const productRef = doc(db, COLLECTION_NAME, product.id)
    const { id: _id, ...data } = product
    await updateDoc(productRef, data)
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}


export async function deleteProduct(id: string): Promise<void> {
  try {
    const productRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(productRef)
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}
