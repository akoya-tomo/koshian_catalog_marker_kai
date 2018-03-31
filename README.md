## KOSHIAN Catalog Marker kai
このFirefoxアドオンはふたば☆ちゃんねるのカタログ画面で開いたスレをマークしたりレス数の増加を表示する[Pachira](https://addons.mozilla.org/ja/firefox/user/anonymous-a0bba9187b568f98732d22d51c5955a6/)氏の[KOSHIAN 開いたスレをカタログにマーク](https://addons.mozilla.org/ja/firefox/addon/koshian-catalog-marker/)アドオンを改変したものです。  
開いたスレやレス数の情報が閲覧中に消えにくいようにオリジナル版から変更しています。  

※このアドオンはWebExtensionアドオン対応のFirefox専用となります。  
※他のこしあんアドオン改変版とUserscriptは[こちら](https://github.com/akoya-tomo/futaba_auto_reloader_K/wiki/)の一覧からどうぞ。  

## 機能
* オリジナルの機能（KOSHIAN 開いたスレをカタログにマーク）
  - ふたば☆ちゃんねるのカタログ画面で開いたスレをマークしたりレス数の増加を表示します。
* 追加・変更された機能（KOSHIAN Catalog Marker kai）
  - \(New\) 開いたスレやレス数の情報を保持する条件や時間を変更  
    オリジナル版ではカタログを開いてから1時間後にカタログの全情報（開いたスレやレス数の情報を含む）がクリアされます。これをカタログが**最後に更新**されてから**設定時間後**にクリアするように変更しました。  
    また、開いたスレの情報もスレを開いてから1時間後にクリアされていましたが、スレを**最後に更新**してから**設定時間後**にクリアするように変更しました。  
    上記の情報の保持時間はアドオンのオプション画面で設定できます。デフォルトの1時間だと頻繁にクリアされる場合は少し増やしてみてください。  
  - 「開いたスレのスタイル」でカタログにマークする動作を上書きから追記に変更  
    [toshiakisp](https://github.com/toshiakisp)氏の[「合間合間に」\(改変版\)](http://toshiakisp.github.io/akahuku-firefox-sp/#others)アドオンが「スレを無かった事にする」設定で消したスレを、KOSHIAN 開いたスレをカタログにマークアドオンが「開いたスレのスタイル」で上書きすることによって、消したスレが表示されてしまいます。  
    そのためマークする動作を追記にして非表示設定が上書きされないように変更しました。  
  - [futaba thread highlighter K](https://github.com/akoya-tomo/futaba_thread_highlighter_K)との連携機能追加  
    ~~futaba thread highlighter Kで既読スレをピックアップするための機能を追加しました。~~  
    futaba thread highlighter K rev5で本アドオン以外の既読マークできるアドオンでもピックアップできるようになりました。  

## インストール
[GitHub](https://github.com/akoya-tomo/koshian_catalog_marker_kai/releases/download/v1.1.0/koshian_catalog_marker_kai-1.1.0-an.fx.xpi)

※「接続エラーのため、アドオンをダウンロードできませんでした。」と表示されてインストール出来ない時はリンクを右クリックしてxpiファイルをダウンロードし、メニューのツール→アドオン（またはCtrl+Shift+A）で表示されたアドオンマネージャーのページにxpiファイルをドラッグ＆ドロップして下さい。  

## 注意事項
* このアドオンはWebExtensionアドオン対応のFirefox専用です。  
* 本アドオンを有効化したときはオリジナル版を無効化または削除して下さい。  
* オリジナル版とは別アドオンなので設定は初期値に戻ります。  
  再度設定をお願い致します。  
* オリジナル版のAMO\(addons.mozilla.org\)での名称と本アドオンの名称が異なるのは、オリジナル版のアドオン内に登録された名称（アドオンマネージャー\(about:addons\)に表示される名称）に合わせているためです。  
* ~~futaba thread highlighter Kで既読スレピックアップ機能を使うときは必ず**v1.1以上**をインストールして下さい。~~  
  futaba thread highlighter K rev5でバージョン制限は無くなりました。  

## 更新履歴
* v1.2.0 2018-03-31
  - カタログの開いたスレやレス数の情報を保持する条件や時間を変更
  - アドオンの自動更新を有効化
* v1.1.0 2017-12-23
  - futaba thread highlighter Kで既読スレをピックアップするための機能を追加
* v1.0.0 2017-12-17
  - KOSHIAN 開いたスレをカタログにマーク v1.0.0ベース
  - 「開いたスレのスタイル」でカタログにマークする動作を上書きから追記に変更
