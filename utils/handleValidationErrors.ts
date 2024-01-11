import type { FormKitNode } from "@formkit/core";
import { AxiosError } from "axios";

export default function (err: any, node?: FormKitNode) {
    if (err instanceof AxiosError && err.response?.status === 422) {
        node?.setErrors([], err.response.data.errors);
    }
}