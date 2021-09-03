import {
  Provide,
  Scope,
  ScopeEnum,
  Init,
  Config,
  Destroy,
  Autoload,
} from '@midwayjs/decorator';
import * as amqp from 'amqp-connection-manager';
import { Channel, Connection } from 'amqplib';

import { RabbitmqConfig } from '../../config/config.types';

@Autoload()
@Scope(ScopeEnum.Singleton) // Singleton 单例，全局唯一（进程级别）
@Provide()
export class RabbitmqService {
  private channel: Channel; // 通道

  private connection: Connection; // mq 连接

  @Config('rabbitmq')
  private rabbitmq: RabbitmqConfig;

  @Init()
  async connect() {
    // 创建连接
    // @FIXME type assert
    this.connection = (await amqp.connect(
      this.rabbitmq.url
    )) as unknown as Connection;

    // 创建 channel
    this.channel = await this.connection.createChannel();

    // 绑定队列
    await this.channel.assertQueue('my-queue', {
      exclusive: true,
      autoDelete: true,
    });
    // 绑定交换机
    await this.channel.bindQueue('my-queue', 'my-exchange', 'create');

    return this.connection;
  }

  /**
   * 发送消息
   * @param queueName 队列名称
   * @param data 数据
   * @returns
   */
  public async sendToQueue(queueName: string, data: any) {
    return this.channel.sendToQueue(queueName, Buffer.from(data), {
      // RabbitMQ关闭时，消息会被保存到磁盘
      persistent: true,
    });
  }

  @Destroy()
  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}
