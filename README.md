## KOSHIAN Catalog Marker kai
このアドオンは[Pachira](https://addons.mozilla.org/ja/firefox/user/anonymous-a0bba9187b568f98732d22d51c5955a6/)氏の[KOSHIAN 開いたスレをカタログにマーク](https://addons.mozilla.org/ja/firefox/addon/koshian-catalog-marker/)アドオンを改変したものです  

## 機能
* オリジナルの機能（KOSHIAN 開いたスレをカタログにマーク）
  - ふたば☆ちゃんねるのカタログ画面で開いたスレをマークしたりレス数の増加を表示します
* 追加・変更された機能（KOSHIAN Catalog Marker kai）
  - (v1.1)[futaba thread highlighter K](https://github.com/akoya-tomo/futaba_thread_highlighter_K)との連携機能追加  
futaba thread highlighter Kで既読スレをピックアップするための機能を追加しました  
    このアドオン単体での機能の追加はありません  
  - 「開いたスレのスタイル」でカタログにマークする動作を上書きから追記に変更  
    [toshiakisp](https://github.com/toshiakisp)氏の[「合間合間に」\(改変版\)](http://toshiakisp.github.io/akahuku-firefox-sp/#others)アドオンが「スレを無かった事にする」設定で消したスレを、KOSHIAN 開いたスレをカタログにマークアドオンが「開いたスレのスタイル」で上書きすることによって、消したスレが表示されてしまいます  
    そのためスタイルをマークする動作を追記にして非表示設定を消さないように変更しました  
    将来「合間合間に」\(WebExtensions版\)アドオンか類似の機能のアドオンが登場した場合に必要な変更になります  

## インストール
[GitHub](https://github.com/akoya-tomo/koshian_catalog_marker_kai/releases/download/v1.1.0/koshian_catalog_marker_kai-1.1.0-an.fx.xpi)

## 注意事項
* オリジナル版の[AMO](https://addons.mozilla.org/ja/firefox/)での名称と本アドオンの名称が異なるのは、オリジナル版のアドオン内に登録された名称（アドオンマネージャー\(about:addons\)に表示される名称）に合わせているためです
* futaba thread highlighter Kで既読スレピックアップ機能を使うときは必ず**v1.1以上**をインストールして下さい
## 更新履歴
* v1.1.0 2017-12-23
  - futaba thread highlighter Kで既読スレをピックアップするための機能を追加
* v1.0.0 2017-12-17
  - KOSHIAN 開いたスレをカタログにマーク v1.0.0ベース
  - 「開いたスレのスタイル」でカタログにマークする動作を上書きから追記に変更
