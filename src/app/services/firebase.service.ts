import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, collectionData, collection } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Obtener un documento específico de la colección 'users'
  async getUserData(uid: string): Promise<any> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        console.log('Datos del usuario:', userSnapshot.data());
        return userSnapshot.data();
      } else {
        console.warn('No se encontró el documento del usuario.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      throw error;
    }
  }

  // Guardar o actualizar tareas del usuario
  async saveTaskForUser(uid: string, task: { fecha: string; tarea: string }) {
    try {
      const userTasksDocRef = doc(this.firestore, `Calendario/${uid}`);
      const userTasksSnapshot = await getDoc(userTasksDocRef);

      let existingTasks: Array<{ fecha: string; tarea: string }> = [];
      if (userTasksSnapshot.exists()) {
        existingTasks = userTasksSnapshot.data()['tasks'] || [];
      }

      // Agregar la nueva tarea a las tareas existentes
      const updatedTasks = [...existingTasks, task];

      // Actualizar el documento del usuario con las tareas nuevas
      await setDoc(userTasksDocRef, { tasks: updatedTasks }, { merge: true });
      console.log('Tarea guardada correctamente.');
    } catch (error) {
      console.error('Error al guardar la tarea del usuario:', error);
      throw error;
    }
  }

  // Obtener tareas del usuario
  async getTasksForUser(uid: string): Promise<Array<{ fecha: string; tarea: string }>> {
    try {
      const userTasksDocRef = doc(this.firestore, `Calendario/${uid}`);
      const userTasksSnapshot = await getDoc(userTasksDocRef);

      if (userTasksSnapshot.exists()) {
        return userTasksSnapshot.data()['tasks'] || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error al obtener las tareas del usuario:', error);
      throw error;
    }
  }

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
