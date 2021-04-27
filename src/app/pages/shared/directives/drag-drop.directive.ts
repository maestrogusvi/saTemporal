import { Directive, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[sapperAppDragDrop]'
})
export class DragDropDirective {
  @Output() fileDropped = new EventEmitter<any>();


  @HostBinding('style.background-color') private background = '#f5fcff';
  @HostBinding('style.opacity') private opacity = '1';


  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    this.preventEvent(evt, '#9ecbec', '0.8');
  }
  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    this.preventEvent(evt, '#f5fcff', '1');
  }
  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    this.preventEvent(evt, '#f5fcff', '1');
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }

  }

  /**
   * To prevent propagation
   * @param event: any
   * @returns void
   */
  private preventEvent(event: any, background, opacity): void {
    event.preventDefault();
    event.stopPropagation();
    this.background = background;
    this.opacity = opacity;
  }
}
