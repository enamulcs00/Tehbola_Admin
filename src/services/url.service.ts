import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class UrlService {
  baseUrl = "";
  imageUrl = "https://appgrowthcompany.com:9079/";
  SERVER_URL = "https://appgrowthcompany.com:9079"
  constructor() { }
  login = `${this.baseUrl}/login`;
}
