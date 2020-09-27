export class WsMessage {
  public readonly raw: string;
  public readonly command: string;
  public readonly payload: string;

  public constructor(raw: string, command: string, payload: string) {
    this.raw = raw;
    this.command = command;
    this.payload = payload;
  }

  public static Ex(ev: MessageEvent): WsMessage {
    const raw: string = ev.data;
    const command: string = raw.substring(0, raw.indexOf(' ')) || raw;
    const payload: string = raw.substring(command.length + 1);

    return new WsMessage(raw, command, payload);
  }

  public static Sub(command: string, payload: string, subCommand: string): WsMessage {
    return new WsMessage(
      '{0} {1}'.format(command, payload),
      '{0} {1}'.format(command, subCommand),
      payload.substring(subCommand.length + 1)
    );
  }

  public toString(): string {
    return 'WsMessage[raw={0} command={1} payload={2}]'.format(
      this.raw,
      this.command,
      this.payload
    );
  }
}
