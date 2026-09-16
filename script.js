// HTMLの要素を取得
const memoInput = document.getElementById('memoInput');
const aiButton = document.getElementById('aiButton');
const saveButton = document.getElementById('saveButton');
const outputArea = document.getElementById('outputArea');

// 1. ページ読み込み時：保存されたメモがあれば読み込む
window.addEventListener('DOMContentLoaded', () => {
    const savedMemo = localStorage.getItem('myMemo');
    if (savedMemo) {
        memoInput.value = savedMemo;
        outputArea.textContent = '💾 保存されていたメモを読み込みました！';
    }

    // Service Workerの登録（オフライン対応）
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then((reg) => console.log('ServiceWorker registered:', reg.scope))
            .catch((err) => console.error('ServiceWorker registration failed:', err));
    }
});

// 2. 「ローカルに保存」ボタン
saveButton.addEventListener('click', () => {
    const text = memoInput.value;
    localStorage.setItem('myMemo', text);
    outputArea.textContent = '💾 メモをブラウザに保存しました！（オフラインでも残ります）';
});

// 3. 「AIにお願いする」ボタン（安全なサーバー中継版）
aiButton.addEventListener('click', async () => {
    const text = memoInput.value.trim();
    
    if (!text) {
        outputArea.textContent = '⚠️ まずはメモ欄に何か文字を入力してくださいね！';
        return;
    }

    // 処理中のUI制御（連打防止）
    aiButton.disabled = true;
    aiButton.textContent = '🤖 考え中...';
    outputArea.textContent = '🤖 AIが考えています...少々お待ちください。';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        if (response.ok && data.reply) {
            outputArea.textContent = `【AIからの返答】\n${data.reply}`;
        } else {
            outputArea.textContent = `⚠️ エラー: ${data.error || 'AIからの返答を取得できませんでした。'}`;
        }

    } catch (error) {
        console.error(error);
        outputArea.textContent = '⚠️ 通信エラーが発生しました。インターネット接続を確認してください。';
    } finally {
        // 処理終了後にボタンを元に戻す
        aiButton.disabled = false;
        aiButton.textContent = '🤖 AIにお願いする';
    }
});