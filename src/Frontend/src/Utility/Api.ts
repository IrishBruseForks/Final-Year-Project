import axios from "axios";
import Constants from "./Constants";
import { OAuthResponse } from "../Types/ServerTypes";

export default class Api {
    /**
    * POST /auth/google
    */
    static async AuthGoogle(code: string): Promise<OAuthResponse> {
        const resp = await axios.post(Constants.BackendUrl + "auth/google", {
            code: code,
        });
        return resp.data as OAuthResponse;
    }

    /**
    * GET /status
    */
    static Status(): Promise<any> {
        const url = Constants.BackendUrl + "status";
        return axios.get(url)
    }
}
