import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import Axios from 'axios';
import { LiveUserInfo, RoomInfo, liveUserInfo, roomInfo } from 'src/api/api';
import { PrismaService } from 'src/prisma/prisma.service';
import getDate from 'src/utils/getDate';

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(RoomService.name);

  // 保存直播间名字
  async addRoomInfo(id: number) {
    const res = await this.getRoomInfo(id);
    if (res === false)
      throw new HttpException(
        '房间信息获取失败!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    else if (res === null)
      throw new HttpException('房间不存在!', HttpStatus.NOT_FOUND);
    const count = await this.prismaService.roomInfo.count({
      where: {
        roomId: res.room_id.toString(),
      },
    });
    if (count <= 0) {
      try {
        const userInfo = await Axios<{ data: LiveUserInfo }>(
          liveUserInfo(res.uid),
        );
        const name = userInfo.data.data.info.uname;
        const face = userInfo.data.data.info.face;
        return await this.prismaService.roomInfo.create({
          data: {
            roomId: id.toString(),
            name,
            face,
            shortId: res.short_id.toString(),
            createTime: getDate(),
          },
        });
      } catch (error) {
        this.logger.error('保存主播信息失败', error);
        throw new HttpException(
          '保存主播信息失败',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      this.logger.error('房间已经添加啦, 不要这样啦!');
      throw new HttpException(
        '房间已经添加啦, 不要这样啦!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 获取直播间列表
  async getRoomList() {
    try {
      return await this.prismaService.roomInfo.findMany();
    } catch (error) {
      this.logger.error('获取失败!', error);
      throw new HttpException('获取失败!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //获取直播间信息
  async getRoomInfo(id: number): Promise<RoomInfo | false | null> {
    try {
      const info = await Axios<{
        data: RoomInfo;
        code: number;
        message: string;
      }>(roomInfo(id));
      if (info.data.code !== 0) {
        return null;
      }
      return info.data.data;
    } catch (error) {
      this.logger.error('直播间数据获取失败！', error);
      return false;
    }
  }
}
