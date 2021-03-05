var CryptoJS = require("crypto-js");
var ADD_WORD_URL = "https://dict.eudic.net/Dicts/SetStarRating";

function buildResult(res) {
    var result = {
        "from": "en",
        "to": "zh-Hans",
        "fromParagraphs": [
            "Success add to word book"
        ],
        "toParagraphs": [res]
    }
    return result;
}

function buildError(res) {
    var result = {
        'type': 'param',
        'message': res,
        'addtion': '无'
    }
    return result;
}

// override
function supportLanguages() {
    return ['auto', 'zh-Hans', 'en'];
}

// override
function translate(query, completion) {
    var login_cookie;
    var text = query.text;
    var fromLanguage = query.detectFrom;

    if (fromLanguage != 'en' || text.search(' ') > 0) {
        completion({'result': buildResult("中文、非英语单词无需添加单词本")});
        return;
    }

    login_cookie = $option.login_cookie;

    if (login_cookie) {
        $log.info('eudic cookie:' + login_cookie);
        addWord(login_cookie, text, completion);
    } else {
        completion({'error': buildError('cookie 缺失')});
    }
}

function addWord(eudicWebSession, word, completion) {
    $http.get({
        url: ADD_WORD_URL,
        header: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'Content-Type': 'application/json',
            'Cookie': `EudicWebSession=${eudicWebSession}`
        },
        body: {
            'rating': 5,
            'lang': 'en',
            'word': word
        },
        handler: function (res) {
            completion({'result': buildResult("添加单词本成功")});
            $log.info('addWord 接口返回值 data : ' + JSON.stringify(data));
        }
    });
}


