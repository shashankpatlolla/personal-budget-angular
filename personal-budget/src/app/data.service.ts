import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Import the tap operator

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data: any[] = [];
  private dataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private dataLoaded: boolean = false; // Track whether data is already loaded

  constructor(private http: HttpClient) { }

  fetchData() {
    if (!this.dataLoaded) {
      return this.http.get('http://localhost:3005/budget').pipe(
        tap((res: any) => {
          this.dataLoaded = true;
          this.data = res.myBudget;
          this.dataSubject.next(this.data);        })
      );
    } else {
      return this.dataSubject.asObservable();
    }
  }
  // fetchData() {
  //   return this.http.get('http://localhost:3005/budget');
  // }
}
