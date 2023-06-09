import { Component } from '@angular/core';
import { FileService } from './services/file.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  filenames: String[] = [];
  fileStatus = {status: '', requestType: '', percent: 0};

  constructor(private fileService: FileService) { }
  
  // upload files
  onUploadFiles(files: File[]): void {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file, file.name);
    }
    this.fileService.upload(formData).subscribe(event => {
      console.log(event);
      this.reportProgress(event);
    },
    (error: HttpErrorResponse) => console.log(error))
  }
  
  // download files
  onDownloadFiles(filename: String): void {
    this.fileService.download(filename).subscribe(event => {
      console.log(event);
      this.reportProgress(event);
    },
    (error: HttpErrorResponse) => console.log(error))
  }

  private reportProgress(event: HttpEvent<String[] | Blob>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.updateStatus(event.loaded, event.total!, 'Uploading... ');
        break
        case HttpEventType.DownloadProgress:
          this.updateStatus(event.loaded, event.total!, 'Downloading... ');
        break
      case HttpEventType.Response:
        this.fileStatus.status = 'done';
        if (event.body instanceof Array) {
          
          for (const filename of event.body) {
            this.filenames.unshift(filename)
          }
          
        } else {
          // download logic
          // saveAs(new File(event.body), event.headers.get('file-name'))
          // saveAs('new File([])', event.headers.get('ile-Name'), { type: `${event.headers.get('content-Type')};charSet=utf-8`})
          // saveAs(new File(event.body), event.headers.get('file-name'), type: `${event.headers.get('content-Type')};charSet=utf-8`)
          this.fileStatus.status = 'done';
        }
        break;
      default:
        console.log(event);
        
        
    }
  }

  private updateStatus(loaded: number, total: number, requestType: string) {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round(100 * loaded / total);
  }
  
}
