import { Component, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { FlappyBirdActions } from '../state/action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  subscription: Subscription;
  wallSubscription: Subscription;
  moveWallSubscription: Subscription;
  moveBackgroundSubscription: Subscription;
  scoreSubscription: Subscription;

  @ViewChild('bird') bird: ElementRef;

  @select() readonly maxY$: Observable<number>;
  @select() readonly birdPosition$: Observable<any>;
  @select() readonly isEnd$: Observable<boolean>;
  @select() readonly backgroundX$: Observable<number>;
  @select() readonly score$: Observable<number>;

  constructor(private action: FlappyBirdActions,
              private renderer2: Renderer2,
              private el: ElementRef,
            ) {}

  ngAfterViewInit() {
    this.init();
    Observable
      .fromEvent(document, 'click')
      .subscribe(_ => this.action.fly());
    this.isEnd$
      .filter(value => value)
      .subscribe(_ => this.end());
    this.backgroundX$
      .subscribe(
        value => this.el.nativeElement.style.backgroundPosition  = `${value}px`);
  }

  setWall = (): void => {
    const maxX = window.innerWidth;
    const pos = 20 + Math.random() * 60;

    const wallTop = this.renderer2.createElement('div');
    const wallBottom = this.renderer2.createElement('div');

    this.renderer2.addClass(wallTop, 'wall');
    this.renderer2.addClass(wallBottom, 'wall');

    this.renderer2.setStyle(wallTop, 'bottom', `${pos + 15}%`);
    this.renderer2.setStyle(wallBottom, 'top', `${(100 - pos) + 15}%`);

    this.renderer2.setStyle(wallTop, 'left', `${maxX}px`);
    this.renderer2.setStyle(wallBottom, 'left', `${maxX}px`);

    this.renderer2.appendChild(this.el.nativeElement, wallTop);
    this.renderer2.appendChild(this.el.nativeElement, wallBottom);
  }

  moveWall = (): void => {
    const wallList = document.getElementsByClassName('wall') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < wallList.length; i++) {
      // tslint:disable-next-line:radix
      let left = parseInt(wallList[i].style.left.replace(/px/, ''));
      left -= 10;
      if (left < -wallList[i].getBoundingClientRect().width) {
        wallList[i].remove();
      } else {
        wallList[i].style.left = `${left}px`;
      }
    }
  }

  init = (): void => {
    const maxY: number
      = window.innerHeight - this.bird.nativeElement.height;
    this.action.setMaxY(maxY);
    this.action.setAy(0.4);
    this.action.setVy(0);
    this.action.setY(0);
    this.start();
  }

  checkCollision = () => {
    const wallList = document.getElementsByClassName('wall');
    const birdRect = this.bird.nativeElement.getBoundingClientRect();
    for (let i = 0; i < wallList.length; i++) {
      const wallRect = wallList[i].getBoundingClientRect();
      if (wallRect.left < birdRect.right && birdRect.left < wallRect.right) {
        if (wallRect.top < birdRect.bottom && birdRect.top < wallRect.bottom) {
          this.end();
        }
      }
    }
  }

  start = (): void => {
    this.subscription = Observable.interval(20)
      .subscribe(() => {
        this.action.moveBird();
        this.checkCollision();
      });
    this.wallSubscription = Observable.interval(2000)
      .subscribe(() => this.setWall());
    this.moveWallSubscription = Observable.interval(20)
      .subscribe(() => this.moveWall());
    this.moveBackgroundSubscription = Observable.interval(20)
      .subscribe(() => this.action.moveBackground());
    this.scoreSubscription = Observable.interval(1000)
      .subscribe(() => this.action.scoreIncrement());
  }

  end = (): void => {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.wallSubscription) {
      this.wallSubscription.unsubscribe();
    }
    if (this.moveWallSubscription) {
      this.moveWallSubscription.unsubscribe();
    }
    if (this.moveBackgroundSubscription) {
      this.moveBackgroundSubscription.unsubscribe();
    }
    if (this.scoreSubscription) {
      this.scoreSubscription.unsubscribe();
    }
  }

}
