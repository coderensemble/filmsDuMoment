import { Component, inject } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  InfiniteScrollCustomEvent, 
  IonList, 
  IonAvatar, 
  IonSkeletonText, 
  IonItem, 
  IonAlert, 
  IonLabel, 
  IonBadge,
} from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { catchError, finalize } from 'rxjs';
import { MovieResult } from '../services/interfaces';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonAvatar, 
    IonItem, 
    IonSkeletonText,
    IonAlert,
    DatePipe,
    IonBadge,
  ],
})

export class HomePage {
  public movieService = inject(MovieService);
  public currentPage = 1;
  public error = null;
  public isLoading = false;
  public movies: MovieResult[] = [];
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public dummyArray = new Array(5);

  constructor() {
    this.loadMovies();
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    if (!event) {
      this.isLoading = true;
    }

    this.movieService
    .getTopRatedMovies(this.currentPage)
    .pipe(
      finalize(() => {
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      }),
      catchError((err: any) => {
        console.log(err);

        this.error = err.error.status_message;
        return [];
      })
      )
      .subscribe({
        next: (res) => {
          console.log(res);

          this.movies.push(...res.results);
          if(event) {
            event.target.disabled = res.total_pages === this.currentPage;
          }
        },
      });
    }
    
    loadMore(event: InfiniteScrollCustomEvent) {}
  
}
