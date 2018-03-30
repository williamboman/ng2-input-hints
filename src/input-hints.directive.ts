import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core'
import { ISubscription } from 'rxjs/Subscription'

import Ticker from './Ticker'

@Directive({
    selector: '[inputHints]',
})
export class InputHints implements OnInit, OnDestroy {

    private ticker: Ticker | null
    private tickerSubscription: ISubscription | null

    @Input('inputHints') placeholders: string[]
    @Input('inputHintsWaitBeforeDeleteMs') waitBeforeDeleteMs: number = 9000
    @Input('inputHintsWriteSpeedMs') writeSpeedMs: number = 100
    @Input('inputHintsDeleteSpeedMs') deleteSpeedMs: number = 60


    constructor(private el: ElementRef) {}

    ngOnInit() {
        this.ticker = new Ticker(this.placeholders, {
            waitBeforeDeleteMs: this.waitBeforeDeleteMs,
            writeSpeedMs: this.writeSpeedMs,
            deleteSpeedMs: this.deleteSpeedMs,
        })
        this.ticker.start()
        this.tickerSubscription = this.ticker.afterTick.subscribe(placeholderValue =>
            this.el.nativeElement.setAttribute('placeholder', placeholderValue)
        )
    }

    ngOnDestroy() {
        if (this.ticker != null) {
            this.ticker.stop()
        }

        if (this.tickerSubscription != null) {
            this.tickerSubscription.unsubscribe()
        }
    }

}
