import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class UrlService {
  baseUrl = "";
 imageUrl = "https://test.webdevelopmentsolution.net:9085/";
  SERVER_URL = "https://test.webdevelopmentsolution.net:9085"
  // imageUrl = "https://api.tehbola.my"
  // SERVER_URL = "https://api.tehbola.my"

  constructor() { }
  login = `${this.baseUrl}/login`;
}
