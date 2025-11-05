import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const fileSizeMax = 400 * 1024;
const widthHeightMax = 1024;
const defaultWidthHeightRatio = 1;
const defaultQualityRatio = 0.7;

@Injectable({
  providedIn: 'root',
})
export class CompressImageService {
  compress(file: File): Observable<File> {
    const imageType = file.type || 'image/jpeg' || 'image/jpg' || 'image/png' || 'image/jpeg';
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Observable<File>((observer) => {
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const img = this.createImage(ev);
        const imgWH = img.width > img.height ? img.width : img.height;

        let withHeightRatio =
          imgWH > widthHeightMax ? widthHeightMax / imgWH : defaultWidthHeightRatio;
        let qualityRatio = file.size > fileSizeMax ? fileSizeMax / file.size : defaultQualityRatio;
        img.onload = () => {
          const elem = document.createElement('canvas');
          elem.width = img.width * withHeightRatio;
          elem.height = img.height * withHeightRatio;

          const ctx = elem.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, elem.width, elem.height);
            ctx.canvas.toBlob(
              (blob) => {
                if (blob) {
                  observer.next(
                    new File([blob], file.name, {
                      type: imageType,
                      lastModified: Date.now(),
                    })
                  );
                }
                observer.complete();
              },
              imageType,
              qualityRatio
            );
          } else {
            observer.error('Failed to get 2D rendering context');
            observer.complete();
          }
        };

      };

      reader.onerror = (error) => observer.error(error);
    });
  }

  private createImage(ev: ProgressEvent<FileReader>): HTMLImageElement {
    const imageContent = ev.target?.result as string;
    const img = new Image();
    img.src = imageContent;
    return img;
  }
}
