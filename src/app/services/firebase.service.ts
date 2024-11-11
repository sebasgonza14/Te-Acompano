import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: Firestore) {}

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
}
