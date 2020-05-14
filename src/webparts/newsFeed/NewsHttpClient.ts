import axios, {AxiosRequestConfig} from "axios";
import {NewsItem} from "./NewsFeedWebPart";

export default class NewsHttpClient {
  private static _items: NewsItem[] = [];

  public static get(): Promise<NewsItem[]> {
    return new Promise<NewsItem[]>((resolve) => {
      resolve(NewsHttpClient._items);
    });
  }
}
