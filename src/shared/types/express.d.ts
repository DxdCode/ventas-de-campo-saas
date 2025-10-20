import { JwtPayload } from "@infrastructure/services/TokenService"

declare global {
    namespace Express{
        interface Request{
            user?: JwtPayload
        }
    }
}