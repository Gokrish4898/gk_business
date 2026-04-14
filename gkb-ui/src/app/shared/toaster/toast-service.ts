import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts: ToastMessage[] = [];
  private toastSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this.toastSubject.asObservable();

  show(text: string, type: 'success' | 'error' | 'warning' | 'info' = 'success', position: ToastMessage['position'] = 'top-right') {
    const id = Date.now();
    const newToast = { id, type, text, position };
    this.toasts.push(newToast);
    this.toastSubject.next([...this.toasts]);

    // Auto-remove after 5 seconds (gives time for the 3D animation!)
    setTimeout(() => this.remove(id), 5000);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastSubject.next([...this.toasts]);
  }
}