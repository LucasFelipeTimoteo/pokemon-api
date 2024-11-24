import type { User } from "../../user/types/user";

export interface SafeUser extends Omit<User, "password"> {}
