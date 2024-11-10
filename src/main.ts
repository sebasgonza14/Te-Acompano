import { provideAuth, getAuth, initializeAuth, indexedDBLocalPersistence } from '@angular/fire/auth';
import { Capacitor } from '@capacitor/core';
import { getApp } from '@angular/fire/app';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

provideAuth(() => {
  if (Capacitor.isNativePlatform()) {
    return initializeAuth(getApp(), {
      persistence: indexedDBLocalPersistence,
    });
  } else {
    return getAuth();
  }
});


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
