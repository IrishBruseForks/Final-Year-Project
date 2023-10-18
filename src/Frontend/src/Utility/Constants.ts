export default class Constants {
  static BackendUrl = "http://localhost:1323/";
  static AppName = (page?: string) => "Chatalyst" + (page != undefined ? " - " + page : "");
  static GoogleAppID = "412063810327-6hekt3kap7sfjqi7djcarf0e9tqsb6ti.apps.googleusercontent.com";

  static AccessTokenKey = "access-token";
  static UserIdKey = "user-id";
  static ProfilePictureKey = "profile-picture";
}
