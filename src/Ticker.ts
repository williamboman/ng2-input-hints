import { EventEmitter } from '@angular/core'

type TickerConfig = {
    waitBeforeDeleteMs: number,
    writeSpeedMs: number,
    deleteSpeedMs: number,
}

enum Tick {
    START_WRITE,
    WRITE,
    START_DELETE,
    DELETE,
}

export default class Ticker {
    private tickTimeout: number | null
    private currentStringIdx = 0
    private currentCharPos = 0
    private isDeleting = false

    private waitBeforeDeleteMs: number
    private writeSpeedMs: number
    private deleteSpeedMs: number


    afterTick: EventEmitter<string> = new EventEmitter()

    constructor(private strings: string[], opts: TickerConfig) {
        this.waitBeforeDeleteMs = opts.waitBeforeDeleteMs
        this.writeSpeedMs = opts.writeSpeedMs
        this.deleteSpeedMs = opts.deleteSpeedMs
    }

    start(): void {
        this.queueNextTick(Tick.START_WRITE)
    }

    stop(): void {
        if (this.tickTimeout != null) {
            clearTimeout(this.tickTimeout)
        }
    }

    private queueNextTick(tickType: Tick): void {
        const timeout =
            tickType === Tick.START_WRITE ? 0 :
            tickType === Tick.WRITE ? this.randomizeTimeout(this.writeSpeedMs) :
            tickType === Tick.DELETE ? this.randomizeTimeout(this.deleteSpeedMs) :
            tickType === Tick.START_DELETE ? this.waitBeforeDeleteMs :
            0

        this.tickTimeout = window.setTimeout(() => this.tick(), timeout)
    }

    private tick(): void {
        const {strings, isDeleting, currentStringIdx, currentCharPos} = this
        const currentString = strings[currentStringIdx]

        const nextCharPos = currentCharPos + (isDeleting ? -1 : 1)

        if (isDeleting) {
            if (nextCharPos < 0) {
                this.isDeleting = false
                this.currentCharPos = 0
                this.currentStringIdx = (currentStringIdx + 1) % strings.length
                this.queueNextTick(Tick.START_WRITE)
            } else {
                this.afterTick.emit(currentString.slice(0, nextCharPos))
                this.currentCharPos = nextCharPos
                this.queueNextTick(Tick.DELETE)
            }
        } else {
            if (nextCharPos > currentString.length) {
                this.isDeleting = true
                this.queueNextTick(Tick.START_DELETE)
            } else {
                this.afterTick.emit(currentString.slice(0, nextCharPos))
                this.currentCharPos = nextCharPos
                this.queueNextTick(Tick.WRITE)
            }
        }
    }

    private randomizeTimeout(maxMs: number): number {
        // TODO: should probably implement a minimum threshold
        return Math.random() * maxMs
    }
}
