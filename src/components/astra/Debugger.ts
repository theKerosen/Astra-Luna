import { Console } from "console";

export class AstraDebugger extends Console {
  private print(message: unknown) {
    this.log("<- [Astra Debugger Message] ->");
    this.log(message);
    this.log("<- End of message ->");
  }
  private printTrace(object: unknown) {
    this.log("\n<- [Astra Debugger Trace] ->\n");
    this.print(object);
    this.trace(object);
    this.log("\n<-- End of trace -->\n");
  }

  /**
   *
   * @param level Level of debugging, 1 being simple logging, 2 tracing & logging
   */
  attach(classname: string, debug: unknown, level: 1 | 2) {
    this.log(`\n[Astra Debugger] -> "${classname}" DUMPs\n`);
    switch (level) {
      case 1:
        this.print(debug);
        break;
      case 2:
        this.printTrace(debug);
    }
  }
}
