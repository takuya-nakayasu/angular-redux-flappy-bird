import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgRedux, NgReduxModule, DevToolsExtension } from '@angular-redux/store';
import { rootReducer } from '../state/reducer';
import { INITIAL_STATE, IAppState } from '../state/store';
import { FlappyBirdActions } from '../state/action';

import 'rxjs/Rx';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgReduxModule,
  ],
  providers: [
    FlappyBirdActions,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    ngRedux: NgRedux<IAppState>,
    devTools: DevToolsExtension) { // <- add
      const storeEnhancers = devTools.isEnabled() ? // <- add
      [ devTools.enhancer() ] : // <-add
      []; // <-add
      ngRedux.configureStore(
        rootReducer,
        INITIAL_STATE,
        [], // <- add
        storeEnhancers);
  }
}
