import { Attributes, Message } from '@google-cloud/pubsub';

import { EmittedMessage } from '..';

/**
 * Extends the Google PubSub message class by adding a parsed data getter
 */
export class ExtendedMessage<T> implements EmittedMessage<T> {
  /** Message unique identifier */
  public id: string;
  /** Payload sent */
  public payload: T;
  /** Metadata: namespace, environment etc */
  public metadata?: Attributes;
  /** Acknowledgment unique identifier */
  public ackId?: string;
  /** Counter, if message are ordered */
  public count?: number;
  /** Date of emission */
  public emittedAt: Date;
  /** Date of reception */
  public receivedAt: Date;
  /** Duration in ms */
  public duration: number;

  constructor(message: Message) {
    this.id = message.id;
    // tslint:disable-next-line: no-unsafe-any
    this.payload = JSON.parse(message.data.toString());
    this.metadata = message.attributes;
    this.ackId = message.ackId;
    this.count = isNaN(Number(message.orderingKey)) ? undefined : Number(message.orderingKey);
    this.emittedAt = message.publishTime;
    this.receivedAt = new Date(message.received);
    this.duration = message.received - this.emittedAt.valueOf();
  }
}
