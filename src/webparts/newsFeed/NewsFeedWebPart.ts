import {Version} from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import {BaseClientSideWebPart} from '@microsoft/sp-webpart-base';
import {escape} from '@microsoft/sp-lodash-subset';

import styles from './NewsFeedWebPart.module.scss';
import * as strings from 'NewsFeedWebPartStrings';
import axios, {AxiosRequestConfig} from "axios";
import NewsHttpClient from "./NewsHttpClient";
import {SPComponentLoader} from "@microsoft/sp-loader";

export interface INewsFeedWebPartProps {
  description: string;
}

export interface NewsArticles {
  value: NewsItem[];
}

export interface NewsItem {
  Title: string;
  Id: string;
  Url: string;
  Author: string;
  Description: string;
  PublishedDate: string;
  Source: string;
}

export default class NewsFeedWebPart extends BaseClientSideWebPart <INewsFeedWebPartProps> {
  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.newsFeed}">
        <h3>Coronavirus(Covid-19) Updates</h3>
        <div class="newsWrapper ${styles.container}">
          <div class="${styles.row}"/>
        </div>
      </div>`;

    this._renderListAsync();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private _getNewsListData() {
    // @ts-ignore
    return axios.get(`https://newsapi.org/v2/everything?q=covid&apiKey=be551f2f05a54f679e5e8297e39fac0e`)
      .then((response) => {
        console.log(response);
        return response.data.articles;
      }).catch(err => console.log(err));
  }

  private _renderList(items): void {
    let html: string = '';

    items.forEach((item) => {
      html += `
        <div class="${styles.newsWrapper}">
          <div class="${styles.newsItem} ${styles.column}">
              <div class="card ${styles.row}">
                <div class="card-content ${styles.column}">
                    <h2 class="${styles.articleTitle}">${item.title}</h2>
                    <p class=""><span>${item.author}, ${item.source.name}</span></p>
                    <p class="">${item.description}</p>
                    <a href="${item.url}" target="_blank" class="">
                        <span class="">Read more</span>
                    </a>
                </div>
                <div class="card-image ${styles.column}">
                    <img src="${item.urlToImage}" alt="">
                </div>
              </div>
          </div>
        </div>`;
    });

    const listContainer: Element = this.domElement.querySelector('.newsWrapper');
    listContainer.innerHTML = html;
  }

  private _renderListAsync(): void {
    this._getNewsListData()
      .then((response) => {
        this._renderList(response);
      });
  }
}
