import { Injectable } from '@angular/core';
import { UtilsService } from '../../../shared/utils.service';

@Injectable({
  providedIn: 'root'
})
export class TpSourceService {

  constructor(private utilsService: UtilsService) { }

  /**
   * to get ftp file list
   * @param connectionId: string
   * @param directoryPath: string
   */
  getFtpFileList(connectionId, directoryPath): any {
    return this.utilsService.returnGetCall(`/ftp-properties/files?connectionId=${connectionId}&directoryPath=${directoryPath}`);
  }

  /**
   * to get sftp file list
   * @param connectionId: string
   * @param directoryPath: string
   */
  getSftpFileList(connectionId, directoryPath): any {
    return this.utilsService.returnGetCall(`/sftp-properties/files?connectionId=${connectionId}&directoryPath=${directoryPath}`);
  }

  /**
   * to get S3 file list
   * @param connectionId: string
   * @param directoryPath: string
   */
  getS3FileList(connectionId, directoryPath): any {
    return this.utilsService.returnGetCall(`/s3-properties/files?connectionId=${connectionId}&directoryPath=${directoryPath}`);
  }
}
