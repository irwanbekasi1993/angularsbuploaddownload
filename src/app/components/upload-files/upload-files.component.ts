import { Component, OnInit } from '@angular/core';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {

  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  fileInfos?: Observable<any>;

  constructor(private uploadService: FileUploadService) { }

  selectFiles(event):void{
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }

  uploadFiles(): void{
    this.message = [];
    if(this.selectedFiles){
for (let i = 0; i < this.selectedFiles.length; i++) {
  this.upload(i,this.selectedFiles[i]);
}
    }
  }

  upload(idx: number, file: File) : void{
    this.progressInfos[idx] = {value: 0, fileName: file.name};
    console.log(this.progressInfos[idx].value);
    if(file){
      this.uploadService.upload(file).subscribe(
        (event: any) => {

          if(event.type === HttpEventType.UploadProgress){
            console.log(event.loaded);
            console.log(event.total);
            this.progressInfos[idx] = {value: Math.round(100 * event.loaded / event.total), fileName: file.name};
          }else if(event instanceof HttpResponse){
            const msg = 'upload file: '+ file.name;
            this.message.push(msg);
            this.fileInfos = this.uploadService.getFiles();
          }
        },(err: any) => {
          this.progressInfos[idx].value= 0;
          const msg = 'could not upload file: '+ file.name;
          this.message.push(msg);
          this.fileInfos = this.uploadService.getFiles();
        }
      )
    }
  }

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
  }

}
