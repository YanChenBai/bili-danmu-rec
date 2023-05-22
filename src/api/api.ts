import { AxiosRequestConfig } from 'axios';

// 获取直播间数据
export interface RoomInfo {
  uid: number;
  room_id: number;
  short_id: number;
  title: string;
  user_cover: string;
  keyframe: string;
}
export const roomInfo = (roomId: number): AxiosRequestConfig => ({
  method: 'GET',
  url: `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`,
});

// 获取主播信息
export interface LiveUserInfo {
  info: {
    uid: number;
    uname: string;
    face: string;
    gender: number;
  };
}
export const liveUserInfo = (uid: number): AxiosRequestConfig => ({
  method: 'GET',
  url: `https://api.live.bilibili.com/live_user/v1/Master/info?uid=${uid}`,
});
