window.onload = function() {
    const useNodeJS = true;  // if you are not using a node server, set this value to false
    const defaultLiffId = "";  // change the default LIFF value if you are not using a node server
    let myLiffId = "";  // DO NOT CHANGE THIS

    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};

/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {

    } else {
        initializeLiff(myLiffId);
    }
}

/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            initializeApp();
        })
        .catch((err) => {

        });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    registerButtonHandlers();
    main();
}

/**
* Register event handlers for the buttons displayed in the app
*/
function registerButtonHandlers() {

    // closeWindow call
    document.getElementById('closeWindowButton').addEventListener('click', function() {
        if (!liff.isInClient()) {
            alert('This button is unavailable as LIFF is currently being opened in an external browser.');
        } else {
            liff.closeWindow();
        }
    });

}

/**
 *　main.
 */
function main() {
    // ユーザーIDでAPIを叩いて存在チェック
    const lineUserId     = 'abcdefghijk' // getProfile();
    const endPoint   = `https://endpointurl.sample/${lineUserId}`;
    const Data  = {'userId': 'abcdefghijk', 'janCode': '4968442502345'}; // getRecordJSON(endPoint);
    if (Data.userId) {
        if (!Data.janCode) {
            // 例外：ユーザーID取得できるのにバーコード取得できない
            return;
        }
        JsBarcode("#barcode", Data.janCode);
    } else {
        // フォーム表示処理
    }
}
/**
 * LINEのプロフィールデータを取得する
 */
function getProfile() {
    liff.getProfile().then(profile => {
        return profile.userId;
    }).catch((err) => {
        // LINE側でユーザーID取得できなかった場合
        window.alert('Error getting profile: ' + err);
    });
}

/**
 * API叩いてレコードが取得できるか
 * @param {string} endPoint
 * @return {boolean}
 */
function getRecordJSON(endPoint) {
    var request = new XMLHttpRequest();
    request.open('GET', endPoint, true);
    request.onload = function () {
    // レスポンスが返ってきた時の処理
        var data = this.response;
        // jancodeのキーがある、かつ、値が格納されてればTRUE。※コードはあとで直す
        return 'jancode' in data;
    }
    // リクエストをURLに送信
    request.send();
}

/**
 * API叩いてレコード更新
 * @param {string}
 * @return {boolean}
 */
function updateRecordJSON() {
    // JANコード初回入力時に、lineUserIDを登録する
    // SQLイメージ↓
    // UPDATE xxx SET line_user_id = xxx WHERE jancode = xxxx;
}

// 入力された値のバーコードを表示する。
document.getElementById('submitBarcode').addEventListener('click', function(){
    const inputBarcode = String(document.getElementById('inputBarcode').value);
    JsBarcode("#barcode2", inputBarcode);
});