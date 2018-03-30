import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputHints } from './input-hints.directive'

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        InputHints,
    ],
    exports: [
        InputHints,
    ]
})
export class InputHintsModule {}
