import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Loading {
  private loadingsubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingsubject.asObservable();

  constructor(){}

  show(){
    this.loadingsubject.next(true);
  }

  hide(){
    this.loadingsubject.next(false);
  }

  showAndAutoHide() {
    this.show();
    
    setTimeout(() => {
      this.hide();
    }, 3000); // 3000ms = 3 seconds
  }
}
