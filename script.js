// HTMLの要素（パーツ）をJavaScriptから操作できるように取得します
const memoInput = document.getElementById('memoInput');
const aiButton = document.getElementById('aiButton');
const saveButton = document.getElementById('saveButton');
const outputArea = document.getElementById('outputArea');

// 1. ページを開いたとき、もし前に保存したメモがあれば自動で画面に表示する
window.addEventListener('DOMContentLoaded', () => {
    const savedMemo = localStorage.getItem('myMemo');
    if (savedMemo) {
        memoInput.value = savedMemo;
        outputArea.textContent = '保存されていたメモを読み込みました！';
    }
});

// 2. 「ローカルに保存」ボタンが押されたときの処理
saveButton.addEventListener('click', () => {
    const text = memoInput.value;
    
    // ブラウザの「LocalStorage（簡易データ保存機能）」にメモを保存します
    localStorage.setItem('myMemo', text);
    
    outputArea.textContent = '💾 メモをブラウザに保存しました！（オフラインでも残ります）';
});

// 3. 「AIにお願いする」ボタンが押されたときの処理（現在はテスト用の仮の動きです）
aiButton.addEventListener('click', async () => {
    const text = memoInput.value;
    
    if (text.trim() === '') {
        outputArea.textContent = '⚠️ まずはメモ欄に何か文字を入力してくださいね！';
        return;
    }

    outputArea.textContent = '🤖 AIが考えています...少々お待ちください。';

    // ここで疑似的にAIが返事をする処理（あとで本物のAI APIに切り替えます）
    setTimeout(() => {
        outputArea.textContent = '【AIからの返答】\n' + 
            '「' + text + '」ですね！素晴らしいアイデアです。この調子でどんどんメモを書き留めていきましょう！';
    }, 1000); // 1秒後に返事をする演出
});