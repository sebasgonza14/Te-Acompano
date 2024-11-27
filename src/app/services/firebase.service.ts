import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Obtener colecciones
  getFamiliares(): Observable<any[]> {
    const dataCollection = collection(this.firestore, 'Familiares');
    return collectionData(dataCollection, { idField: 'id' });
  }

  getNinos(): Observable<any[]> {
    const dataCollection = collection(this.firestore, 'Ninos');
    return collectionData(dataCollection, { idField: 'id' });
  }

  getPsicologos(): Observable<any[]> {
    const dataCollection = collection(this.firestore, 'Psicólogos');
    return collectionData(dataCollection, { idField: 'id' });
  }

  // Métodos de autenticación
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
  
}
