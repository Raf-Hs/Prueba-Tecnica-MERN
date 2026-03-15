import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering() // <-- Esta es la "Plataforma" que Angular decía que faltaba
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);