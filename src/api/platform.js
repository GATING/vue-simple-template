import { get } from "@/utils/request";

export const getPlatformConf = () => get("/api/platform_conf");
