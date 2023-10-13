
export default class Constants {
    static BackendUrl = "http://localhost:1323"
    static AppName = (page?: string) => "Chatalyst" + (page != undefined ? " - " + page : "")
}
