import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor() {}

  redirectToVideo() {
    const videoUrl = 'https://www.youtube.com/watch?v=Jkiz0pYqJ4k'; // URL del video de YouTube
    window.open(videoUrl, '_blank'); // Abrir en una nueva pestaña
  }

  redirectToZoom() {
    const zoomMeetingUrl = 'https://usfq.zoom.us/j/89738179056'; // URL de la reunión de Zoom
    window.open(zoomMeetingUrl, '_blank'); // Abrir en una nueva pestaña
  }
  
  

}
