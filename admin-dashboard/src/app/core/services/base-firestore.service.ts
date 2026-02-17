import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentReference,
  CollectionReference,
  Timestamp
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

/**
 * Serviço base genérico para operações CRUD no Firestore.
 * Demonstra uso de Generics em TypeScript - conceito importante para nível Pleno.
 *
 * @example
 * // Criar um serviço específico:
 * export class ProductService extends BaseFirestoreService<Product> {
 *   constructor() {
 *     super('products');
 *   }
 * }
 */
export abstract class BaseFirestoreService<T extends { id?: string }> {
  protected firestore = inject(Firestore);
  protected collectionRef: CollectionReference;

  constructor(protected collectionName: string) {
    this.collectionRef = collection(this.firestore, collectionName);
  }

  /**
   * Retorna todos os documentos da coleção
   */
  getAll(): Observable<T[]> {
    return collectionData(this.collectionRef, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Retorna documentos com filtros e ordenação
   */
  query(...constraints: QueryConstraint[]): Observable<T[]> {
    const q = query(this.collectionRef, ...constraints);
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Retorna um documento por ID
   */
  getById(id: string): Observable<T | undefined> {
    const docRef = doc(this.firestore, this.collectionName, id);
    return docData(docRef, { idField: 'id' }) as Observable<T | undefined>;
  }

  /**
   * Cria um novo documento
   */
  create(data: Omit<T, 'id'>): Observable<string> {
    const dataWithTimestamp = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    return from(addDoc(this.collectionRef, dataWithTimestamp)).pipe(
      map((docRef: DocumentReference) => docRef.id)
    );
  }

  /**
   * Atualiza um documento existente
   */
  update(id: string, data: Partial<T>): Observable<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    const dataWithTimestamp = {
      ...data,
      updatedAt: Timestamp.now()
    };

    return from(updateDoc(docRef, dataWithTimestamp));
  }

  /**
   * Remove um documento
   */
  delete(id: string): Observable<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    return from(deleteDoc(docRef));
  }

  /**
   * Helper para criar queries com where
   */
  protected whereEqual(field: string, value: unknown) {
    return where(field, '==', value);
  }

  protected whereIn(field: string, values: unknown[]) {
    return where(field, 'in', values);
  }

  protected orderByField(field: string, direction: 'asc' | 'desc' = 'asc') {
    return orderBy(field, direction);
  }

  protected limitTo(count: number) {
    return limit(count);
  }
}
