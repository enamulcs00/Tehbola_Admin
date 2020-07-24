import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class UrlService {
  baseUrl = "";
  imageUrl = "https://appgrowthcompany.com:3083/";
  SERVER_URL = "https://appgrowthcompany.com:3083"
  constructor() { }
  login = `${this.baseUrl}/login`;
}
