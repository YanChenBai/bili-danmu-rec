import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  LiveUserInfo,
  liveUserInfo,
  roomInfo,
  type RoomInfo,
} from '../api/api';
import Axios from 'axios';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Danmu } from './danmu.dto';
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
import getDate from '../utils/getDate';

@Injectable()
export class DanmuService {
  constructor(private readonly prismaService: PrismaService) {}
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
      receiveTime: getDate(msg.timestamp),
    };
  }

  async listenerStart(id: number) {
    const res = await this.getRoomInfo(id);
    if (res === false) return;
    await this.addRoomInfo(id, res.uid, res.room_id);
    const handler: MsgHandler = {
      onIncomeDanmu: (msg) => this.addDanmu(msg, res.room_id),
      onIncomeSuperChat: (msg) => this.addSC(msg, res.room_id),
      onGift: (msg) => this.addGift(msg, res.room_id),
      onGuardBuy: (msg) => this.addGuardBuy(msg, res.room_id),
      onAttentionChange: (msg) => this.addHot(msg, res.room_id),
      onLiveStart: () => this.addTimeLine(true, res.room_id),
      onLiveEnd: () => this.addTimeLine(false, res.room_id),
      onError: (e) => {
        this.logger.error(e);
      },
      onOpen: () => {
        this.logger.log(
          '开始监听房间#' + res.room_id + '@shory_id#' + res.short_id,
        );
        this.logger.log('标题: ' + res.title);
      },
      onClose: () => {
        this.logger.log('连接关闭 #' + res.room_id);
      },
    };
    startListen(id, handler);
  }

  // 添加普通弹幕
  async addDanmu(msg: Message<DanmuMsg>, roomId: number) {
    const data = {
      msg: msg.body.content,
      ...this.getDef(msg, roomId),
      ...this.getUser(msg.body.user),
      createTime: getDate(),
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
      createTime: getDate(),
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
      createTime: getDate(),
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
      createTime: getDate(),
    };
    try {
      await this.prismaService.guardBuy.create({ data });
    } catch (error) {
      this.logger.error(error);
    }
    this.addRaw(msg.raw, msg.id);
  }

  //获取直播间信息
  async getRoomInfo(id: number): Promise<RoomInfo | false> {
    try {
      const info = await Axios<{ data: RoomInfo }>(roomInfo(id));
      return info.data.data;
    } catch (error) {
      this.logger.error('直播间数据获取失败！', error);
      return false;
    }
  }

  // 记录开播下播
  async addTimeLine(state: boolean, roomId: number) {
    const res: RoomInfo | boolean = await this.getRoomInfo(roomId);
    if (res === false) return;
    const { title, keyframe } = res;
    try {
      await this.prismaService.liveTime.create({
        data: {
          roomId: roomId.toString(),
          title,
          cover: keyframe,
          state,
          createTime: getDate(),
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
          createTime: getDate(),
        },
      });
    } catch (error) {
      this.logger.error('热度记录失败！', error);
    }
    this.addRaw(msg.raw, msg.id);
  }

  // 保存直播间名字
  async addRoomInfo(id: number, uid: number, longId: number) {
    const count = await this.prismaService.roomInfo.count({
      where: {
        roomId: id.toString(),
      },
    });
    if (count <= 0) {
      try {
        const res = await Axios<{ data: LiveUserInfo }>(liveUserInfo(uid));
        const name = res.data.data.info.uname;
        const face = res.data.data.info.face;
        await this.prismaService.roomInfo.create({
          data: {
            roomId: id.toString(),
            name,
            face,
            longId: longId.toString(),
            createTime: getDate(),
          },
        });
      } catch (error) {
        this.logger.error('保存主播信息失败', error);
      }
    }
  }

  // 保存原始消息
  async addRaw(msg: any, messageId: string) {
    try {
      const data = {
        content: JSON.stringify(msg),
        messageId,
        createTime: getDate(),
      };
      await this.prismaService.raw.create({ data });
    } catch (error) {
      this.logger.error('原始消息插入失败', error);
    }
  }

  // 查询弹幕
  async getDanmu(info: Danmu) {
    const { id: roomId, uname, msg } = info;
    const page = Number(info.page);
    const pageSzie = 100;
    try {
      const where: any = {
        roomId: roomId.toString(),
      };
      if (uname) where.uname = uname;
      if (msg) where.msg = msg;
      const res = await this.prismaService.$transaction([
        this.prismaService.danmu.count({
          where,
        }),
        this.prismaService.danmu.findMany({
          skip: pageSzie * (page - 1),
          take: pageSzie,
          where,
          orderBy: {
            receiveTime: 'desc',
          },
        }),
      ]);
      return {
        results: res[1],
        pageSzie,
        count: res[0],
        page,
      };
    } catch (error) {
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
