import request from "@/utils/request";

import type { CommonResponse } from "@/utils/request";
import type { Token } from "./data";

export async function postChat(chat: string) {
    const response = (
        await request({
            url: `/chat`,
            method: "POST",
            data: {
                "test": true,
                "self_id": 10000,
                "time": 1676913595310,
                "post_type": "message",
                "message_type": "friend",
                "sub_type": "normal",
                "group_id": 826198224,
                "group_name": "测试群",
                "user_id": 805475874,
                "anonymous": null,
                "message": [
                    {
                        "type": "text",
                        "text": chat
                    }
                ],
                "raw_message": "#uid",
                "font": "微软雅黑",
                "sender": {
                    "user_id": 805475874,
                    "nickname": "测试",
                    "card": "this_is_card",
                    "sex": "male",
                    "age": 0,
                    "area": "unknown",
                    "level": 2,
                    "role": "owner",
                    "title": ""
                },
                "group": {
                    "mute_left": 0
                },
                "friend": {},
                "message_id": "JzHU0DACliIAAAD3RzTh1WBOIC48"
            }
        })
    ).data as CommonResponse;

    return response.data as Array<Token>;
}