import Constants from "./Constants";

export function Logout() {
    localStorage.removeItem(Constants.AccessTokenKey);
    localStorage.removeItem(Constants.ProfilePictureKey);
    window.location.reload();
}
