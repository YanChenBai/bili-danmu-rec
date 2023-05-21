import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  startListen,
  type MsgHandler,
  DanmuMsg,
  Message,
} from 'blive-message-listener';
@Injectable()
export class DanmuService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(DanmuService.name);
  listenerStart(id: number) {
    const handler: MsgHandler = {
      onIncomeDanmu: (msg) => {
        this.addDanmu(msg, id);
      },
    };
    console.log('开始监听房间#' + id);

    startListen(id, handler);
  }
  async addDanmu(msg: Message<DanmuMsg>, roomId: number) {
    const badge = msg.body.user.badge;
    const identity = msg.body.user.identity;
    const data = {
      uname: msg.body.user.uname,
      msg: msg.body.content,
      uid: msg.body.user.uid.toString(),
      messageId: msg.id,
      badge: JSON.stringify(badge ? badge : ''),
      identity: JSON.stringify(identity ? identity : ''),
      raw: JSON.stringify(msg.raw),
      roomId: roomId.toString(),
    };
    this.logger.log(
      `[room#${roomId}][${msg.id}]: ${msg.body.user.uid} # ${msg.body.user.uname}:${msg.body.content}`,
    );
    try {
      await this.prismaService.danmu.create({ data });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
