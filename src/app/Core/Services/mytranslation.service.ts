import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  PLATFORM_ID,
  RendererFactory2,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MytranslationService {
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  private readonly _Renderer2 = inject(RendererFactory2).createRenderer(
    null,
    null
  );

  constructor(private _TranslateService: TranslateService) {
    //Check first that we are on browser
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      //fallback language
      _TranslateService.setDefaultLang('en');

      // change language
      this.useLanguage();
    }
  }

  setLanguage(currentLang: string): void {
    localStorage.setItem('lang', currentLang)
  }

  useLanguage(): void {
    //save current language in localstorage
    const currentLang: string | null = localStorage.getItem('lang');

    //use current language if present in localstorage
    if (currentLang) {
      this._TranslateService.use(currentLang);
    }

    //set attributes in html
    if (currentLang === 'en') {
      this._Renderer2.setAttribute(document.documentElement, 'dir', 'ltr');
      this._Renderer2.setAttribute(document.documentElement, 'lang', 'en');
    } else if (currentLang === 'ar') {
      this._Renderer2.setAttribute(document.documentElement, 'dir', 'rtl');
      this._Renderer2.setAttribute(document.documentElement, 'lang', 'ar');
    } else if (currentLang === 'es') {
      this._Renderer2.setAttribute(document.documentElement, 'dir', 'ltr');
      this._Renderer2.setAttribute(document.documentElement, 'lang', 'es');
    } else if (currentLang === 'de') {
      this._Renderer2.setAttribute(document.documentElement, 'dir', 'ltr');
      this._Renderer2.setAttribute(document.documentElement, 'lang', 'de');
    }

    //for carousel
    if (currentLang === 'ar') {
      localStorage.setItem('dir', 'rtl');
    } else {
      localStorage.setItem('dir', 'ltr');
    }
  }
}
