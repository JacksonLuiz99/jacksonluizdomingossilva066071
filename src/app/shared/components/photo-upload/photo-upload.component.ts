import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { fileToDataUrl, isImageFile } from '../utils/file.utils';

@Component({
  selector: 'app-photo-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss'],
})
export class PhotoUploadComponent {
  @Input() title = 'Foto';
  @Input() uploading = false;
  @Output() upload = new EventEmitter<File>();

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  error: string | null = null;
  isDragging = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];
    if (file) this.processFile(file);
  }

  onFile(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (file) this.processFile(file);

    input.value = '';
  }

  async processFile(file: File) {
    this.error = null;

    if (!isImageFile(file)) {
      this.error = 'Selecione um arquivo de imagem válido.';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.error = 'O arquivo deve ter no máximo 5MB.';
      return;
    }

    this.selectedFile = file;
    this.previewUrl = await fileToDataUrl(file);
  }

  removeFile() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.error = null;
  }
}
