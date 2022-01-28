import { get, post, del } from "@/utils/request";

export const login = (data) => post("/api/login", data);

export const logout = () => del("/api/login");

export const tourist = () => get("/api/tourist");

export const resetPwd = (data) => post("/api/user_pwd", data);
