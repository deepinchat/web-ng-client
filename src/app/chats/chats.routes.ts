import { Route } from "@angular/router";
import { ChatsComponent } from "./chats.component";
import { RoomComponent } from "./room/room.component";

export default [
    {
        path: '',
        component: ChatsComponent,
        children: [
            {
                path: ':chatId',
                component: RoomComponent
            }
        ]
    }
] satisfies Route[];
