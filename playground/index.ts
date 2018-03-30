/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { InputHintsModule }  from '../src/index';

@Component({
  selector: 'app',
  template: `<input [inputHints]="['Foo bar', 'Lorem ipsum']" />`
})
class AppComponent {}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, InputHintsModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
