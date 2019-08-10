## <sub><img src="koshian_catalog_marker_v2/icons/icon-48.png"></sub> KOSHIAN カタログマーカー 改
このFirefoxアドオンはふたば☆ちゃんねるのカタログ画面で開いたスレをマークしたりレス数の増加を表示する[Pachira](https://addons.mozilla.org/ja/firefox/user/anonymous-a0bba9187b568f98732d22d51c5955a6/)氏の[KOSHIAN カタログマーカー](https://addons.mozilla.org/ja/firefox/addon/koshian-catalog-marker/)の非公式改変版です。  
[KOSHIAN リロード拡張 改](https://github.com/akoya-tomo/koshian_reload_futaba_kai/)のページ更新無しでのカタログリロードや[futaba thread highlighter K](https://greasyfork.org/ja/scripts/36639-futaba-thread-highlighter-k/)の既読スレピックアップに対応するようにオリジナル版から変更しています。  

※このアドオンはWebExtensionアドオン対応のFirefox専用となります。  
※他のKOSHIAN改変版などのふたば閲覧支援ツールは[こちら](https://github.com/akoya-tomo/futaba_auto_reloader_K/wiki/)。  

## 機能
* オリジナルの機能（KOSHIAN カタログマーカー）
  - カタログ画面で開いたスレをマークしたりレス数の増加を表示します。  
    <img src="images/screenshot01.png?raw=true" alt="スクリーンショット" title="スクリーンショット" width="400px">
  - カタログ画面で古いスレをマークします。（デフォルト：10スレ）  
    <img src="images/screenshot02.png?raw=true" alt="スクリーンショット" title="スクリーンショット" width="400px">
* 変更された機能（KOSHIAN カタログマーカー 改）
  - [futaba thread highlighter K](https://greasyfork.org/ja/scripts/36639-futaba-thread-highlighter-k/)の既読スレピックアップに対応  
    futaba thread highlighter Kで既読スレをピックアップできるように変更しました。  
    <img src="images/screenshot03.png?raw=true" alt="スクリーンショット" title="スクリーンショット" width="400px">
  - [KOSHIAN リロード拡張 改](https://github.com/akoya-tomo/koshian_reload_futaba_kai/)のページ更新無しでのカタログリロードに対応  
  - カタログをレス増加順にソートする機能  
    ![\(New\)](images/new.png "New") KOSHIAN リロード拡張 改と併用した状態で\[増加順\]ボタンを押すとレス増加順に並べることができます。  
    但し、KOSHIAN リロード拡張 改のリロード動作のときだけソートされ、ブラウザでページ更新したときはソートされません。  
  - 新着スレを「New」で表示  

## インストール
**GitHub**  
[![インストールボタン](images/install_button.png "クリックでアドオンをインストール")](https://github.com/akoya-tomo/koshian_catalog_marker_kai/releases/download/v2.2.0/koshian_catalog_marker_kai-2.2.0-fx.xpi)

※「接続エラーのため、アドオンをダウンロードできませんでした。」と表示されてインストール出来ない時はリンクを右クリックしてxpiファイルをダウンロードし、メニューのツール→アドオン（またはCtrl+Shift+A）で表示されたアドオンマネージャーのページにxpiファイルをドラッグ＆ドロップして下さい。  

## 注意事項
* 本アドオンを有効にしたときはオリジナル版を無効にするか削除して下さい。  
* オリジナル版とは別アドオンなので設定は初期値に戻ります。  
  再度設定をお願い致します。  
* ![\(New\)](images/new.png "New") KOSHIAN リロード拡張 改と併用時に本アドオンを無効にしたときは開いているカタログを再読み込みしてください。  
* [futaba\_catalog\_mod（モダンバージョン）](https://userstyles.org/styles/114129/futaba-catalog-mod-modern)使用時にマークが付かないときは、futaba\_catalog\_mod内の  

  ```css
  body > table[align="center"] td:not([__age="9"]), body > table[align="center"] th {
    border-style: none !important;
    border-radius: 8px !important;
  }
  ```

  上の箇所の`border-style`の行から`!important`を削除して、以下のように書き換えてください。  

  ```css
  body > table[align="center"] td:not([__age="9"]), body > table[align="center"] th {
    border-style: none;
    border-radius: 8px !important;
  }
  ```

## 既知の問題
* フレーム表示のカタログでスレを開いたときに既読マークが付かない。  
  - 現時点では仕様となります。カタログをページ更新すると開いたスレにマークが表示されます。  

## 更新履歴
* v2.2.0 2019-08-10
  - KOSHIAN リロード拡張 改 v2.3.0の\[通常順\]\[増加順\]切り替えに対応
  - UNDOしたときに正しいレス増加数が表示されないことがある不具合を修正
* v2.1.0 2019-05-20
  - レス増加順ソート機能を追加（要 KOSHIAN リロード拡張 改）
  - 新着スレに「New」を表示するように修正
* v2.0.2 2019-05-17
  - KOSHIAN リロード拡張 改のページ更新無しでのカタログリロードに対応
* v2.0.1 2018-07-05
  - 記憶するスレの数が設定値を超えたときに超過分だけ破棄するように修正
* v2.0.0 2018-07-02
  - ベースをKOSHIAN カタログマーカー v2.0.1に変更
  - futaba thread highlighter Kの既読スレピックアップに対応
  - フレーム表示のカタログで動作するように修正
* v1.2.2 2018-06-29
  - フレーム表示のカタログで動作するように修正
* v1.2.1 2018-03-31
  - 起動時にオプションの保持時間の設定値が読み込めていない不具合を修正
* v1.2.0 2018-03-31
  - カタログの開いたスレやレス数の情報を保持する条件や時間を変更
  - アドオンの自動更新を有効化
* v1.1.0 2017-12-23
  - futaba thread highlighter Kで既読スレをピックアップするための機能を追加
* v1.0.0 2017-12-17
  - KOSHIAN 開いたスレをカタログにマーク v1.0.0ベース
  - 「開いたスレのスタイル」でカタログにマークする動作を上書きから追記に変更
