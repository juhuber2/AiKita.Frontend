import { Injectable } from '@angular/core';

declare global {
    interface Window {
      electronAPI: {
        savePerson: (name: string) => Promise<any>;
        saveLog: (log: { personId: number; inhalt: string; zeitpunkt: string }) => Promise<any>;
      };
    }
  }
  
  @Injectable({ providedIn: 'root' })
  export class ElectronService {
    savePerson(name: string) {
      return window.electronAPI.savePerson(name);
    }
  
    saveLog(log: { personId: number; inhalt: string; zeitpunkt: string }) {
      return window.electronAPI.saveLog(log);
    }
  }
  