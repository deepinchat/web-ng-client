import { Route } from "@angular/router";
import { CallbackComponent } from "./callback.component";

export default [
    {
        path: ':type',
        component: CallbackComponent
    }
] satisfies Route[];
