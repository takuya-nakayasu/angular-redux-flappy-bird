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
    // 初期処理
    this.init();

    // clickイベントを検知する
    Observable
      .fromEvent(document, 'click')
      .subscribe(_ => this.action.fly());

    // isEnd$が更新されると呼び出し
    this.isEnd$
      .filter(value => value)
      .subscribe(_ => this.end());

    // backgroundX$が更新されると、背景を動かす
    this.backgroundX$
      .subscribe(
        value => this.el.nativeElement.style.backgroundPosition  = `${value}px`);
  }

  /**
   * 初期化
   *
   * @memberof AppComponent
   */
  init = (): void => {
    const maxY: number
      = window.innerHeight - this.bird.nativeElement.height;
    this.action.setMaxY(maxY);
    this.action.setAy(0.4);
    this.action.setVy(0);
    this.action.setY(0);
    this.start();
  }

  /**
   * ゲームスタート
   * 各処理のインターバルを設定する
   *
   * @memberof AppComponent
   */
  start = (): void => {
    // 20msごとにbirdの落下処理と衝突判定を呼び出す
    this.subscription = Observable.interval(20)
      .subscribe(() => {
        this.action.moveBird();
        this.checkCollision();
      });

    // 2sごとに壁の設置処理を呼び出す
    this.wallSubscription = Observable.interval(2000)
      .subscribe(() => this.setWall());

    // 20msごとに壁の移動処理を呼び出す
    this.moveWallSubscription = Observable.interval(20)
      .subscribe(() => this.moveWall());

    // 20msごとに背景の移動処理を呼び出す
    this.moveBackgroundSubscription = Observable.interval(20)
      .subscribe(() => this.action.moveBackground());

    // 1sごとにスコアのカウントを行う
    this.scoreSubscription = Observable.interval(1000)
      .subscribe(() => this.action.scoreIncrement());
  }

  /**
   * 各処理のインターバルを停止する
   *
   * @memberof AppComponent
   */
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

  /**
   * 壁を設置する
   *
   * @memberof AppComponent
   */
  setWall = (): void => {
    const maxX = window.innerWidth;
    const pos = 20 + Math.random() * 60;

    // 上下に配置する壁になるdiv要素を作成
    const wallTop = this.renderer2.createElement('div');
    const wallBottom = this.renderer2.createElement('div');

    this.renderer2.addClass(wallTop, 'wall');
    this.renderer2.addClass(wallBottom, 'wall');

    this.renderer2.setStyle(wallTop, 'bottom', `${pos + 15}%`);
    this.renderer2.setStyle(wallBottom, 'top', `${(100 - pos) + 15}%`);

    this.renderer2.setStyle(wallTop, 'left', `${maxX}px`);
    this.renderer2.setStyle(wallBottom, 'left', `${maxX}px`);

    // 壁(div)を設置する
    this.renderer2.appendChild(this.el.nativeElement, wallTop);
    this.renderer2.appendChild(this.el.nativeElement, wallBottom);
  }

  /**
   * 設置した壁を横に動かす
   *
   * @memberof AppComponent
   */
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

  /**
   * 衝突判定
   *
   * @memberof AppComponent
   */
  checkCollision = () => {
    const wallList = document.getElementsByClassName('wall');
    const birdRect = this.bird.nativeElement.getBoundingClientRect();
    for (let i = 0; i < wallList.length; i++) {
      const wallRect = wallList[i].getBoundingClientRect();
      if (wallRect.left < birdRect.right && birdRect.left < wallRect.right) {
        if (wallRect.top < birdRect.bottom && birdRect.top < wallRect.bottom) {
          this.action.gameOver();
        }
      }
    }
  }

}
