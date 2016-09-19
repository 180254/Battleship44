declare namespace game {

    interface Starter {
        init(): void;
    }

    interface Ws {
        init(): void;
        send(msg: string): void;
    }

    interface OnEvent {
        onOpen(ev: Event): void;
        onMessage(ev: MessageEvent): void;
        onSend(ev: string): void;
        onClose(ev: CloseEvent): void;
        onError(ev: Event): void;
    }

    interface Message {
        readonly raw: string;
        readonly command: string;
        readonly payload: string;
    }

    interface OnMessage {
        process(msg: Message): void;
    }
}
