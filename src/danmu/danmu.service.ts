import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDanmu } from './danmu.dto';
import {
  startListen,
  type MsgHandler,
  type DanmuMsg,
  type Message,
  type SuperChatMsg,
  type GiftMsg,
  type User,
  GuardBuyMsg,
  AttentionChangeMsg,
} from 'blive-message-listener';
// import getDate from '../utils/getDate';
import { RoomService } from '../room/room.service';
import { RoomInfo } from 'src/api/api';
import { getString, today } from 'src/utils/day';

@Injectable()
export class DanmuService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly roomService: RoomService,
  ) {}
  private readonly logger = new Logger(DanmuService.name);

  getUser(user: User) {
    return {
      uname: user.uname,
      uid: user.uid.toString(),
      badge: user.badge as Prisma.JsonObject,
      identityInfo: user.identity as Prisma.JsonObject,
    };
  }

  getDef(msg: Message<any>, roomId: number) {
    return {
      messageId: msg.id,
      roomId: roomId.toString(),
      receiveTime: getString(msg.timestamp),
    };
  }

  // 开始监房间列表
  async listenerStart() {
    const res = await this.roomService.getRoomList();
    for (const item of res) {
      const roomId = Number(item.roomId);
      const liveRoomInfo = await this.roomService.getRoomInfo(roomId);
      this.logger.log(liveRoomInfo);
      if (liveRoomInfo === false) continue;

      const handler: MsgHandler = {
        onIncomeDanmu: (msg) => this.addDanmu(msg, roomId),
        onIncomeSuperChat: (msg) => this.addSC(msg, roomId),
        onGift: (msg) => this.addGift(msg, roomId),
        onGuardBuy: (msg) => this.addGuardBuy(msg, roomId),
        onAttentionChange: (msg) => this.addHot(msg, roomId),
        onLiveStart: () => this.addTimeLine(true, roomId),
        onLiveEnd: () => this.addTimeLine(false, roomId),
        onError: (e) => {
          this.logger.error(e);
        },
        onOpen: () => {
          this.logger.log('开始监听房间#' + roomId);
          this.logger.log('标题: ' + liveRoomInfo.title);
        },
        onClose: () => {
          this.logger.log('连接关闭 #' + roomId);
        },
      };
      startListen(roomId, handler);
    }
  }

  // 添加普通弹幕
  async addDanmu(msg: Message<DanmuMsg>, roomId: number) {
    const data = {
      msg: msg.body.content,
      ...this.getDef(msg, roomId),
      ...this.getUser(msg.body.user),
      createTime: today(),
    };
    this.logger.log(
      `[普通弹幕][room#${roomId}][${msg.id}]: ${msg.body.user.uid} # ${msg.body.user.uname}:${msg.body.content}`,
    );
    try {
      await this.prismaService.danmu.create({ data });
    } catch (error) {
      this.logger.error(error);
    }
    this.addRaw(msg.raw, msg.id);
  }

  // 添加SC
  async addSC(msg: Message<SuperChatMsg>, roomId: number) {
    const data = {
      msg: msg.body.content,
      ...this.getDef(msg, roomId),
      color: msg.body.content_color,
      price: msg.body.price,
      time: msg.body.time,
      ...this.getUser(msg.body.user),
      createTime: today(),
    };
    this.logger.log(
      `[醒目留言][room#${roomId}][${msg.id}]: ${msg.body.user.uid} # ${msg.body.user.uname}:${msg.body.content}`,
    );
    try {
      await this.prismaService.sC.create({ data });
    } catch (error) {
      this.logger.error(error);
    }
    this.addRaw(msg.raw, msg.id);
  }

  // 添加礼物
  async addGift(msg: Message<GiftMsg>, roomId: number) {
    const data = {
      giftName: msg.body.gift_name,
      giftId: msg.body.gift_id,
      price: msg.body.price,
      amount: msg.body.amount,
      ...this.getDef(msg, roomId),
      ...this.getUser(msg.body.user),
      createTime: today(),
    };
    try {
      await this.prismaService.gift.create({ data });
    } catch (error) {
      this.logger.error(error);
    }
    this.addRaw(msg.raw, msg.id);
  }

  // 添加开通舰长记录
  async addGuardBuy(msg: Message<GuardBuyMsg>, roomId: number) {
    const data = {
      giftName: msg.body.gift_name,
      giftId: msg.body.gift_id,
      price: msg.body.price,
      guardLevel: msg.body.guard_level,
      startTime: new Date(msg.body.start_time),
      endTime: new Date(msg.body.end_time),
      uid: msg.body.user.uid.toString(),
      uname: msg.body.user.uname,
      ...this.getDef(msg, roomId),
      createTime: today(),
    };
    try {
      await this.prismaService.guardBuy.create({ data });
    } catch (error) {
      this.logger.error(error);
    }
    this.addRaw(msg.raw, msg.id);
  }

  // 记录开播下播
  async addTimeLine(state: boolean, roomId: number) {
    const res: RoomInfo | boolean = await this.roomService.getRoomInfo(roomId);
    if (res === false) return;
    const { title, keyframe } = res;
    try {
      await this.prismaService.liveTime.create({
        data: {
          roomId: roomId.toString(),
          title,
          cover: keyframe,
          state,
          createTime: today(),
        },
      });
    } catch (error) {
      this.logger.error((state ? '开播' : '下播') + '记录失败！', error);
    }
  }

  // 热度记录
  async addHot(msg: Message<AttentionChangeMsg>, roomId: number) {
    try {
      this.prismaService.hot.create({
        data: {
          hot: msg.body.attention,
          roomId: roomId.toString(),
          messageId: msg.id,
          createTime: today(),
        },
      });
    } catch (error) {
      this.logger.error('热度记录失败！', error);
    }
    this.addRaw(msg.raw, msg.id);
  }

  // 保存原始消息
  async addRaw(msg: any, messageId: string) {
    return;
    try {
      const data = {
        content: JSON.stringify(msg),
        messageId,
        createTime: today(),
      };
      await this.prismaService.raw.create({ data });
    } catch (error) {
      this.logger.error('原始消息插入失败', error);
    }
  }

  // 查询弹幕
  async getDanmu(queryParams: QueryDanmu) {
    try {
      const { pageSize, page, roomId, uname, msg, startTime, endTime, uid } =
        queryParams;
      const receiveTime: { gte?: string; lte?: string } = {};
      startTime ? (receiveTime.gte = getString(startTime)) : '';
      endTime ? (receiveTime.lte = getString(endTime)) : '';
      const where = {
        roomId,
        uname: { contains: uname },
        msg: { contains: msg },
        uid,
        receiveTime,
      };

      const res = await this.prismaService.$transaction([
        this.prismaService.danmu.count({
          where,
        }),
        this.prismaService.danmu.findMany({
          skip: pageSize * (page - 1),
          take: pageSize,
          where,
          orderBy: {
            receiveTime: 'desc',
          },
        }),
      ]);
      return {
        results: res[1],
        pageSzie: pageSize,
        count: res[0],
        page: page,
      };
    } catch (error) {
      throw new HttpException('查询失败!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
