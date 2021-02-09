/**
 * Kind of a dummy class in case we want to add more reporting functionality
 * later
 */

export class MetricReporter {
  public reportIntervalEventInitiated(
    source: string,
    event: string,
    startTime: Date
  ) {
    this.reportEvent(
      source,
      event,
      `STARTED [startTime=${startTime.toISOString()}]`
    );
  }

  public reportIntervalEventCompleted(
    source: string,
    event: string,
    startTime: Date,
    endTime: Date = new Date()
  ) {
    this.reportEvent(
      source,
      event,
      `COMPLETED [endTime=${endTime.toISOString()}] [Duration=${
        endTime.getTime() - startTime.getTime()
      }ms]`
    );
  }

  private reportEvent(source: string, event: string, eventMessage: string) {
    if (parseInt(process.env.DEBUG_WITH_METRICS ?? "0")) {
      console.log(`${source}: ${event} ${eventMessage}`);
    }
  }
}
