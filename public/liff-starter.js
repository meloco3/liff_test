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
                document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
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
        document.getElementById("liffAppContent").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
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
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            document.getElementById("liffAppContent").classList.add('hidden');
            document.getElementById("liffInitErrorMessage").classList.remove('hidden');
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
            sendAlertIfNotInClient();
        } else {
            liff.closeWindow();
        }
    });

    // sendMessages call
    document.getElementById('sendMessageButton').addEventListener('click', function() {
        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            liff.sendMessages([{
                'type': 'text',
                'text': "You've successfully sent a message! Hooray!"
            }]).then(function() {
                window.alert('Message sent');
            }).catch(function(error) {
                window.alert('Error sending message: ' + error);
            });
        }
    });

    // get access token
    document.getElementById('getAccessToken').addEventListener('click', function() {
        if (!liff.isLoggedIn() && !liff.isInClient()) {
            alert('To get an access token, you need to be logged in. Please tap the "login" button below and try again.');
        } else {
            const accessToken = liff.getAccessToken();
            document.getElementById('accessTokenField').textContent = accessToken;
            toggleAccessToken();
        }
    });

}

/**
 *　main.
 */
function main() {
    // profile.userIdの値を取得
    const userId = getProfile();
    // profile.userIdの値を保持するレコードがあるか検索
    const endPoint = `https://endpointurl.sample/${userId}`;
    // [TRUE] JANコードを取得
    // [FALSE] JANコードを入力するフォームを生成
    const hasRecord = true;//getRecord(endPoint);
    if (hasRecord) {

    } else {

    }
}

/**
 * LINEのプロフィールデータを取得する
 */
function getProfile() {
    liff.getProfile().then(profile => {
        //return profile.userId;
    }).catch((err) => {
        window.alert('Error getting profile: ' + err);
    });
}
/**
* Alert the user if LIFF is opened in an external browser and unavailable buttons are tapped
*/
function sendAlertIfNotInClient() {
    alert('This button is unavailable as LIFF is currently being opened in an external browser.');
}

/**
* Toggle access token data field
*/
function toggleAccessToken() {
    toggleElement('accessTokenData');
}

/**
* Toggle specified element
* @param {string} elementId The ID of the selected element
*/
function toggleElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
        elem.style.display = 'none';
    } else {
        elem.style.display = 'block';
    }
}

/**
 * API叩いてレコードが取得できるか
 * @param {string} endPoint
 * @return {boolean}
 */
function getRecord(endPoint) {
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