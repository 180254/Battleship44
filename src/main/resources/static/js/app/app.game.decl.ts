namespace game {
    "use strict";

    export interface Starter {
        init(): void;
    }

    export interface Ws {
        init(): void;
        send(msg: string): void;
    }

    export interface OnEvent {
        onOpen(ev: Event): void;
        onMessage(ev: MessageEvent): void;
        onSend(ev: string): void;
        onClose(ev: CloseEvent): void;
        onError(ev: Event): void;
    }

    export interface Message {
        readonly raw: string;
        readonly command: string;
        readonly payload: string;
    }

    export interface OnMessage {
        process(msg: Message): void;
    }
}
