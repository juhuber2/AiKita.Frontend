// app.component.ts
import { Component } from '@angular/core';
import { ElectronService } from './electron.service'; // Pfad ggf. anpassen

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  personName = '';
  logText = '';
  selectedPersonId: number | null = null;
  personen: any[] = [];

  constructor(private electron: ElectronService) {}

  savePerson() {
    this.electron.savePerson(this.personName).then(p => {
      this.personen.push(p);
      this.personName = '';
    });
  }

  saveLog() {
    if (this.selectedPersonId && this.logText) {
      const log = {
        personId: this.selectedPersonId,
        inhalt: this.logText,
        zeitpunkt: new Date().toISOString()
      };
      this.electron.saveLog(log).then(() => this.logText = '');
    }
  }
}
